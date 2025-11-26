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
import fs from 'fs'
import path from 'path'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'

// Buat app Hono
const app = new Hono()

// Global variables for tracking
let apiMetrics = {
  endpoints: new Map(),
  totalRequests: 0,
  errors: 0,
  startTime: Date.now()
}

let securityMetrics = {
  failedLogins: 0,
  suspiciousIPs: new Set(),
  rateLimitViolations: 0,
  corsViolations: 0,
  activeTokens: 0
}

let systemHealth = {
  database: { status: 'healthy', lastCheck: Date.now(), connections: 0 },
  redis: { status: 'healthy', lastCheck: Date.now() },
  external: { status: 'healthy', lastCheck: Date.now() }
}

interface LogEntry {
  timestamp: string
  level: string
  message: string
  id: number
}

let logs: LogEntry[] = []
const MAX_LOGS = 1000

// Historical data storage for charts
let historicalData = {
  cpu: [] as number[],
  memory: [] as number[],
  network: [] as number[],
  disk: [] as number[],
  timestamps: [] as string[]
}
const MAX_HISTORY = 288 // 24 hours worth of 5-minute intervals

// WebSocket clients
let wsClients: Set<any> = new Set()

// Helper functions
function addLog(level: string, message: string) {
  const log = {
    timestamp: new Date().toISOString(),
    level,
    message,
    id: Date.now() + Math.random()
  }
  
  logs.unshift(log)
  if (logs.length > MAX_LOGS) {
    logs = logs.slice(0, MAX_LOGS)
  }
  
  // Broadcast to WebSocket clients if any
  broadcastLog(log)
}

function broadcastLog(log: any) {
  // Broadcast to WebSocket clients
  const message = JSON.stringify({
    type: 'log',
    data: log
  })
  
  wsClients.forEach(ws => {
    if (ws.readyState === 1) { // WebSocket.OPEN
      ws.send(message)
    }
  })
  
  console.log(`[${log.level.toUpperCase()}] ${log.message}`)
}

// Broadcast real-time notifications
function broadcastNotification(type: string, data: any) {
  const message = JSON.stringify({
    type,
    data,
    timestamp: new Date().toISOString()
  })
  
  wsClients.forEach(ws => {
    if (ws.readyState === 1) {
      ws.send(message)
    }
  })
}

// Store historical data for charts
function storeHistoricalData() {
  const timestamp = new Date().toISOString()
  const memUsage = process.memoryUsage()
  
  // Simulate CPU, network, disk data
  const cpuUsage = Math.random() * 30 + 10
  const networkUsage = Math.random() * 100 + 50
  const diskUsage = Math.random() * 40 + 30
  const memoryUsage = (memUsage.heapUsed / memUsage.heapTotal) * 100
  
  historicalData.timestamps.push(timestamp)
  historicalData.cpu.push(cpuUsage)
  historicalData.memory.push(memoryUsage)
  historicalData.network.push(networkUsage)
  historicalData.disk.push(diskUsage)
  
  // Keep only last 24 hours of data
  if (historicalData.timestamps.length > MAX_HISTORY) {
    historicalData.timestamps.shift()
    historicalData.cpu.shift()
    historicalData.memory.shift()
    historicalData.network.shift()
    historicalData.disk.shift()
  }
  
  // Broadcast real-time data to WebSocket clients
  broadcastNotification('metrics_update', {
    cpu: cpuUsage,
    memory: memoryUsage,
    network: networkUsage,
    disk: diskUsage,
    timestamp
  })
  
  // Send alerts for high resource usage
  if (memoryUsage > 80) {
    broadcastNotification('alert', {
      type: 'warning',
      message: `High memory usage detected: ${memoryUsage.toFixed(1)}%`
    })
  }
  
  if (cpuUsage > 80) {
    broadcastNotification('alert', {
      type: 'warning',
      message: `High CPU usage detected: ${cpuUsage.toFixed(1)}%`
    })
  }
}

function checkSystemHealth() {
  // Simulate health checks
  const now = Date.now()
  
  // Database health check
  systemHealth.database.status = Math.random() > 0.1 ? 'healthy' : 'error'
  systemHealth.database.lastCheck = now
  systemHealth.database.connections = Math.floor(Math.random() * 20) + 5
  
  // Redis health check
  systemHealth.redis.status = Math.random() > 0.05 ? 'healthy' : 'error'
  systemHealth.redis.lastCheck = now
  
  // External services health check
  systemHealth.external.status = Math.random() > 0.08 ? 'healthy' : 'warning'
  systemHealth.external.lastCheck = now
}

// Initialize health checks
setInterval(checkSystemHealth, 30000) // Every 30 seconds

// Initialize historical data collection
setInterval(storeHistoricalData, 300000) // Every 5 minutes
storeHistoricalData() // Initialize with first data point

// Add CORS middleware
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', '*'],  // Allow both frontend ports and any other origins for testing
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
  const startTime = Date.now()
  const method = c.req.method
  const path = c.req.path
  const ip = c.req.header('x-forwarded-for') || 'unknown'
  
  try {
    await next()
    const duration = Date.now() - startTime
    const status = c.res.status
    
    // Track API metrics
    const endpointKey = `${method} ${path}`
    if (!apiMetrics.endpoints.has(endpointKey)) {
      apiMetrics.endpoints.set(endpointKey, {
        count: 0,
        totalTime: 0,
        errors: 0,
        lastAccess: Date.now()
      })
    }
    
    const endpoint = apiMetrics.endpoints.get(endpointKey)
    endpoint.count++
    endpoint.totalTime += duration
    endpoint.lastAccess = Date.now()
    
    if (status >= 400) {
      endpoint.errors++
      apiMetrics.errors++
      
      // Log error
      addLog('error', `${method} ${path} - ${status} - ${duration}ms - ${ip}`)
      
      // Send critical error notifications via WebSocket
      if (status >= 500) {
        broadcastNotification('alert', {
          type: 'error',
          message: `Critical error: ${method} ${path} returned ${status}`,
          ip,
          duration
        })
      }
    } else {
      addLog('info', `${method} ${path} - ${status} - ${duration}ms - ${ip}`)
    }
    
    apiMetrics.totalRequests++
    httpRequestCounter.labels(method, path, status.toString()).inc()
    
    // Security monitoring
    if (status === 401 || status === 403) {
      securityMetrics.failedLogins++
      securityMetrics.suspiciousIPs.add(ip)
    }
    
    if (status === 429) {
      securityMetrics.rateLimitViolations++
    }
    
  } catch (error: any) {
    const duration = Date.now() - startTime
    addLog('error', `${method} ${path} - ERROR: ${error.message} - ${duration}ms - ${ip}`)
    apiMetrics.errors++
    throw error
  }
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

