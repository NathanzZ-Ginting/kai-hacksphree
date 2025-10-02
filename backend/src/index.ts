import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import client from 'prom-client'
import authRoute from './modules/authentication/routes/auth-route.ts'
import { logger } from 'hono/logger'

// Buat app Hono
const app = new Hono()

// --- Prometheus Metrics Setup ---
const register = client.register

// Contoh metrics: HTTP request counter
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'statusCode'],
})

// Middleware untuk increment metrics
app.use('*', async (c, next) => {
  await next()
  const res = c.res
  httpRequestCounter.labels(c.req.method, c.req.path, res.status.toString()).inc()
})

// Logger middleware
app.use("*", logger())

// Endpoint /metrics
app.get('/metrics', async (c) => {
  const metrics = await register.metrics()
  return new Response(metrics, {
    status: 200,
    headers: { 'Content-Type': register.contentType },
  })
})

// --- Routes ---
app.route("/api/v1/auth", authRoute)

// Route default
app.get('/', (c) => c.text('Hello from Hono + TypeScript 🚀'))

app.get('/api/hello', (c) => c.json({ message: 'Hello Hackathon!' }))

// --- Start server ---
serve({
  fetch: app.fetch,
  port: 3000,
})

console.log('⚡ Server running at http://localhost:3000')