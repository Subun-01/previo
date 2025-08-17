const axios = require('axios');

/**
 * Generate questions for a user using LLM.
 * @param {Object} params - User config ({targetRole, topic, roadmap, day, count, type})
 * @returns {Array} - List of generated questions.
 */
async function generateQuestionsLLM(params) {
  const { targetRole, topic, roadmap, day, count, type } = params;
  let qtype = type || "mixed"; // Default to mixed if not specified
  const prompt = `
You are an Expert technical Interview Coach. Generate well structered ${count} ${qtype} questions on "${topic}" for a ${targetRole}, for day ${day} of this roadmap: ${roadmap}.
If type is "mixed", randomize question types (MCQ, short answer, logic, code, predict output, etc.).
Output as JSON array: [{ "question": "...", "type": "...", "choices": ["..."], "answer": "..." }, ...]
If MCQ, include "choices" and "answer". If not, omit.
strictly follow the format without any additional text or explanation. Do not include any markdown or code blocks or whitespace before or after the JSON object.
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

module.exports = {generateQuestionsLLM};