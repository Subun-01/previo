const { generateJson } = require('../utils/llmClient');

/**
 * Get quick feedback for a user's answer using LLM.
 * @param {string} question
 * @param {string} userAnswer
 * @returns {Object} - { verdict, feedback, score }
 */
async function getInstantFeedbackLLM(targetRole,question, userAnswer) {
  const prompt = `
You are an Expert and Strict Technical Interviewer for ${targetRole} role
Question asked: ${question}
User's Answer: ${userAnswer}
Evaluate the answer:
- verdict: One word verdict (e.g."incorrect", "correct", "partially correct")
- feedback: One short sentence (max 15 words)
- score: Integer out of 10
Return as JSON: { "verdict": "...", "feedback": "...", "score": ... }
strictly follow the format without any additional text or explanation. Do not include any markdown or code blocks or  whitespace before or after the JSON object.
`.trim();
  const data = await generateJson({ prompt })
  return data
}

module.exports = { getInstantFeedbackLLM };