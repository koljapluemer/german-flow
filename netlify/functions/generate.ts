// Proxies structured-output prompts to OpenAI so the API key stays server-side.
// The model and output size are fixed here, so the endpoint is useless for anything else.
const API_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4.1-mini'
const MAX_PROMPT_LENGTH = 20_000
const MAX_COMPLETION_TOKENS = 8_000

type GenerateRequest = { prompt: string; schemaName: string; schema: object }

function isValid(body: Partial<GenerateRequest>): body is GenerateRequest {
  return (
    typeof body.prompt === 'string' &&
    body.prompt.length <= MAX_PROMPT_LENGTH &&
    typeof body.schemaName === 'string' &&
    typeof body.schema === 'object' &&
    body.schema !== null
  )
}

export default async function generate(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response(null, { status: 405 })

  const body = (await req.json().catch(() => ({}))) as Partial<GenerateRequest>
  if (!isValid(body)) return new Response(null, { status: 400 })

  const upstream = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: body.prompt }],
      response_format: { type: 'json_schema', json_schema: { name: body.schemaName, strict: true, schema: body.schema } },
      max_completion_tokens: MAX_COMPLETION_TOKENS
    })
  })
  return new Response(await upstream.text(), { status: upstream.status, headers: { 'Content-Type': 'application/json' } })
}

export const config = {
  path: '/api/generate',
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ['ip', 'domain'] }
}
