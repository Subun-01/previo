// Gemini client using @google/genai with CommonJS via dynamic import
let _ai = null

async function getClient() {
  if (_ai) return _ai
  const { GoogleGenAI } = await import('@google/genai')
  const apiKey = process.env.GEMINI_API_KEY
  _ai = new GoogleGenAI(apiKey ? { apiKey } : {})
  return _ai
}

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

function toGenerationConfig(options = {}) {
  if (!options || typeof options !== 'object') return undefined
  const cfg = {}
  if (options.temperature != null) cfg.temperature = options.temperature
  if (options.top_p != null) cfg.topP = options.top_p
  if (options.topP != null) cfg.topP = options.topP
  if (options.top_k != null) cfg.topK = options.top_k
  if (options.topK != null) cfg.topK = options.topK
  if (options.max_output_tokens != null) cfg.maxOutputTokens = options.max_output_tokens
  if (options.maxOutputTokens != null) cfg.maxOutputTokens = options.maxOutputTokens
  return Object.keys(cfg).length ? cfg : undefined
}

// Return raw text from Gemini
async function generateRaw({ prompt, model = MODEL, options, stream = false } = {}) {
  // stream parameter is ignored in this simple wrapper
  const ai = await getClient()
  const res = await ai.models.generateContent({
    model,
    contents: prompt,
    ...(options ? { generationConfig: toGenerationConfig(options) } : {}),
  })
  // New SDK returns a .text convenience on response
  const text = res?.text ?? res?.response?.text
  return typeof text === 'function' ? text.call(res) : (text || '')
}

// Return parsed JSON from Gemini
async function generateJson(args) {
  const raw = await generateRaw(args)
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error(`LLM JSON parse failed: ${String(raw).slice(0, 400)}`)
  }
}

module.exports = { generateRaw, generateJson }
