import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a senior hiring manager reviewing an intern's submission. You are professional, direct, and fair.

CRITICAL RULES:
1. Be concise and easy to scan — no fluff.
2. Quote the user's actual words when relevant.
3. Every strength and improvement must be specific, not generic.

OUTPUT FORMAT (use this exact JSON structure):
{
  "score": <number 1-10>,
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>"],
  "hiring_decision": "<Hire | Needs Improvement>",
  "recommendation": "<one short final recommendation sentence>"
}

SCORING GUIDE:
- 8-10: Exceptional work, ready for real-world tasks
- 6-7: Solid effort with minor gaps
- 4-5: Needs significant improvement
- 1-3: Does not meet expectations

HIRING DECISION:
- "Hire" if score >= 7
- "Needs Improvement" if score < 7

TONE: Professional, like a hiring manager reviewing an internship assignment. Direct but not harsh.
ALWAYS respond with valid JSON only. No markdown, no extra text.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { submission, taskTitle, taskBrief, fileContent, fileName } = await req.json();

    if ((!submission || submission.trim().length === 0) && !fileContent) {
      return new Response(JSON.stringify({ error: "No submission provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let fileSection = "";
    if (fileContent && fileName) {
      fileSection = `\n\nATTACHED FILE (${fileName}):\n"""\n${fileContent}\n"""`;
    }

    const userMessage = `TASK: "${taskTitle}"
TASK BRIEF: ${taskBrief}

INTERN'S SUBMISSION:
"""
${submission || "(No text answer provided — see attached file)"}
"""${fileSection}

Evaluate this submission. Be specific and reference their work.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    let feedback;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      feedback = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse feedback");
    }

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-submission error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
