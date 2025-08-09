const axios = require('axios');

/**
 * Builds a prompt for the LLM to generate a personalized study roadmap.
 * @param {Object} param0 
 * @param {string} param0.targetRole - The user's target job role.
 * @param {string[]} param0.weakTopics - Array of weak topic names.
 * @param {number} param0.durationWeeks - Number of weeks for the roadmap.
 * @returns {string} - The prompt to send to the LLM.
 */
function buildRoadmapPrompt({ targetRole, weakTopics, durationWeeks }) {
  return `
You are a placement preparation assistant for BTech CS students.
Create a detailed, week-by-week study roadmap.
Target role: ${targetRole}
Weak topics: ${weakTopics.join(', ')}
Duration: ${durationWeeks} weeks

Each week should list topics and 1–2 free online resources (YouTube, GeeksforGeeks, etc).
Format output as JSON:
{
  "targetRole": "${targetRole}",
  "durationWeeks": ${durationWeeks},
  "weeks": [
    { "week": 1, "topics": [ { "name": "...", "resources": ["..."] } ] },
    ...
  ]
}
Only output the JSON.
  `.trim();
}

/**
 * Calls the Ollama LLM API to generate a roadmap.
 * @param {Object} opts
 * @returns {Object} - The roadmap object parsed from LLM output.
 */
async function generateRoadmapWithLLM({ targetRole, weakTopics, durationWeeks = 6 }) {
  const prompt = buildRoadmapPrompt({ targetRole, weakTopics, durationWeeks });
  const response = await axios.post(
    'http://localhost:11434/api/generate',
    {
      model: "mistral",
      prompt,
      stream: false
    }
  );
  let roadmap;
  try {
    // The response is { response: " ...output..." }
    roadmap = JSON.parse(response.data.response);
  } catch (e) {
    throw new Error("Failed to parse roadmap from LLM response. Raw output: " + response.data.response);
  }
  return roadmap;
}

module.exports = { generateRoadmapWithLLM };