// Route untuk mendapatkan system metrics real-time
app.get('/api/system-metrics', async (c) => {
  const memUsage = process.memoryUsage()
  const uptime = process.uptime()
  const cpuUsage = process.cpuUsage()
  
  // Get disk usage (cross-platform simulation)
  const diskUsage = {
    total: 512 * 1024, // 512GB in MB
    used: Math.floor(Math.random() * 200 * 1024) + 100 * 1024, // 100-300GB used
    free: 0,
    percentage: 0
  }
  diskUsage.free = diskUsage.total - diskUsage.used
  diskUsage.percentage = Math.round((diskUsage.used / diskUsage.total) * 100)
  
  // Simulate load average (normally from os.loadavg())
  const loadAvg = {
    oneMin: (Math.random() * 2 + 0.5).toFixed(2),
    fiveMin: (Math.random() * 1.8 + 0.6).toFixed(2),
    fifteenMin: (Math.random() * 1.5 + 0.7).toFixed(2)
  }
  
  // Simulate network stats
  const networkStats = {
    bytesReceived: Math.floor(Math.random() * 1000000) + 500000,
    bytesSent: Math.floor(Math.random() * 800000) + 300000,
    packetsReceived: Math.floor(Math.random() * 10000) + 5000,
    packetsSent: Math.floor(Math.random() * 8000) + 3000,
    activeConnections: Math.floor(Math.random() * 50) + 10,
    latency: Math.floor(Math.random() * 20) + 5 // 5-25ms
  }
  
  // Simulate top processes
  const topProcesses = [
    {
      pid: 1234,
      name: 'node',
      cpu: (Math.random() * 15 + 5).toFixed(1),
      memory: Math.floor(Math.random() * 200) + 50,
      command: 'node src/index.ts'
    },
    {
      pid: 5678,
      name: 'chrome',
      cpu: (Math.random() * 10 + 2).toFixed(1),
      memory: Math.floor(Math.random() * 300) + 100,
      command: 'Google Chrome'
    },
    {
      pid: 9012,
      name: 'postgres',
      cpu: (Math.random() * 5 + 1).toFixed(1),
      memory: Math.floor(Math.random() * 150) + 80,
      command: 'postgres: main process'
    },
    {
      pid: 3456,
      name: 'redis',
      cpu: (Math.random() * 3 + 0.5).toFixed(1),
      memory: Math.floor(Math.random() * 100) + 30,
      command: 'redis-server'
    }
  ]
  
  // Simulate temperature sensors
  const temperatures = {
    cpu: Math.floor(Math.random() * 30) + 45, // 45-75°C
    gpu: Math.floor(Math.random() * 25) + 50, // 50-75°C
    motherboard: Math.floor(Math.random() * 20) + 35, // 35-55°C
    available: true
  }
  
  return c.json({
    memory: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      rss: Math.round(memUsage.rss / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
    },
    uptime: {
      seconds: Math.floor(uptime),
      hours: Math.floor(uptime / 3600),
      minutes: Math.floor((uptime % 3600) / 60)
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    },
    disk: diskUsage,
    loadAverage: loadAvg,
    network: networkStats,
    processes: topProcesses,
    temperature: temperatures,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch
  })
})

// 1. Real-time Logs API
app.get('/api/logs', async (c) => {
  const level = c.req.query('level')
  const search = c.req.query('search')
  const limit = parseInt(c.req.query('limit') || '100')
  
  let filteredLogs = logs
  
  if (level) {
    filteredLogs = filteredLogs.filter(log => log.level === level)
  }
  
  if (search) {
    filteredLogs = filteredLogs.filter(log => 
      log.message.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  return c.json({
    logs: filteredLogs.slice(0, limit),
    total: filteredLogs.length,
    levels: ['info', 'warn', 'error', 'debug']
  })
})

// 2. API Performance Analytics
app.get('/api/analytics/performance', async (c) => {
  const endpointStats = []
  
  for (const [endpoint, stats] of apiMetrics.endpoints) {
    endpointStats.push({
      endpoint,
      count: stats.count,
      avgResponseTime: stats.count > 0 ? Math.round(stats.totalTime / stats.count) : 0,
      errorRate: stats.count > 0 ? Math.round((stats.errors / stats.count) * 100) : 0,
      lastAccess: new Date(stats.lastAccess).toISOString(),
      totalErrors: stats.errors
    })
  }
  
  // Sort by most used
  endpointStats.sort((a, b) => b.count - a.count)
  
  return c.json({
    totalRequests: apiMetrics.totalRequests,
    totalErrors: apiMetrics.errors,
    uptime: Date.now() - apiMetrics.startTime,
    endpoints: endpointStats,
    topEndpoints: endpointStats.slice(0, 5),
    errorRate: apiMetrics.totalRequests > 0 ? 
      Math.round((apiMetrics.errors / apiMetrics.totalRequests) * 100) : 0
  })
})

// 3. Health Check & Alert System
app.get('/api/health', async (c) => {
  checkSystemHealth()
  
  const overallStatus = Object.values(systemHealth).every(service => 
    service.status === 'healthy'
  ) ? 'healthy' : 'degraded'
  
  return c.json({
    status: overallStatus,
    services: systemHealth,
    alerts: generateAlerts(),
    timestamp: new Date().toISOString()
  })
})

function generateAlerts() {
  const alerts = []
  const memUsage = process.memoryUsage()
  const memPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100
  
  if (memPercentage > 80) {
    alerts.push({
      type: 'warning',
      message: `High memory usage: ${Math.round(memPercentage)}%`,
      timestamp: new Date().toISOString()
    })
  }
  
  if (systemHealth.database.status !== 'healthy') {
    alerts.push({
      type: 'error',
      message: 'Database connection issues detected',
      timestamp: new Date().toISOString()
    })
  }
  
  if (apiMetrics.errors > 10) {
    alerts.push({
      type: 'warning', 
      message: `High error rate: ${apiMetrics.errors} errors`,
      timestamp: new Date().toISOString()
    })
  }
  
  return alerts
}

// 4. Database Connection Monitor
app.get('/api/database/monitor', async (c) => {
  // Simulate database metrics
  const dbMetrics = {
    activeConnections: systemHealth.database.connections,
    maxConnections: 100,
    connectionPoolUsage: Math.round((systemHealth.database.connections / 100) * 100),
    slowQueries: Math.floor(Math.random() * 5),
    queryStats: {
      totalQueries: Math.floor(Math.random() * 10000) + 5000,
      avgQueryTime: Math.floor(Math.random() * 50) + 10,
      queriesPerSecond: Math.floor(Math.random() * 100) + 50
    },
    databaseSize: {
      total: '2.5GB',
      indexes: '500MB',
      tables: '2GB'
    },
    replication: {
      status: 'healthy',
      lag: Math.floor(Math.random() * 100) + 'ms'
    }
  }
  
  return c.json({
    ...dbMetrics,
    status: systemHealth.database.status,
    lastCheck: new Date(systemHealth.database.lastCheck).toISOString()
  })
})

// 5. Security Dashboard
app.get('/api/security/dashboard', async (c) => {
  return c.json({
    failedLogins: securityMetrics.failedLogins,
    suspiciousIPs: Array.from(securityMetrics.suspiciousIPs),
    rateLimitViolations: securityMetrics.rateLimitViolations,
    corsViolations: securityMetrics.corsViolations,
    activeTokens: securityMetrics.activeTokens,
    securityEvents: logs.filter(log => 
      log.level === 'error' && 
      (log.message.includes('401') || log.message.includes('403'))
    ).slice(0, 10),
    ipBlacklist: [],
    recentThreats: [
      {
        type: 'bruteforce',
        ip: '192.168.1.100',
        attempts: 15,
        timestamp: new Date().toISOString()
      },
      {
        type: 'sql_injection',
        ip: '10.0.0.50', 
        blocked: true,
        timestamp: new Date().toISOString()
      }
    ]
  })
})

// 6. Historical Charts Data API
app.get('/api/charts/historical', async (c) => {
  return c.json({
    labels: historicalData.timestamps.map(ts => 
      new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: historicalData.cpu,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Memory Usage (%)',
        data: historicalData.memory,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      },
      {
        label: 'Network I/O (KB/s)',
        data: historicalData.network,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4
      },
      {
        label: 'Disk Usage (%)',
        data: historicalData.disk,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'System Resources - Last 24 Hours'
        }
      }
    }
  })
})

