# german-flow

Spaced-repetition practice for German sentences and vocab. Content is generated via OpenAI and stored per user in Dexie. Details on the practice flow: `doc/practice.md`.

## Local development

```sh
cp .env.example .env   # set OPENAI_API_KEY
npm install
npm run dev
```

`npm run dev` also serves `/api/generate` locally (`netlify/devApi.ts`). No Netlify CLI needed.

## OpenAI key

The key never reaches the browser. The client posts prompts to `/api/generate`, a Netlify Function (`netlify/functions/generate.ts`) that fixes model and output size and forwards to OpenAI.

Never prefix the key with `VITE_`, or it ends up in the client bundle.

The endpoint is public. Abuse is limited by the per-IP rate limit in the function config (10 requests/min, deployed only) and the spend limit on the OpenAI key.

## Deployment (Netlify)

Set `OPENAI_API_KEY` under Site settings → Environment variables: marked as secret, scope Functions. Netlify picks up `netlify/functions/` automatically.
