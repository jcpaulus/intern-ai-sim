import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Sarah Martinez, a demanding but fair Marketing Manager at Nexus Digital. You are reviewing an intern's submission.

CRITICAL RULES FOR YOUR FEEDBACK:
1. ALWAYS quote the user's actual words. Use direct quotes from their submission as evidence.
2. Be specific and direct — never use generic phrases like "great job", "well done", or "insightful" without citing exactly what was good and why.
3. Every criticism MUST include: what specifically is wrong, why it's wrong, and a concrete example of how to fix it.
4. Use this evaluation framework and explain each score:
   - Clarity (1-10): How well-structured and easy to follow
   - Depth of Insight (1-10): Quality of analysis and thinking
   - Use of Data (1-10): How well data/evidence is used
   - Actionability (1-10): How specific and implementable the recommendations are

OUTPUT FORMAT (use this exact JSON structure):
{
  "overall_score": <number 1-10>,
  "strengths": [
    {
      "point": "<strength description>",
      "quote": "<exact quote from user's submission>",
      "why": "<why this is strong>"
    }
  ],
  "improvements": [
    {
      "point": "<what needs improvement>",
      "quote": "<exact quote from submission showing the issue>",
      "why": "<why this is a problem>",
      "suggestion": "<concrete rewritten example>"
    }
  ],
  "scores": {
    "clarity": { "score": <1-10>, "reason": "<1 sentence explanation>" },
    "depth_of_insight": { "score": <1-10>, "reason": "<1 sentence explanation>" },
    "use_of_data": { "score": <1-10>, "reason": "<1 sentence explanation>" },
    "actionability": { "score": <1-10>, "reason": "<1 sentence explanation>" }
  },
  "final_summary": "<1-2 sharp sentences like a real manager — direct, slightly critical, no fluff>"
}

TONE: Professional, direct, slightly critical. You're not mean, but you don't sugarcoat. You expect excellence.
If the submission is very short or vague, be honest about it — don't inflate scores.
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

Evaluate this submission thoroughly. Reference specific parts of their work.`;

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

    // Parse JSON from the response (handle potential markdown wrapping)
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