// 7. WebSocket endpoint for real-time notifications
app.get('/api/websocket', async (c) => {
  return c.json({
    message: 'WebSocket available at ws://localhost:3001/ws',
    endpoints: [
      'Real-time logs streaming',
      'Instant system alerts',
      'Live metrics updates',
      'Error notifications',
      'Performance alerts'
    ]
  })
})

// Route default dengan dashboard profesional
app.get('/', (c) => {
  const uptime = process.uptime()
  const uptimeHours = Math.floor(uptime / 3600)
  const uptimeMinutes = Math.floor((uptime % 3600) / 60)
  const memoryUsage = process.memoryUsage()
  const memoryUsageMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)
  const memoryPercentage = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
  
  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KAI Backend Services - System Dashboard</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/date-fns@2.29.3/index.min.js"></script>
      <style>
        :root {
          --primary: #1e40af;
          --primary-dark: #1e3a8a;
          --secondary: #64748b;
          --success: #059669;
          --warning: #d97706;
          --error: #dc2626;
          --surface: #ffffff;
          --surface-dark: #f8fafc;
          --text: #0f172a;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: var(--text);
          line-height: 1.6;
          min-height: 100vh;
        }
        
        .header {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 1rem 0;
          box-shadow: var(--shadow);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .brand-icon {
          width: 40px;
          height: 40px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }
        
        .brand-text h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: -2px;
        }
        
        .brand-text p {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        
        .header-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .status-badge {
          background: var(--success);
          color: white;
          padding: 0.375rem 1rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .refresh-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .refresh-btn:hover {
          background: var(--primary-dark);
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          background: #bbf7d0;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .metric-card {
          background: var(--surface);
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -8px rgb(0 0 0 / 0.15);
        }
        
        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        .metric-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .metric-icon.primary { background: #dbeafe; color: var(--primary); }
        .metric-icon.success { background: #dcfce7; color: var(--success); }
        .metric-icon.warning { background: #fef3c7; color: var(--warning); }
        .metric-icon.secondary { background: #f1f5f9; color: var(--secondary); }
        .metric-icon.info { background: #e0e7ff; color: #4338ca; }
        .metric-icon.danger { background: #fecaca; color: var(--error); }
        .metric-icon.network { background: #ecfdf5; color: #10b981; }
        
        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text);
          line-height: 1;
        }
        
        .metric-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 0.25rem;
        }
        
        .metric-trend {
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.25rem;
        }
        
        .trend-up { color: var(--success); }
        .trend-down { color: var(--error); }
        .trend-stable { color: var(--warning); }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: var(--surface-dark);
          border-radius: 4px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .progress-success { background: var(--success); }
        .progress-warning { background: var(--warning); }
        .progress-error { background: var(--error); }
        
        .section {
          background: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          margin-bottom: 2rem;
        }
        
        .section-header {
          padding: 1.5rem 1.5rem 0;
          border-bottom: 1px solid var(--border);
          margin-bottom: 1.5rem;
        }
        
        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .system-info-grid {
          padding: 0 1.5rem 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: var(--surface-dark);
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        
        .info-label {
          font-weight: 500;
          color: var(--text-muted);
        }
        
        .info-value {
          font-family: 'SF Mono', Consolas, monospace;
          font-weight: 600;
          color: var(--text);
        }
        
        .endpoints-list {
          padding: 0 1.5rem 1.5rem;
        }
        
        .endpoint-item {
          display: flex;
          align-items: center;
          padding: 0.875rem 1rem;
          margin-bottom: 0.5rem;
          background: var(--surface-dark);
          border-radius: 8px;
          border: 1px solid var(--border);
          transition: background-color 0.2s;
        }
        
        .endpoint-item:hover {
          background: #f1f5f9;
        }
        
        .endpoint-method {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          min-width: 65px;
          text-align: center;
          margin-right: 1rem;
        }
        
        .method-get { background: #dbeafe; color: #1e40af; }
        .method-post { background: #dcfce7; color: #059669; }
        .method-put { background: #fef3c7; color: #d97706; }
        .method-delete { background: #fecaca; color: #dc2626; }
        
        .endpoint-path {
          font-family: 'SF Mono', Consolas, monospace;
          font-size: 0.875rem;
          color: var(--text);
          font-weight: 500;
        }
        
        .endpoint-description {
          margin-left: auto;
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        
        .processes-list {
          padding: 0 1.5rem 1.5rem;
        }
        
        .process-item {
          display: grid;
          grid-template-columns: 80px 1fr 80px 100px auto;
          align-items: center;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          background: var(--surface-dark);
          border-radius: 8px;
          border: 1px solid var(--border);
          font-size: 0.875rem;
        }
        
        .process-pid {
          font-family: 'SF Mono', Consolas, monospace;
          color: var(--text-muted);
          font-weight: 600;
        }
        
        .process-name {
          font-weight: 600;
          color: var(--text);
        }
        
        .process-cpu, .process-memory {
          font-family: 'SF Mono', Consolas, monospace;
          font-weight: 600;
          text-align: right;
        }
        
        .process-command {
          font-family: 'SF Mono', Consolas, monospace;
          color: var(--text-muted);
          font-size: 0.8125rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        
        .temperature-grid {
          padding: 0 1.5rem 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .temp-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: var(--surface-dark);
          border-radius: 12px;
          border: 1px solid var(--border);
          gap: 1rem;
        }
        
        .temp-icon {
          font-size: 2rem;
          width: 60px;
          text-align: center;
        }
        
        .temp-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .temp-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        
        .temp-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          font-family: 'SF Mono', Consolas, monospace;
        }
        
        .temp-bar {
          width: 60px;
          height: 8px;
          background: var(--surface);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        
        .temp-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease, background-color 0.3s ease;
        }
        
        .temp-normal { background: var(--success); }
        .temp-warm { background: var(--warning); }
        .temp-hot { background: var(--error); }
        
        .logs-container {
          padding: 0 1.5rem 1.5rem;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .log-item {
          display: flex;
          align-items: flex-start;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          background: var(--surface-dark);
          border-radius: 8px;
          border-left: 4px solid var(--border);
          font-family: 'SF Mono', Consolas, monospace;
          font-size: 0.875rem;
          gap: 1rem;
        }
        
        .log-item.info { border-left-color: var(--primary); }
        .log-item.warn { border-left-color: var(--warning); }
        .log-item.error { border-left-color: var(--error); }
        .log-item.debug { border-left-color: var(--secondary); }
        
        .log-timestamp {
          color: var(--text-muted);
          min-width: 80px;
          font-size: 0.8rem;
        }
        
        .log-level {
          min-width: 60px;
          font-weight: 700;
          text-transform: uppercase;
        }
        
        .log-level.info { color: var(--primary); }
        .log-level.warn { color: var(--warning); }
        .log-level.error { color: var(--error); }
        .log-level.debug { color: var(--secondary); }
        
        .log-message {
          flex: 1;
          color: var(--text);
        }
        
        .health-grid {
          padding: 0 1.5rem 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .health-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: var(--surface-dark);
          border-radius: 12px;
          border: 1px solid var(--border);
          gap: 1rem;
        }
        
        .health-icon {
          font-size: 2rem;
          width: 60px;
          text-align: center;
        }
        
        .health-info {
          flex: 1;
        }
        
        .health-service {
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.25rem;
        }
        
        .health-status {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .health-status.healthy { color: var(--success); }
        .health-status.warning { color: var(--warning); }
        .health-status.error { color: var(--error); }
        
        .alert-item {
          display: flex;
          align-items: center;
          padding: 0.875rem 1rem;
          margin-bottom: 0.5rem;
          border-radius: 8px;
          gap: 0.75rem;
        }
        
        .alert-item.warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
        }
        
        .alert-item.error {
          background: #fecaca;
          border: 1px solid #ef4444;
          color: #991b1b;
        }
        
        .database-stats, .security-stats {
          padding: 0 1.5rem 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .stat-card {
          background: var(--surface-dark);
          border-radius: 12px;
          border: 1px solid var(--border);
          padding: 1rem;
          text-align: center;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        
        .performance-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
          align-items: center;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          background: var(--surface-dark);
          border-radius: 8px;
          border: 1px solid var(--border);
          font-size: 0.875rem;
          gap: 1rem;
        }
        
        .performance-endpoint {
          font-family: 'SF Mono', Consolas, monospace;
          color: var(--text);
          font-weight: 600;
        }
        
        .performance-metric {
          text-align: center;
          font-family: 'SF Mono', Consolas, monospace;
          font-weight: 600;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .section-header select {
          padding: 0.375rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--surface);
          color: var(--text);
          font-size: 0.875rem;
        }
        
        .notification-area {
          position: relative;
          margin-right: 1rem;
        }
        
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem 1.5rem;
          box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.25);
          z-index: 1000;
          max-width: 400px;
          animation: slideIn 0.3s ease;
        }
        
        .notification.error {
          border-left: 4px solid var(--error);
          background: #fef2f2;
        }
        
        .notification.warning {
          border-left: 4px solid var(--warning);
          background: #fffbeb;
        }
        
        .notification.success {
          border-left: 4px solid var(--success);
          background: #f0fdf4;
        }
        
        .notification.info {
          border-left: 4px solid var(--primary);
          background: #eff6ff;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .notification-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        
        .notification-message {
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        
        .notification-time {
          color: var(--text-muted);
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
        
        .charts-container {
          padding: 1.5rem;
        }
        
        .chart-wrapper {
          position: relative;
          height: 400px;
          background: var(--surface-dark);
          border-radius: 12px;
          border: 1px solid var(--border);
          padding: 1rem;
        }
        
        .chart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
          padding: 1.5rem;
        }
        
        .mini-chart {
          position: relative;
          height: 200px;
          background: var(--surface-dark);
          border-radius: 12px;
          border: 1px solid var(--border);
          padding: 1rem;
        }
        
        .websocket-status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        
        .websocket-status.connected {
          color: var(--success);
        }
        
        .websocket-status.disconnected {
          color: var(--error);
        }
        
        .ws-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success);
          animation: pulse 2s infinite;
        }
        
        .ws-indicator.disconnected {
          background: var(--error);
          animation: none;
        }
        
        .footer {
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        
        .footer-links {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          gap: 2rem;
        }
        
        .footer-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .footer-link:hover {
          color: var(--primary-dark);
        }
        
        @media (max-width: 768px) {
          .header-content {
            padding: 0 1rem;
            flex-direction: column;
            gap: 1rem;
          }
          .main {
            padding: 1rem;
          }
          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .system-info-grid {
            grid-template-columns: 1fr;
          }
          .footer-links {
            flex-direction: column;
            gap: 1rem;
          }
        }
        
        @media (min-width: 1400px) {
          .metrics-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      </style>
    </head>
    <body>
      <header class="header">
        <div class="header-content">
          <div class="brand">
            <div class="brand-icon">🚄</div>
            <div class="brand-text">
              <h1>KAI Backend Services</h1>
              <p>Enterprise API Gateway v2.1.0</p>
            </div>
          </div>
          <div class="header-controls">
            <div id="notification-area" class="notification-area"></div>
            <div class="status-badge">
              <div class="status-dot"></div>
              Sistem Aktif
            </div>
            <div class="websocket-status">
              <div class="ws-indicator"></div>
              Connecting...
            </div>
            <button class="refresh-btn" onclick="refreshMetrics()">↻ Refresh</button>
          </div>
        </div>
      </header>

      <main class="main">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon success">⏱️</div>
            </div>
            <div class="metric-value" id="uptime-value">${uptimeHours}h ${uptimeMinutes}m</div>
            <div class="metric-label">Uptime Server</div>
            <div class="metric-trend trend-up">↗ Stable</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon warning">💾</div>
            </div>
            <div class="metric-value" id="memory-value">${memoryUsageMB}MB</div>
            <div class="metric-label">Memory Usage</div>
            <div class="progress-bar">
              <div class="progress-fill ${memoryPercentage > 80 ? 'progress-error' : memoryPercentage > 60 ? 'progress-warning' : 'progress-success'}" 
                   style="width: ${memoryPercentage}%"></div>
            </div>
            <div class="metric-trend ${memoryPercentage > 80 ? 'trend-up' : 'trend-stable'}">${memoryPercentage}% digunakan</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon primary">�</div>
            </div>
            <div class="metric-value">4</div>
            <div class="metric-label">Modul API Aktif</div>
            <div class="metric-trend trend-stable">→ Semua berjalan</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon info">🌐</div>
            </div>
            <div class="metric-value" id="requests-value">0</div>
            <div class="metric-label">Total Requests</div>
            <div class="metric-trend trend-up" id="requests-trend">↗ Real-time</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon secondary">�</div>
            </div>
            <div class="metric-value">:3000</div>
            <div class="metric-label">Port Server</div>
            <div class="metric-trend trend-stable">→ Listening</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon warning">💽</div>
            </div>
            <div class="metric-value" id="disk-value">0GB</div>
            <div class="metric-label">Disk Usage</div>
            <div class="progress-bar">
              <div class="progress-fill progress-success" id="disk-bar" style="width: 0%"></div>
            </div>
            <div class="metric-trend trend-stable" id="disk-trend">→ Normal</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon network">🌐</div>
            </div>
            <div class="metric-value" id="network-value">0 KB/s</div>
            <div class="metric-label">Network I/O</div>
            <div class="metric-trend trend-up" id="network-trend">↗ Active</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon danger">🌡️</div>
            </div>
            <div class="metric-value" id="temp-value">0°C</div>
            <div class="metric-label">CPU Temperature</div>
            <div class="metric-trend trend-stable" id="temp-trend">→ Normal</div>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon primary">⚖️</div>
            </div>
            <div class="metric-value" id="load-value">0.00</div>
            <div class="metric-label">Load Average (1m)</div>
            <div class="metric-trend trend-stable" id="load-trend">→ Stable</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon info">📊</div>
            </div>
            <div class="metric-value" id="connections-value">0</div>
            <div class="metric-label">Active Connections</div>
            <div class="metric-trend trend-up" id="connections-trend">↗ Online</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon secondary">⚡</div>
            </div>
            <div class="metric-value" id="latency-value">0ms</div>
            <div class="metric-label">Network Latency</div>
            <div class="metric-trend trend-stable" id="latency-trend">→ Good</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon warning">🔧</div>
            </div>
            <div class="metric-value" id="processes-value">0</div>
            <div class="metric-label">Active Processes</div>
            <div class="metric-trend trend-stable" id="processes-trend">→ Running</div>
          </div>          <div class="metric-card">
            <div class="metric-header">
              <div class="metric-icon secondary">�</div>
            </div>
            <div class="metric-value">:3000</div>
            <div class="metric-label">Port Server</div>
            <div class="metric-trend trend-stable">→ Listening</div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span>🔧</span>
              Top Processes
            </h2>
          </div>
          <div class="processes-list" id="processes-list">
            <!-- Processes will be populated by JavaScript -->
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span>🌡️</span>
              Temperature Sensors
            </h2>
          </div>
          <div class="temperature-grid">
            <div class="temp-item">
              <div class="temp-icon">🖥️</div>
              <div class="temp-info">
                <span class="temp-label">CPU</span>
                <span class="temp-value" id="cpu-temp">--°C</span>
              </div>
              <div class="temp-bar">
                <div class="temp-fill" id="cpu-temp-bar"></div>
              </div>
            </div>
            <div class="temp-item">
              <div class="temp-icon">🎮</div>
              <div class="temp-info">
                <span class="temp-label">GPU</span>
                <span class="temp-value" id="gpu-temp">--°C</span>
              </div>
              <div class="temp-bar">
                <div class="temp-fill" id="gpu-temp-bar"></div>
              </div>
            </div>
            <div class="temp-item">
              <div class="temp-icon">⚡</div>
              <div class="temp-info">
                <span class="temp-label">Motherboard</span>
                <span class="temp-value" id="mb-temp">--°C</span>
              </div>
              <div class="temp-bar">
                <div class="temp-fill" id="mb-temp-bar"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span>⚙️</span>
              System Information
            </h2>
          </div>
          <div class="system-info-grid">
            <div class="info-item">
              <span class="info-label">Node.js Version</span>
              <span class="info-value" id="node-version">${process.version}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Platform</span>
              <span class="info-value">${process.platform}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Architecture</span>
              <span class="info-value">${process.arch}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Memory Heap Total</span>
              <span class="info-value" id="heap-total">${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB</span>
            </div>
            <div class="info-item">
              <span class="info-label">Memory RSS</span>
              <span class="info-value" id="memory-rss">${Math.round(memoryUsage.rss / 1024 / 1024)}MB</span>
            </div>
            <div class="info-item">
              <span class="info-label">Memory External</span>
              <span class="info-value" id="memory-external">${Math.round(memoryUsage.external / 1024 / 1024)}MB</span>
            </div>
            <div class="info-item">
              <span class="info-label">Load Average (5m)</span>
              <span class="info-value" id="load-5m">0.00</span>
            </div>
            <div class="info-item">
              <span class="info-label">Load Average (15m)</span>
              <span class="info-value" id="load-15m">0.00</span>
            </div>
            <div class="info-item">
              <span class="info-label">Total Disk Space</span>
              <span class="info-value" id="disk-total">0GB</span>
            </div>
            <div class="info-item">
              <span class="info-label">Network Packets RX</span>
              <span class="info-value" id="packets-rx">0</span>
            </div>
            <div class="info-item">
              <span class="info-label">Network Packets TX</span>
              <span class="info-value" id="packets-tx">0</span>
            </div>
            <div class="info-item">
              <span class="info-label">Bytes Received</span>
              <span class="info-value" id="bytes-rx">0 MB</span>
            </div>
          </div>
        </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span>�</span>
              Endpoint API Tersedia
            </h2>
          </div>
          <div class="endpoints-list">
            <div class="endpoint-item">
              <span class="endpoint-method method-get">GET</span>
              <span class="endpoint-path">/api/hello</span>
              <span class="endpoint-description">Health Check</span>
            </div>
            <div class="endpoint-item">
              <span class="endpoint-method method-get">GET</span>
              <span class="endpoint-path">/api/system-metrics</span>
              <span class="endpoint-description">Real-time System Metrics</span>
            </div>
            <div class="endpoint-item">
              <span class="endpoint-method method-get">GET</span>
              <span class="endpoint-path">/api/logs</span>
              <span class="endpoint-description">Real-time Logs Viewer</span>
            </div>
            <div class="endpoint-item">
              <span class="endpoint-method method-get">GET</span>
              <span class="endpoint-path">/api/analytics/performance</span>
              <span class="endpoint-description">API Performance Analytics</span>
            </div>
            <div class="endpoint-item">
              <span class="endpoint-method method-get">GET</span>
              <span class="endpoint-path">/api/health</span>
              <span class="endpoint-description">Health Check & Alerts</span>
            </div>
            <div class="endpoint-item">
              <span class="endpoint-method method-get">GET</span>
              <span class="endpoint-path">/api/database/monitor</span>
              <span class="endpoint-description">Database Connection Monitor</span>
            </div>
            <div class="endpoint-item">
              <span class="endpoint-method method-get">GET</span>
              <span class="endpoint-path">/api/security/dashboard</span>
              <span class="endpoint-description">Security Dashboard</span>
            </div>
            <div class="endpoint-item">
              <span class="endpoint-method method-post">POST</span>
              <span class="endpoint-path">/api/v1/auth/*</span>
              <span class="endpoint-description">Authentication Service</span>
            </div>
            <div class="endpoint-item">
              <span class="endpoint-method method-get">GET</span>
              <span class="endpoint-path">/api/v1/order/*</span>
              <span class="endpoint-description">Ticketing Management</span>
            </div>
            <div class="endpoint-item">
              <span class="endpoint-method method-get">GET</span>
              <span class="endpoint-path">/api/v1/master-data/*</span>
              <span class="endpoint-description">Master Data Service</span>
            </div>
            <div class="endpoint-item">
              <span class="endpoint-method method-post">POST</span>
              <span class="endpoint-path">/api/v1/payment/*</span>
              <span class="endpoint-description">Payment Gateway</span>
            </div>
            <div class="endpoint-item">
              <span class="endpoint-method method-get">GET</span>
              <span class="endpoint-path">/metrics</span>
              <span class="endpoint-description">Prometheus Monitoring</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span>📊</span>
              Real-time System Charts
            </h2>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <select id="chart-timeframe" onchange="updateChartTimeframe()">
                <option value="1h">Last Hour</option>
                <option value="6h">Last 6 Hours</option>
                <option value="24h" selected>Last 24 Hours</option>
              </select>
              <button class="refresh-btn" onclick="refreshCharts()">Refresh Charts</button>
            </div>
          </div>
          <div class="charts-container">
            <div class="chart-wrapper">
              <canvas id="systemChart" width="800" height="400"></canvas>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span>📊</span>
              API Performance Analytics
            </h2>
          </div>
          <div class="endpoints-list" id="performance-stats">
            <!-- Performance stats will be populated by JavaScript -->
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span>📜</span>
              Recent Logs <small>(Last 10)</small>
            </h2>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <select id="log-level" onchange="filterLogs()">
                <option value="">All Levels</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
                <option value="debug">Debug</option>
              </select>
              <button class="refresh-btn" onclick="filterLogs()">Refresh Logs</button>
            </div>
          </div>
          <div class="logs-container" id="logs-container">
            <!-- Logs will be populated by JavaScript -->
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span>🚨</span>
              Health & Alerts
            </h2>
          </div>
          <div class="health-grid" id="health-grid">
            <!-- Health status will be populated by JavaScript -->
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span>🗄️</span>
              Database Monitor
            </h2>
          </div>
          <div class="database-stats" id="database-stats">
            <!-- Database stats will be populated by JavaScript -->
          </div>
        </div>

        <div class="section">
          <div class="section-header">
            <h2 class="section-title">
              <span>🔐</span>
              Security Dashboard
            </h2>
          </div>
          <div class="security-stats" id="security-stats">
            <!-- Security stats will be populated by JavaScript -->
          </div>
        </div>
      </main>

      <footer class="footer">
        <p>PT Kereta Api Indonesia (Persero) - Backend Service Dashboard</p>
        <p>Dikembangkan dengan Hono Framework & TypeScript</p>
        <div class="footer-links">
          <a href="/api/hello" class="footer-link">Test Endpoint</a>
          <a href="/api/system-metrics" class="footer-link">System API</a>
          <a href="/api/charts/historical" class="footer-link">Charts Data</a>
          <a href="/api/websocket" class="footer-link">WebSocket Info</a>
          <a href="/metrics" class="footer-link">Prometheus</a>
          <a href="https://hono.dev" class="footer-link" target="_blank">Framework Documentation</a>
        </div>
      </footer>

      <script>
        // Global variables
        let requestCount = 0;
        let systemChart = null;
        let websocket = null;
        let isWSConnected = false;
        
        // Fetch system metrics
        async function fetchMetrics() {
          try {
            const response = await fetch('/api/system-metrics');
            const data = await response.json();
            
            // Update existing metric cards
            document.getElementById('memory-value').textContent = data.memory.used + 'MB';
            document.getElementById('uptime-value').textContent = data.uptime.hours + 'h ' + data.uptime.minutes + 'm';
            document.getElementById('heap-total').textContent = data.memory.total + 'MB';
            document.getElementById('memory-rss').textContent = data.memory.rss + 'MB';
            document.getElementById('memory-external').textContent = data.memory.external + 'MB';
            
            // Update new system health metrics
            const diskUsedGB = Math.round(data.disk.used / 1024);
            document.getElementById('disk-value').textContent = diskUsedGB + 'GB';
            document.getElementById('disk-bar').style.width = data.disk.percentage + '%';
            document.getElementById('disk-bar').className = 'progress-fill ' + 
              (data.disk.percentage > 80 ? 'progress-error' : 
               data.disk.percentage > 60 ? 'progress-warning' : 'progress-success');
            document.getElementById('disk-trend').textContent = data.disk.percentage + '% used';
            
            // Network metrics
            const networkRate = Math.round((data.network.bytesReceived + data.network.bytesSent) / 1024);
            document.getElementById('network-value').textContent = networkRate + ' KB/s';
            document.getElementById('connections-value').textContent = data.network.activeConnections;
            document.getElementById('latency-value').textContent = data.network.latency + 'ms';
            
            // Load average
            document.getElementById('load-value').textContent = data.loadAverage.oneMin;
            document.getElementById('load-5m').textContent = data.loadAverage.fiveMin;
            document.getElementById('load-15m').textContent = data.loadAverage.fifteenMin;
            
            // Temperature sensors
            if (data.temperature.available) {
              document.getElementById('temp-value').textContent = data.temperature.cpu + '°C';
              document.getElementById('cpu-temp').textContent = data.temperature.cpu + '°C';
              document.getElementById('gpu-temp').textContent = data.temperature.gpu + '°C';
              document.getElementById('mb-temp').textContent = data.temperature.motherboard + '°C';
              
              // Update temperature bars
              updateTempBar('cpu-temp-bar', data.temperature.cpu);
              updateTempBar('gpu-temp-bar', data.temperature.gpu);
              updateTempBar('mb-temp-bar', data.temperature.motherboard);
              
              // Update temp trend
              const tempTrend = data.temperature.cpu > 70 ? 'trend-up' : 'trend-stable';
              document.getElementById('temp-trend').className = 'metric-trend ' + tempTrend;
              document.getElementById('temp-trend').textContent = 
                data.temperature.cpu > 70 ? '↗ Hot' : '→ Normal';
            }
            
            // Network info
            document.getElementById('packets-rx').textContent = data.network.packetsReceived.toLocaleString();
            document.getElementById('packets-tx').textContent = data.network.packetsSent.toLocaleString();
            document.getElementById('bytes-rx').textContent = Math.round(data.network.bytesReceived / 1024 / 1024) + ' MB';
            document.getElementById('disk-total').textContent = Math.round(data.disk.total / 1024) + 'GB';
            
            // Update processes list
            updateProcessesList(data.processes);
            
            // Process count
            document.getElementById('processes-value').textContent = data.processes.length;
            
            // Simulate CPU usage (in real app, you'd get this from metrics)
            const cpuUsage = Math.random() * 30 + 10; // 10-40%
            document.getElementById('cpu-value').textContent = Math.round(cpuUsage) + '%';
            document.getElementById('cpu-bar').style.width = cpuUsage + '%';
            
            // Simulate request count
            requestCount += Math.floor(Math.random() * 5) + 1;
            document.getElementById('requests-value').textContent = requestCount;
            
            // Update progress bars
            const memoryPercentage = data.memory.percentage;
            const memoryBar = document.querySelector('.progress-fill');
            if (memoryBar) {
              memoryBar.style.width = memoryPercentage + '%';
              memoryBar.className = 'progress-fill ' + 
                (memoryPercentage > 80 ? 'progress-error' : 
                 memoryPercentage > 60 ? 'progress-warning' : 'progress-success');
            }
            
          } catch (error) {
            console.error('Error fetching metrics:', error);
          }
        }

        // Fetch performance analytics
        async function fetchPerformanceAnalytics() {
          try {
            const response = await fetch('/api/analytics/performance');
            const data = await response.json();
            updatePerformanceStats(data);
          } catch (error) {
            console.error('Error fetching performance analytics:', error);
          }
        }

        // Fetch logs
        async function fetchLogs(level = '', search = '') {
          try {
            const params = new URLSearchParams();
            if (level) params.append('level', level);
            if (search) params.append('search', search);
            params.append('limit', '10');
            
            const response = await fetch('/api/logs?' + params);
            const data = await response.json();
            updateLogsDisplay(data.logs);
          } catch (error) {
            console.error('Error fetching logs:', error);
          }
        }

        // Fetch health status
        async function fetchHealthStatus() {
          try {
            const response = await fetch('/api/health');
            const data = await response.json();
            updateHealthDisplay(data);
          } catch (error) {
            console.error('Error fetching health status:', error);
          }
        }

        // Fetch database monitor
        async function fetchDatabaseMonitor() {
          try {
            const response = await fetch('/api/database/monitor');
            const data = await response.json();
            updateDatabaseDisplay(data);
          } catch (error) {
            console.error('Error fetching database monitor:', error);
          }
        }

        // Fetch security dashboard
        async function fetchSecurityDashboard() {
          try {
            const response = await fetch('/api/security/dashboard');
            const data = await response.json();
            updateSecurityDisplay(data);
          } catch (error) {
            console.error('Error fetching security dashboard:', error);
          }
        }

        // Update functions
        function updatePerformanceStats(data) {
          const container = document.getElementById('performance-stats');
          container.innerHTML = '';
          
          // Add header
          const header = document.createElement('div');
          header.className = 'performance-item';
          header.style.fontWeight = '600';
          header.style.background = 'var(--primary)';
          header.style.color = 'white';
          header.innerHTML = 
            '<span>Endpoint</span>' +
            '<span>Requests</span>' +
            '<span>Avg Time</span>' +
            '<span>Error Rate</span>' +
            '<span>Last Access</span>';
          container.appendChild(header);
          
          data.topEndpoints.forEach(endpoint => {
            const item = document.createElement('div');
            item.className = 'performance-item';
            item.innerHTML = 
              '<span class="performance-endpoint">' + endpoint.endpoint + '</span>' +
              '<span class="performance-metric">' + endpoint.count + '</span>' +
              '<span class="performance-metric">' + endpoint.avgResponseTime + 'ms</span>' +
              '<span class="performance-metric">' + endpoint.errorRate + '%</span>' +
              '<span class="performance-metric">' + new Date(endpoint.lastAccess).toLocaleTimeString() + '</span>';
            container.appendChild(item);
          });
        }

        function updateLogsDisplay(logs) {
          const container = document.getElementById('logs-container');
          container.innerHTML = '';
          
          logs.forEach(log => {
            const item = document.createElement('div');
            item.className = 'log-item ' + log.level;
            item.innerHTML = 
              '<span class="log-timestamp">' + new Date(log.timestamp).toLocaleTimeString() + '</span>' +
              '<span class="log-level ' + log.level + '">' + log.level + '</span>' +
              '<span class="log-message">' + log.message + '</span>';
            container.appendChild(item);
          });
        }

        function updateHealthDisplay(data) {
          const container = document.getElementById('health-grid');
          container.innerHTML = '';
          
          // Service statuses
          Object.entries(data.services).forEach(([service, info]) => {
            const item = document.createElement('div');
            item.className = 'health-item';
            item.innerHTML = 
              '<div class="health-icon">' + getServiceIcon(service) + '</div>' +
              '<div class="health-info">' +
                '<div class="health-service">' + service.toUpperCase() + '</div>' +
                '<div class="health-status ' + info.status + '">' + info.status + '</div>' +
              '</div>';
            container.appendChild(item);
          });
          
          // Alerts
          if (data.alerts && data.alerts.length > 0) {
            const alertsSection = document.createElement('div');
            alertsSection.innerHTML = '<h4>Active Alerts</h4>';
            data.alerts.forEach(alert => {
              const alertItem = document.createElement('div');
              alertItem.className = 'alert-item ' + alert.type;
              alertItem.innerHTML = 
                '<span>⚠️</span>' +
                '<span>' + alert.message + '</span>';
              alertsSection.appendChild(alertItem);
            });
            container.appendChild(alertsSection);
          }
        }

        function updateDatabaseDisplay(data) {
          const container = document.getElementById('database-stats');
          container.innerHTML = '';
          
          const stats = [
            { label: 'Active Connections', value: data.activeConnections },
            { label: 'Pool Usage', value: data.connectionPoolUsage + '%' },
            { label: 'Slow Queries', value: data.slowQueries },
            { label: 'QPS', value: data.queryStats.queriesPerSecond },
            { label: 'Avg Query Time', value: data.queryStats.avgQueryTime + 'ms' },
            { label: 'Database Size', value: data.databaseSize.total }
          ];
          
          stats.forEach(stat => {
            const item = document.createElement('div');
            item.className = 'stat-card';
            item.innerHTML = 
              '<div class="stat-value">' + stat.value + '</div>' +
              '<div class="stat-label">' + stat.label + '</div>';
            container.appendChild(item);
          });
        }

        function updateSecurityDisplay(data) {
          const container = document.getElementById('security-stats');
          container.innerHTML = '';
          
          const stats = [
            { label: 'Failed Logins', value: data.failedLogins },
            { label: 'Suspicious IPs', value: data.suspiciousIPs.length },
            { label: 'Rate Limit Violations', value: data.rateLimitViolations },
            { label: 'Active Tokens', value: data.activeTokens },
            { label: 'Security Events', value: data.securityEvents.length },
            { label: 'Recent Threats', value: data.recentThreats.length }
          ];
          
          stats.forEach(stat => {
            const item = document.createElement('div');
            item.className = 'stat-card';
            item.innerHTML = 
              '<div class="stat-value">' + stat.value + '</div>' +
              '<div class="stat-label">' + stat.label + '</div>';
            container.appendChild(item);
          });
        }

        function getServiceIcon(service) {
          const icons = {
            database: '🗄️',
            redis: '⚡',
            external: '🌐'
          };
          return icons[service] || '🔧';
        }

        function filterLogs() {
          const level = document.getElementById('log-level').value;
          fetchLogs(level);
        }

        // WebSocket Functions
        function initWebSocket() {
          const wsUrl = 'ws://localhost:3001/ws'; // Updated to port 3001
          websocket = new WebSocket(wsUrl);
          
          websocket.onopen = function(event) {
            console.log('WebSocket connected');
            isWSConnected = true;
            updateWSStatus(true);
            showNotification('success', 'Real-time Connection', 'WebSocket connected successfully');
          };
          
          websocket.onmessage = function(event) {
            const message = JSON.parse(event.data);
            handleWebSocketMessage(message);
          };
          
          websocket.onclose = function(event) {
            console.log('WebSocket disconnected');
            isWSConnected = false;
            updateWSStatus(false);
            showNotification('warning', 'Connection Lost', 'Attempting to reconnect...');
            
            // Attempt to reconnect after 3 seconds
            setTimeout(initWebSocket, 3000);
          };
          
          websocket.onerror = function(error) {
            console.error('WebSocket error:', error);
            showNotification('error', 'Connection Error', 'Failed to connect to real-time service');
          };
        }

        function handleWebSocketMessage(message) {
          switch(message.type) {
            case 'log':
              updateLogsDisplay([message.data]);
              if (message.data.level === 'error') {
                showNotification('error', 'System Error', message.data.message);
                playAlertSound();
              }
              break;
              
            case 'metrics_update':
              updateRealTimeCharts(message.data);
              break;
              
            case 'alert':
              showNotification(message.data.type, 'System Alert', message.data.message);
              if (message.data.type === 'error') {
                playAlertSound();
              }
              break;
              
            case 'notification':
              showNotification('info', 'System Notification', message.data.message);
              break;
          }
        }

        function updateWSStatus(connected) {
          const indicators = document.querySelectorAll('.ws-indicator');
          const statuses = document.querySelectorAll('.websocket-status');
          
          indicators.forEach(indicator => {
            indicator.className = connected ? 'ws-indicator' : 'ws-indicator disconnected';
          });
          
          statuses.forEach(status => {
            status.className = connected ? 'websocket-status connected' : 'websocket-status disconnected';
            status.textContent = connected ? '🟢 Real-time Connected' : '🔴 Disconnected';
          });
        }

        // Notification Functions
        function showNotification(type, title, message) {
          const notification = document.createElement('div');
          notification.className = 'notification ' + type;
          notification.innerHTML = 
            '<div class="notification-title">' + title + '</div>' +
            '<div class="notification-message">' + message + '</div>' +
            '<div class="notification-time">' + new Date().toLocaleTimeString() + '</div>';
          
          document.body.appendChild(notification);
          
          // Auto remove after 5 seconds
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 5000);
          
          // Add click to dismiss
          notification.onclick = function() {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          };
        }

        function playAlertSound() {
          // Create audio context for sound alerts
          try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
          } catch (error) {
            console.log('Audio not supported');
          }
        }

        // Charts Functions
        async function initCharts() {
          try {
            const response = await fetch('/api/charts/historical');
            const data = await response.json();
            
            const ctx = document.getElementById('systemChart').getContext('2d');
            systemChart = new Chart(ctx, {
              type: 'line',
              data: data,
              options: {
                ...data.options,
                animation: {
                  duration: 750
                },
                interaction: {
                  intersect: false,
                  mode: 'index'
                }
              }
            });
          } catch (error) {
            console.error('Error initializing charts:', error);
          }
        }

        function updateRealTimeCharts(metricsData) {
          if (!systemChart) return;
          
          const currentTime = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          // Add new data point
          systemChart.data.labels.push(currentTime);
          systemChart.data.datasets[0].data.push(metricsData.cpu);
          systemChart.data.datasets[1].data.push(metricsData.memory);
          systemChart.data.datasets[2].data.push(metricsData.network);
          systemChart.data.datasets[3].data.push(metricsData.disk);
          
          // Keep only last 50 points for performance
          if (systemChart.data.labels.length > 50) {
            systemChart.data.labels.shift();
            systemChart.data.datasets.forEach(dataset => {
              dataset.data.shift();
            });
          }
          
          systemChart.update('none'); // No animation for real-time updates
        }

        async function refreshCharts() {
          try {
            const response = await fetch('/api/charts/historical');
            const data = await response.json();
            
            if (systemChart) {
              systemChart.data = data;
              systemChart.update();
            }
            
            showNotification('success', 'Charts Updated', 'Chart data refreshed successfully');
          } catch (error) {
            console.error('Error refreshing charts:', error);
            showNotification('error', 'Update Failed', 'Failed to refresh chart data');
          }
        }

        function updateChartTimeframe() {
          const timeframe = document.getElementById('chart-timeframe').value;
          // In a real implementation, this would fetch different timeframe data
          refreshCharts();
          showNotification('info', 'Timeframe Changed', 'Chart timeframe updated to ' + timeframe);
        }

        // Update temperature bar
        function updateTempBar(elementId, temp) {
          const bar = document.getElementById(elementId);
          const percentage = Math.min(Math.max((temp - 30) / 50 * 100, 0), 100); // 30-80°C range
          bar.style.width = percentage + '%';
          
          if (temp < 60) {
            bar.className = 'temp-fill temp-normal';
          } else if (temp < 75) {
            bar.className = 'temp-fill temp-warm';
          } else {
            bar.className = 'temp-fill temp-hot';
          }
        }

        // Update processes list
        function updateProcessesList(processes) {
          const processList = document.getElementById('processes-list');
          processList.innerHTML = '';
          
          processes.forEach(process => {
            const processDiv = document.createElement('div');
            processDiv.className = 'process-item';
            processDiv.innerHTML = 
              '<span class="process-pid">' + process.pid + '</span>' +
              '<span class="process-name">' + process.name + '</span>' +
              '<span class="process-cpu">' + process.cpu + '%</span>' +
              '<span class="process-memory">' + process.memory + 'MB</span>' +
              '<span class="process-command">' + process.command + '</span>';
            processList.appendChild(processDiv);
          });
        }

        // Refresh button function
        function refreshMetrics() {
          fetchMetrics();
          // Add visual feedback
          const btn = document.querySelector('.refresh-btn');
          btn.style.transform = 'rotate(360deg)';
          btn.style.transition = 'transform 0.5s ease';
          setTimeout(() => {
            btn.style.transform = 'rotate(0deg)';
          }, 500);
        }

        // Initialize everything when page loads
        document.addEventListener('DOMContentLoaded', function() {
          // Initialize WebSocket connection
          initWebSocket();
          
          // Initialize charts
          initCharts();
          
          // Fetch initial data
          fetchMetrics();
          fetchPerformanceAnalytics();
          fetchLogs();
          fetchHealthStatus();
          fetchDatabaseMonitor();
          fetchSecurityDashboard();
          
          // Show welcome notification
          setTimeout(() => {
            showNotification('success', 'Dashboard Loaded', 'Real-time monitoring active with charts & notifications');
          }, 1000);
          
          // Set up auto-refresh every 5 seconds
          setInterval(() => {
            fetchMetrics();
            fetchPerformanceAnalytics();
            fetchLogs();
            fetchHealthStatus();
            fetchDatabaseMonitor();
            fetchSecurityDashboard();
          }, 5000);
        });
      </script>
    </body>
    </html>
  `
  
  return c.html(html)
})

app.get('/api/hello', (c) => c.json({ message: 'Hello Hackathon!' }))

// --- Start server with WebSocket support ---
const port = 3000

// Create HTTP server using Hono's serve function
const server = serve({
  fetch: app.fetch,
  port: port,
}, (info) => {
  console.log('⚡ Server running at http://localhost:' + info.port)
})

// Create WebSocket server on the same port
const wss = new WebSocketServer({ 
  port: port + 1, // Use port 3001 for WebSocket to avoid conflicts
  path: '/ws' 
})

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected')
  wsClients.add(ws)
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'notification',
    data: { message: 'Connected to real-time monitoring' },
    timestamp: new Date().toISOString()
  }))
  
  ws.on('close', () => {
    console.log('WebSocket client disconnected')
    wsClients.delete(ws)
  })
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
    wsClients.delete(ws)
  })
})

console.log('🔌 WebSocket available at ws://localhost:' + (port + 1) + '/ws')
console.log('📊 Charts & Real-time notifications enabled!')