# 🚦 Layer 1 Rate Limiting - Usage Guide

## Quick Start

### Basic Implementation

```typescript
// Import rate limiting middleware
import { RateLimitingMiddleware } from '../middleware/rate-limiting.middleware';

// Apply to all routes
app.use('*', RateLimitingMiddleware);

// Or apply to specific routes
app.use('/api/v1/auth/*', RateLimitingMiddleware);
```

### Configuration

```typescript
// src/middleware/rate-limiting.middleware.ts
const rateLimitConfig = {
  // General API endpoints
  general: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: 'Too many requests from this IP'
  },
  
  // Authentication endpoints (stricter)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts'
  },
  
  // Payment endpoints (very strict)
  payment: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 payment attempts per hour
    message: 'Payment rate limit exceeded'
  }
};
```

## Middleware Implementation

### Core Rate Limiting Middleware

```typescript
// src/middleware/rate-limiting.middleware.ts
import { MiddlewareHandler } from 'hono';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    firstRequest: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export const RateLimitingMiddleware: MiddlewareHandler = async (c, next) => {
  const ip = c.req.header('X-Forwarded-For') || 
             c.req.header('X-Real-IP') || 
             c.env?.ip || 
             'unknown';

  const path = c.req.path;
  const method = c.req.method;
  
  // Skip rate limiting for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(method) && !path.includes('/auth/')) {
    await next();
    return;
  }

  // Determine rate limit based on endpoint
  const config = getRateLimitConfig(path);
  const key = `${ip}:${path}`;
  const now = Date.now();

  // Initialize or get existing record
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + config.windowMs,
      firstRequest: now
    };
  }

  const record = rateLimitStore[key];

  // Reset if window has expired
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + config.windowMs;
    record.firstRequest = now;
  }

  // Increment request count
  record.count++;

  // Set rate limit headers
  c.header('X-RateLimit-Limit', config.max.toString());
  c.header('X-RateLimit-Remaining', Math.max(0, config.max - record.count).toString());
  c.header('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString());

  // Check if limit exceeded
  if (record.count > config.max) {
    console.warn(`Rate limit exceeded for IP ${ip} on ${path}. Count: ${record.count}/${config.max}`);
    
    // Detect suspicious patterns
    if (record.count > config.max * 2) {
      console.error(`Suspicious activity detected from IP ${ip}. Blocking.`);
    }

    return c.json({
      success: false,
      message: config.message,
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil((record.resetTime - now) / 1000)
    }, 429);
  }

  console.log(`Rate limit check passed for ${ip} on ${path}. Count: ${record.count}/${config.max}`);
  await next();
};

function getRateLimitConfig(path: string) {
  if (path.includes('/auth/')) return rateLimitConfig.auth;
  if (path.includes('/payment')) return rateLimitConfig.payment;
  return rateLimitConfig.general;
}
```

## Route-Specific Configuration

### Authentication Routes

```typescript
// src/routes/auth-route.ts
import { Hono } from 'hono';
import { RateLimitingMiddleware } from '../middleware/rate-limiting.middleware';

const authRoute = new Hono();

// Apply rate limiting to all auth routes
authRoute.use('*', RateLimitingMiddleware);

// Login endpoint - 5 attempts per 15 minutes
authRoute.post('/login', async (c) => {
  // Login logic here
  return c.json({ success: true });
});

// Register endpoint - 3 attempts per hour
authRoute.post('/register', async (c) => {
  // Registration logic here
  return c.json({ success: true });
});

// Password reset - 3 attempts per hour
authRoute.post('/reset-password', async (c) => {
  // Password reset logic here
  return c.json({ success: true });
});

export { authRoute };
```

### API Routes with Different Limits

```typescript
// src/routes/api-route.ts
import { createRateLimitMiddleware } from '../middleware/rate-limiting.middleware';

const apiRoute = new Hono();

// General API rate limiting - 60 requests per minute
apiRoute.use('/general/*', createRateLimitMiddleware({
  windowMs: 60 * 1000,
  max: 60,
  message: 'API rate limit exceeded'
}));

// Search endpoints - higher limit
apiRoute.use('/search/*', createRateLimitMiddleware({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Search rate limit exceeded'
}));

// Data modification - lower limit
apiRoute.use('/admin/*', createRateLimitMiddleware({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Admin action rate limit exceeded'
}));
```

## Advanced Configuration

### Dynamic Rate Limiting

