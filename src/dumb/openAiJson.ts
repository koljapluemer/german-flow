const API_URL = '/api/generate'

// Sends a single prompt through the server-side proxy and returns the reply
// parsed against the given JSON schema (OpenAI structured outputs).
export async function openAiJson<T>(prompt: string, schemaName: string, schema: object): Promise<T> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, schemaName, schema })
  })
  if (response.status === 429) throw new Error('Too many requests, try again in a minute')
  if (!response.ok) throw new Error(`OpenAI request failed (${response.status})`)
  const data = await response.json()
  return JSON.parse(data.choices[0].message.content) as T
}
