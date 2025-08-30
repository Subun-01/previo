const { generateJson } = require('../utils/llmClient');

/**
 * Generate questions for a user using LLM.
 * @param {Object} params - User config ({targetRole, topic, roadmap, day, count, type})
 * @returns {Array} - List of generated questions.
 */
async function generateQuestionsLLM(params) {
  const { targetRole, topic, count, type } = params;
  let qtype = type || "mixed"; // Default to mixed if not specified
  const prompt = `
You are an expert technical interview question generator.

Task:
- Generate exactly ${count} questions on "${topic}" for a ${targetRole}.
- The requested question type is "${qtype}".

Type rules:
- Allowed types: "mcq", "short-answer", "long-answer", "code", "logic", "predict-output".
- If "${qtype}" equals "mixed" (case-insensitive), choose a random type from the allowed list for each item.
- Otherwise, set "type" to "${qtype}" for every item.

Output format (JSON only):
- Return ONLY a JSON array (no prose, no markdown, no code fences).
- Each item MUST be an object with:
  - "question": string
  - "type": one of the allowed types
  - If "type" === "mcq":
      - "choices": an array of exactly 4 distinct, plausible options (strings)
      - "answer": a string that exactly matches one of the choices
  - If "type" !== "mcq": do NOT include "choices" or "answer".
- Use valid JSON (double quotes, no trailing commas).
- Produce exactly ${count} items.

Constraints:
- Keep questions clear, technically accurate, and appropriate for a ${targetRole} at the specified roadmap day.
- Do NOT include explanations, hints, rationales, or any fields other than those specified.
`.trim();;
  const data = await generateJson({
    prompt,
    options: { temperature: 0.3, top_p: 0.9 },
  })
  return data
}

module.exports = {generateQuestionsLLM};