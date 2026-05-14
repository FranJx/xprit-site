import express from 'express'
import next from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = process.env.PORT || 3000

app.prepare().then(() => {
  const server = express()

  // CORS Configuration
  server.use(cors({
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  }))

  server.use(express.json({ limit: '10mb' }))
  server.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // XTH API Routes - proxy to backend
  server.use('/api/xth', async (req, res) => {
    const xthBackendUrl = process.env.XTH_BACKEND_URL || 'http://localhost:5000'
    const path = req.path.replace('/api/xth', '')
    const targetUrl = `${xthBackendUrl}/api${path}`

    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      })

      const data = await response.json()
      res.status(response.status).json(data)
    } catch (error) {
      console.error('Proxy error:', error)
      res.status(500).json({ error: 'Failed to connect to XTH Backend' })
    }
  })

  // Database migration
  console.log('📦 Running database migration...')
  const { runMigration } = await import('./scripts/migrate.js')
  await runMigration()

  // All other routes handled by Next.js
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`✅ Server ready on http://localhost:${PORT}`)
    console.log(`📍 Next.js App: http://localhost:${PORT}`)
    console.log(`🤖 XTH Hub: http://localhost:${PORT}/XTH`)
  })
})
