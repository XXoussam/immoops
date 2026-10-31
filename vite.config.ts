import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createRequire } from 'module'

/*
 * Dev only: serve the Netlify functions (netlify/functions/*.js) on /.netlify/functions/<name>,
 * with the variables from .env, so `npm run dev` can use the chatbot and the voice token locally.
 * Production is unchanged: Netlify runs the functions itself.
 */
function netlifyFunctionsDev(): Plugin {
  const require = createRequire(import.meta.url)
  const dir = path.resolve(__dirname, 'netlify/functions')
  return {
    name: 'netlify-functions-dev',
    apply: 'serve',
    configureServer(server) {
      // expose every .env variable (not only VITE_*) to the functions, without overriding the shell;
      // values we injected are refreshed when Vite restarts after a .env edit
      const g = globalThis as typeof globalThis & { __netlifyDevEnvKeys?: Set<string> }
      const injected = (g.__netlifyDevEnvKeys ??= new Set<string>())
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const [k, v] of Object.entries(env)) {
        if (process.env[k] === undefined || injected.has(k)) {
          process.env[k] = v
          injected.add(k)
        }
      }

      server.middlewares.use('/.netlify/functions', (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const name = url.pathname.replace(/^\/+/, '').split('/')[0]
        const file = path.join(dir, `${name}.js`)
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', async () => {
          try {
            // reload on every call so edits to a function apply without restarting the server
            for (const id of Object.keys(require.cache)) if (id.startsWith(dir)) delete require.cache[id]
            const { handler } = require(file)
            const result = await handler({
              httpMethod: req.method,
              path: `/.netlify/functions/${name}`,
              headers: req.headers,
              queryStringParameters: Object.fromEntries(url.searchParams),
              body,
            })
            res.statusCode = result.statusCode ?? 200
            for (const [k, v] of Object.entries(result.headers ?? {})) res.setHeader(k, String(v))
            res.end(result.isBase64Encoded ? Buffer.from(result.body ?? '', 'base64') : (result.body ?? ''))
          } catch (err) {
            const missing = (err as NodeJS.ErrnoException)?.code === 'MODULE_NOT_FOUND'
            server.config.logger.error(`[netlify-functions-dev] ${name}: ${(err as Error).message}`)
            res.statusCode = missing ? 404 : 500
            res.end(JSON.stringify({ error: missing ? `function "${name}" not found` : 'function crashed (see terminal)' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), netlifyFunctionsDev()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
