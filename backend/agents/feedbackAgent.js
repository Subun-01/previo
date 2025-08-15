const axios = require('axios');

/**
 * Get quick feedback for a user's answer using LLM.
 * @param {string} question
 * @param {string} userAnswer
 * @returns {Object} - { verdict, feedback, score }
 */
async function getInstantFeedbackLLM(targetRole,question, userAnswer) {
  const prompt = `
You are an expert technical interviewer.
Role applied: ${targetRole}
Question: ${question}
User's Answer: ${userAnswer}
Evaluate the answer:
- verdict: Correct / Incorrect / Partially Correct / Unclear / acceptable
- feedback: One short sentence (max 15 words)
- score: Integer out of 10
Return as JSON: { "verdict": "...", "feedback": "...", "score": ... }
strictly follow the format without any additional text or explanation. Do not include any markdown or code blocks or  whitespace before or after the JSON object.
`.trim();
  const response = await axios.post(
    'http://localhost:11434/api/generate',
    {
      model: "mistral",
      prompt,
      stream: false
    }
  );
  return JSON.parse(response.data.response);
}

module.exports = { getInstantFeedbackLLM };