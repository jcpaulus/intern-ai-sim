import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Sarah Martinez, a senior hiring manager reviewing an intern's submission. You are professional, direct, and fair.

CRITICAL RULES:
1. Be concise and easy to scan — no fluff.
2. Quote the user's actual words when relevant.
3. Every strength and improvement must be specific, not generic.
4. If only a text answer is provided, evaluate the text.
5. If only a file is provided, evaluate the file content.
6. If both text and file are provided, evaluate them together as a combined submission.

EVALUATION RUBRIC — Score each dimension 1-10:
- Clarity: Is the writing clear, well-structured, and easy to follow?
- Depth of Insight: Does the submission show critical thinking and nuanced understanding?
- Use of Data: Does the submission reference specific data, examples, or evidence?
- Actionability: Are the proposals concrete and implementable?

OUTPUT FORMAT (use this exact JSON structure):
{
  "score": <number 1-10, average of dimension scores>,
  "scores": {
    "clarity": { "score": <1-10>, "reason": "<one sentence>" },
    "depth_of_insight": { "score": <1-10>, "reason": "<one sentence>" },
    "use_of_data": { "score": <1-10>, "reason": "<one sentence>" },
    "actionable": { "score": <1-10>, "reason": "<one sentence>" }
  },
  "strengths": [
    { "point": "<strength title>", "quote": "<quoted evidence from submission>", "why": "<why this matters>" }
  ],
  "improvements": [
    { "point": "<area title>", "quote": "<quoted evidence or gap>", "why": "<why this matters>", "suggestion": "<concrete suggested revision>" }
  ],
  "suggested_improvements": ["<specific actionable suggestion 1>", "<specific actionable suggestion 2>"],
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

    // Build submission content based on what's provided
    let submissionSection = "";
    
    if (submission && submission.trim().length > 0 && fileContent) {
      // Both text and file
      submissionSection = `INTERN'S TEXT ANSWER:
"""
${submission}
"""

INTERN'S ATTACHED FILE (${fileName}):
"""
${fileContent}
"""

NOTE: Evaluate BOTH the text answer and the file content together as a combined submission.`;
    } else if (fileContent) {
      // File only
      submissionSection = `INTERN'S SUBMISSION (file upload: ${fileName}):
"""
${fileContent}
"""

NOTE: The intern submitted a file instead of a text answer. Evaluate the file content.`;
    } else {
      // Text only
      submissionSection = `INTERN'S TEXT ANSWER:
"""
${submission}
"""`;
    }

    const userMessage = `TASK: "${taskTitle}"

TASK INSTRUCTIONS:
${taskBrief}

EVALUATION RUBRIC:
Score each of these dimensions 1-10:
1. Clarity — Is it well-structured and easy to follow?
2. Depth of Insight — Does it show critical thinking?
3. Use of Data — Does it reference evidence or examples?
4. Actionability — Are proposals concrete and implementable?

${submissionSection}

Evaluate this submission against the task instructions and rubric. Be specific and reference their actual work.`;

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
