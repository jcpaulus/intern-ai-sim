import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { submission, taskTitle, taskBrief, fileContent, fileName, evaluationCriteria } = await req.json();

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
      submissionSection = `INTERN'S TEXT ANSWER:\n"""\n${submission}\n"""\n\nINTERN'S ATTACHED FILE (${fileName}):\n"""\n${fileContent}\n"""\n\nNOTE: Evaluate BOTH the text answer and the file content together as a combined submission.`;
    } else if (fileContent) {
      submissionSection = `INTERN'S SUBMISSION (file upload: ${fileName}):\n"""\n${fileContent}\n"""\n\nNOTE: The intern submitted a file instead of a text answer. Evaluate the file content.`;
    } else {
      submissionSection = `INTERN'S TEXT ANSWER:\n"""\n${submission}\n"""`;
    }

    // Build evaluation criteria section
    let criteriaSection = "";
    if (evaluationCriteria && Array.isArray(evaluationCriteria) && evaluationCriteria.length > 0) {
      criteriaSection = "\n\nEVALUATION CRITERIA (evaluate against these specific criteria):\n" +
        evaluationCriteria.map((c: any, i: number) => `${i + 1}. ${c.name} (Weight: ${c.weight}/5) — ${c.description}`).join("\n");
    }

    const userMessage = `TASK: "${taskTitle}"

TASK INSTRUCTIONS:
${taskBrief}
${criteriaSection}

${submissionSection}

Evaluate this submission against the task instructions and evaluation criteria. Be specific and reference their actual work.`;

    // Use tool calling for reliable structured output
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are Sarah Martinez, a senior hiring manager reviewing an intern's submission. You are professional, direct, and fair. Quote the user's actual words when relevant. Every strength and improvement must be specific, not generic. Score each dimension 1-10. "Hire" if average score >= 7, "Needs Improvement" otherwise.`,
          },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_evaluation",
              description: "Submit the structured evaluation of the intern's work.",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Overall score 1-10, average of dimension scores" },
                  scores: {
                    type: "object",
                    properties: {
                      clarity: {
                        type: "object",
                        properties: { score: { type: "number" }, reason: { type: "string" } },
                        required: ["score", "reason"],
                      },
                      depth_of_insight: {
                        type: "object",
                        properties: { score: { type: "number" }, reason: { type: "string" } },
                        required: ["score", "reason"],
                      },
                      use_of_data: {
                        type: "object",
                        properties: { score: { type: "number" }, reason: { type: "string" } },
                        required: ["score", "reason"],
                      },
                      actionable: {
                        type: "object",
                        properties: { score: { type: "number" }, reason: { type: "string" } },
                        required: ["score", "reason"],
                      },
                    },
                    required: ["clarity", "depth_of_insight", "use_of_data", "actionable"],
                  },
                  strengths: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        point: { type: "string" },
                        quote: { type: "string" },
                        why: { type: "string" },
                      },
                      required: ["point", "quote", "why"],
                    },
                  },
                  improvements: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        point: { type: "string" },
                        quote: { type: "string" },
                        why: { type: "string" },
                        suggestion: { type: "string" },
                      },
                      required: ["point", "quote", "why", "suggestion"],
                    },
                  },
                  suggested_improvements: {
                    type: "array",
                    items: { type: "string" },
                  },
                  hiring_decision: { type: "string", enum: ["Hire", "Needs Improvement"] },
                  recommendation: { type: "string" },
                },
                required: ["score", "scores", "strengths", "improvements", "suggested_improvements", "hiring_decision", "recommendation"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_evaluation" } },
        stream: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
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
      throw new Error(`AI gateway returned ${response.status}: ${text}`);
    }

    const data = await response.json();

    // Extract from tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      // Fallback: try regular content
      const content = data.choices?.[0]?.message?.content;
      console.error("No tool call in response. Content:", content);
      throw new Error("AI did not return structured feedback");
    }

    let feedback;
    try {
      feedback = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;
    } catch (parseErr) {
      console.error("Failed to parse tool call arguments:", toolCall.function.arguments);
      throw new Error("Failed to parse AI feedback structure");
    }

    console.log("Evaluation generated successfully, score:", feedback.score);

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-submission error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