```typescript
// Dynamic rate limiting based on user type
export const createDynamicRateLimit = (): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get('user');
    const userType = user?.type || 'anonymous';
    
    let config;
    switch (userType) {
      case 'premium':
        config = { windowMs: 60 * 1000, max: 100 };
        break;
      case 'standard':
        config = { windowMs: 60 * 1000, max: 50 };
        break;
      case 'anonymous':
      default:
        config = { windowMs: 60 * 1000, max: 10 };
        break;
    }

    // Apply rate limiting with dynamic config
    return applyRateLimit(c, next, config);
  };
};
```

### IP Whitelist/Blacklist

```typescript
// IP-based rate limiting exceptions
const WHITELISTED_IPS = [
  '127.0.0.1',
  '::1',
  '192.168.1.0/24', // Local network
  // Add your server IPs here
];

const BLACKLISTED_IPS = [
  // Add known malicious IPs here
];

export const enhancedRateLimitMiddleware: MiddlewareHandler = async (c, next) => {
  const ip = getClientIP(c);
  
  // Check blacklist first
  if (isBlacklisted(ip)) {
    console.error(`Blocked request from blacklisted IP: ${ip}`);
    return c.json({
      success: false,
      message: 'Access denied'
    }, 403);
  }
  
  // Skip rate limiting for whitelisted IPs
  if (isWhitelisted(ip)) {
    console.log(`Skipping rate limit for whitelisted IP: ${ip}`);
    await next();
    return;
  }
  
  // Apply normal rate limiting
  return RateLimitingMiddleware(c, next);
};
```

## Frontend Integration

### Handling Rate Limit Responses

```typescript
// utils/api-client.ts
class APIClient {
  private async handleRateLimit(response: Response): Promise<void> {
    if (response.status === 429) {
      const data = await response.json();
      const retryAfter = data.retryAfter || 60;
      
      // Show user-friendly message
      this.showRateLimitMessage(retryAfter);
      
      // Automatically retry after specified time
      if (retryAfter < 300) { // Only auto-retry if less than 5 minutes
        await this.delay(retryAfter * 1000);
        return; // Allow retry
      }
      
      throw new Error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
    }
  }

  private showRateLimitMessage(retryAfter: number): void {
    const message = `Too many requests. Please wait ${retryAfter} seconds before trying again.`;
    
    // Show toast notification
    toast.warning(message, {
      duration: retryAfter * 1000,
      action: {
        label: 'Dismiss',
        onClick: () => toast.dismiss()
      }
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Rate Limit Headers Display

```typescript
// components/RateLimitStatus.tsx
import { useState, useEffect } from 'react';

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
}

export const RateLimitStatus: React.FC = () => {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(null);

  const updateRateLimitInfo = (response: Response) => {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');

    if (limit && remaining && reset) {
      setRateLimitInfo({
        limit: parseInt(limit),
        remaining: parseInt(remaining),
        resetTime: parseInt(reset) * 1000
      });
    }
  };

  if (!rateLimitInfo || rateLimitInfo.remaining > rateLimitInfo.limit * 0.8) {
    return null; // Don't show if plenty of requests remaining
  }

  const resetDate = new Date(rateLimitInfo.resetTime);
  const timeUntilReset = Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000);

  return (
    <div className="rate-limit-warning">
      <span>
        ⚠️ {rateLimitInfo.remaining}/{rateLimitInfo.limit} requests remaining
      </span>
      <span className="reset-time">
        Resets in {timeUntilReset}s
      </span>
    </div>
  );
};
```

## Monitoring & Analytics

### Rate Limit Metrics

```typescript
// src/services/metrics.service.ts
interface RateLimitMetrics {
  totalRequests: number;
  blockedRequests: number;
  topBlockedIPs: { [ip: string]: number };
  endpointStats: { [endpoint: string]: { requests: number; blocked: number } };
}

export class MetricsService {
  private static metrics: RateLimitMetrics = {
    totalRequests: 0,
    blockedRequests: 0,
    topBlockedIPs: {},
    endpointStats: {}
  };

  static recordRequest(ip: string, endpoint: string, blocked: boolean = false): void {
    this.metrics.totalRequests++;
    
    if (blocked) {
      this.metrics.blockedRequests++;
      this.metrics.topBlockedIPs[ip] = (this.metrics.topBlockedIPs[ip] || 0) + 1;
    }
    
    if (!this.metrics.endpointStats[endpoint]) {
      this.metrics.endpointStats[endpoint] = { requests: 0, blocked: 0 };
    }
    
    this.metrics.endpointStats[endpoint].requests++;
    if (blocked) {
      this.metrics.endpointStats[endpoint].blocked++;
    }
  }

