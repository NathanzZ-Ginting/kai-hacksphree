import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import client from 'prom-client'
import authRoute from './modules/authentication/routes/auth-route'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import orderRoute from './modules/ticketing/routes/orderRoutes'
import masterDataRoute from './modules/master-data/routes/masterDataRoute'
import paymentRoute from './modules/payment/routes/paymentRoute'

// Buat app Hono
const app = new Hono()

// Add CORS middleware
app.use('*', cors({
  origin: ['http://localhost:5173', '*'],  // Allow frontend origin and any other origins for testing
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 600,
  credentials: true,
}))

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
app.route("/api/v1/order", orderRoute)
app.route("/api/v1/master-data", masterDataRoute)
app.route("/api/v1/payment", paymentRoute)

// Route default
app.get('/', (c) => c.text('Hello from Hono + TypeScript 🚀'))

app.get('/api/hello', (c) => c.json({ message: 'Hello Hackathon!' }))

// --- Start server ---
serve({
  fetch: app.fetch,
  port: 3000,
})

console.log('⚡ Server running at http://localhost:3000')