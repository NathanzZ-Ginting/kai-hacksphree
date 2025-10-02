import { Hono } from 'hono'
import { serve } from '@hono/node-server'

// Buat app Hono
const app = new Hono()

// Route default
app.get('/', (c) => c.text('Hello from Hono + TypeScript 🚀'))

// Route API
app.get('/api/hello', (c) => c.json({ message: 'Hello Hackathon!' }))

// Start server
serve({
  fetch: app.fetch,
  port: 3000,
})

console.log('⚡ Server running at http://localhost:3000')