  static getMetrics(): RateLimitMetrics {
    return { ...this.metrics };
  }

  static resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      blockedRequests: 0,
      topBlockedIPs: {},
      endpointStats: {}
    };
  }
}
```

### Real-time Monitoring Dashboard

```typescript
// Monitor rate limiting in real-time
export const createMonitoringEndpoint = (): MiddlewareHandler => {
  return async (c) => {
    const metrics = MetricsService.getMetrics();
    const blockingRate = (metrics.blockedRequests / metrics.totalRequests) * 100;
    
    const dashboard = {
      summary: {
        totalRequests: metrics.totalRequests,
        blockedRequests: metrics.blockedRequests,
        blockingRate: `${blockingRate.toFixed(2)}%`,
        timestamp: new Date().toISOString()
      },
      topBlockedIPs: Object.entries(metrics.topBlockedIPs)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      endpointStats: metrics.endpointStats,
      alerts: generateAlerts(metrics)
    };

    return c.json(dashboard);
  };
};

function generateAlerts(metrics: RateLimitMetrics): string[] {
  const alerts = [];
  const blockingRate = (metrics.blockedRequests / metrics.totalRequests) * 100;
  
  if (blockingRate > 50) {
    alerts.push('HIGH: Blocking rate exceeds 50%');
  }
  
  // Check for suspicious IPs
  Object.entries(metrics.topBlockedIPs).forEach(([ip, count]) => {
    if (count > 100) {
      alerts.push(`SUSPICIOUS: IP ${ip} blocked ${count} times`);
    }
  });
  
  return alerts;
}
```

## Error Handling

### Graceful Rate Limit Responses

```typescript
// Enhanced error responses with helpful information
export const handleRateLimitError = (
  limit: number,
  retryAfter: number,
  endpoint: string
): Response => {
  const response = {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests',
      details: {
        limit,
        retryAfter,
        endpoint,
        suggestion: getSuggestionForEndpoint(endpoint)
      }
    },
    retryAfter
  };

  return new Response(JSON.stringify(response), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': retryAfter.toString(),
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Reset': Math.ceil((Date.now() + retryAfter * 1000) / 1000).toString()
    }
  });
};

function getSuggestionForEndpoint(endpoint: string): string {
  if (endpoint.includes('/auth/login')) {
    return 'Consider using "Remember Me" option to reduce login frequency';
  }
  if (endpoint.includes('/search')) {
    return 'Try using more specific search terms to reduce query frequency';
  }
  if (endpoint.includes('/api/')) {
    return 'Consider implementing caching on your end to reduce API calls';
  }
  return 'Please reduce request frequency';
}
```

## Performance Optimization

### Memory-Efficient Storage

```typescript
// Cleanup old rate limit records to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

setInterval(() => {
  const now = Date.now();
  const keysToDelete = [];
  
  Object.entries(rateLimitStore).forEach(([key, record]) => {
    // Remove records older than 1 hour
    if (now - record.firstRequest > 60 * 60 * 1000) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => delete rateLimitStore[key]);
  
  if (keysToDelete.length > 0) {
    console.log(`Cleaned up ${keysToDelete.length} old rate limit records`);
  }
}, CLEANUP_INTERVAL);
```

### Redis Integration (Optional)

```typescript
// For distributed systems, use Redis for rate limiting
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const redisRateLimitMiddleware: MiddlewareHandler = async (c, next) => {
  const ip = getClientIP(c);
  const key = `rate_limit:${ip}`;
  const window = 60; // 1 minute
  const limit = 10;

  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    if (current > limit) {
      const ttl = await redis.ttl(key);
      
      return c.json({
        success: false,
        message: 'Rate limit exceeded',
        retryAfter: ttl
      }, 429);
    }
    
    c.header('X-RateLimit-Remaining', (limit - current).toString());
    await next();
    
  } catch (error) {
    console.error('Redis rate limit error:', error);
    // Fallback to in-memory rate limiting
    return RateLimitingMiddleware(c, next);
  }
};
```

---

**Related**: [Layer 1 Overview](../LAYER_1_RATE_LIMITING.md) | [Layer 1 Testing](../testing/LAYER_1_TESTING.md)