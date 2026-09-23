import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const DEBUG_LOG = '/opt/cursor/logs/debug.log'

function agentDebugLogPlugin(): Plugin {
  return {
    name: 'agent-debug-log',
    configureServer(server) {
      server.middlewares.use('/__agent_debug_log', (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }
        const chunks: Buffer[] = []
        req.on('data', (chunk: Buffer) => chunks.push(chunk))
        req.on('end', () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf8')
            const parsed = JSON.parse(raw) as Record<string, unknown>
            fs.mkdirSync(path.dirname(DEBUG_LOG), { recursive: true })
            fs.appendFileSync(DEBUG_LOG, `${JSON.stringify(parsed)}\n`)
            res.statusCode = 204
            res.end()
          } catch (error) {
            res.statusCode = 500
            res.end(String(error))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), agentDebugLogPlugin()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
