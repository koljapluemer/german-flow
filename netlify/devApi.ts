import { loadEnv, type Plugin } from 'vite'
import generate, { config } from './functions/generate'

// Serves the Netlify function from the Vite dev server, so `npm run dev` works without the Netlify CLI.
export function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), 'OPENAI_'))

      server.middlewares.use(config.path, async (req, res) => {
        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk)

        const response = await generate(
          new Request(`http://localhost${config.path}`, {
            method: req.method,
            body: req.method === 'POST' ? Buffer.concat(chunks) : undefined
          })
        )
        res.statusCode = response.status
        res.setHeader('Content-Type', 'application/json')
        res.end(await response.text())
      })
    }
  }
}
