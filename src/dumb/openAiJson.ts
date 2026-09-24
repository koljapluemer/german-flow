const API_URL = 'https://api.openai.com/v1/chat/completions'

// Sends a single prompt and returns the reply parsed against the given
// JSON schema (OpenAI structured outputs).
export async function openAiJson<T>(model: string, prompt: string, schemaName: string, schema: object): Promise<T> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_schema', json_schema: { name: schemaName, strict: true, schema } }
    })
  })
  if (!response.ok) throw new Error(`OpenAI request failed (${response.status})`)
  const data = await response.json()
  return JSON.parse(data.choices[0].message.content) as T
}
