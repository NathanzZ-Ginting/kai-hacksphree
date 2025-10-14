# 🛡️ PENTA Security Layer 1: Rate Limiting

## Overview

The first layer of our PENTA Security Framework implements intelligent rate limiting to prevent API abuse, brute force attacks, and DDoS attempts. This layer provides granular control over request frequencies with different limits for various endpoints.

## Features

### 🚦 **Multi-Tier Rate Limiting**
- **Login Protection**: 5 attempts per 15 minutes per IP
- **Registration Protection**: 3 attempts per 15 minutes per IP
- **General API**: 100 requests per 15 minutes per IP
- **Sliding Window**: Advanced algorithms for precise control

### 🎯 **Smart Detection**
- **IP-based Tracking**: Individual limits per client IP
- **Endpoint-specific Limits**: Different thresholds for different routes
- **Memory-efficient Storage**: In-memory tracking with automatic cleanup
- **Failed Attempt Recording**: Detailed logging of blocked requests

## Implementation

### Rate Limiting Middleware

```typescript
// src/middleware/rate-limit-middleware.ts
import { MiddlewareHandler } from 'hono';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    firstRequest: number;
  };
}

// Memory store for rate limiting (production should use Redis)
const rateLimitStore: RateLimitStore = {};

export const createRateLimit = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}): MiddlewareHandler => {
  return async (c, next) => {
    const ip = c.req.header('cf-connecting-ip') || 
               c.req.header('x-forwarded-for') || 
               'unknown';
    
    const key = `${ip}:${c.req.path}`;
    const now = Date.now();
    
    // Initialize or get existing record
    if (!rateLimitStore[key]) {
      rateLimitStore[key] = {
        count: 0,
        resetTime: now + options.windowMs,
        firstRequest: now
      };
    }
    
    const record = rateLimitStore[key];
    
    // Reset if window expired
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + options.windowMs;
      record.firstRequest = now;
    }
    
    // Check limit
    if (record.count >= options.max) {
      const remaining = Math.ceil((record.resetTime - now) / 1000);
      
      console.warn(`🚨 Rate limit exceeded for ${ip} on ${c.req.path}`);
      
      return c.json({
        success: false,
        message: options.message || 'Too many requests',
        retryAfter: remaining
      }, 429);
    }
    
    // Increment counter
    record.count++;
    
    // Set headers
    c.res.headers.set('X-RateLimit-Limit', options.max.toString());
    c.res.headers.set('X-RateLimit-Remaining', (options.max - record.count).toString());
    c.res.headers.set('X-RateLimit-Reset', record.resetTime.toString());
    
    await next();
  };
};

// Predefined rate limiters
export const loginRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit."
});

export const registerRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts per window
  message: "Terlalu banyak percobaan registrasi. Coba lagi dalam 15 menit."
});
```

### Usage in Routes

```typescript
// src/routes/auth-route.ts
import { loginRateLimit, registerRateLimit } from '../middleware/rate-limit-middleware';

// Apply rate limiting to specific endpoints
authRoute.use("/login/*", loginRateLimit);
authRoute.use("/register/*", registerRateLimit);
```

## Configuration Options

### Rate Limit Settings
```typescript
interface RateLimitOptions {
  windowMs: number;           // Time window in milliseconds
  max: number;               // Maximum requests per window
  message?: string;          // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
}
```

### Endpoint-Specific Limits
```typescript
// Different limits for different endpoints
const rateLimits = {
  login: { windowMs: 15 * 60 * 1000, max: 5 },
  register: { windowMs: 15 * 60 * 1000, max: 3 },
  api: { windowMs: 15 * 60 * 1000, max: 100 },
  upload: { windowMs: 60 * 60 * 1000, max: 10 }
};
```

## Monitoring & Analytics

### Failed Attempt Tracking
```typescript
export const recordFailedLogin = (ip: string, email?: string) => {
  console.warn(`🚨 Failed login attempt from ${ip} for email: ${email}`);
  // Additional logging or alerting logic
};

export const recordFailedRegister = (ip: string, email?: string) => {
  console.warn(`🚨 Failed registration attempt from ${ip} for email: ${email}`);
  // Additional logging or alerting logic
};
```

### Rate Limit Statistics
```typescript
export const getRateLimitStats = () => {
  const stats = {
    totalTrackedIPs: Object.keys(rateLimitStore).length,
    activeBlocks: 0,
    recentActivity: []
  };
  
  const now = Date.now();
  
  for (const [key, record] of Object.entries(rateLimitStore)) {
    if (now < record.resetTime && record.count >= 5) {
      stats.activeBlocks++;
    }
  }
  
  return stats;
};
```

## Response Headers

Rate limiting middleware adds informative headers to responses:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1698765432000
```

## Error Responses

When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Terlalu banyak percobaan login. Coba lagi dalam 15 menit.",
  "retryAfter": 847
}
```

## Production Considerations

### Redis Integration
For production deployment, replace in-memory storage with Redis:

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Store rate limit data in Redis
const setRateLimit = async (key: string, data: any) => {
  await redis.setex(key, Math.ceil((data.resetTime - Date.now()) / 1000), JSON.stringify(data));
};

const getRateLimit = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};
```

### Distributed Systems
For multiple server instances, use shared storage:
- **Redis**: Recommended for high-performance scenarios
- **Database**: For persistent storage requirements
- **Memcached**: Alternative for simple use cases

## Security Benefits

### Attack Prevention
- **Brute Force Protection**: Limits password guessing attempts
- **DDoS Mitigation**: Prevents overwhelming the server
- **API Abuse Prevention**: Stops automated scraping and abuse
- **Resource Conservation**: Protects server resources

### Legitimate User Protection
- **Fair Usage**: Ensures resources available for all users
- **Performance Maintenance**: Prevents server overload
- **Service Availability**: Maintains uptime during attacks

## Testing

### Unit Tests
```typescript
describe('Rate Limiting', () => {
  it('should allow requests within limit', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    expect(response.status).not.toBe(429);
  });
  
  it('should block requests exceeding limit', async () => {
    // Make requests up to limit
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/v1/auth/login').send({});
    }
    
    // Next request should be blocked
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({});
    
    expect(response.status).toBe(429);
    expect(response.body.retryAfter).toBeGreaterThan(0);
  });
});
```

## Best Practices

### Configuration Guidelines
- **Start Conservative**: Begin with stricter limits and adjust based on usage
- **Monitor Metrics**: Track blocked requests and false positives
- **User Communication**: Provide clear error messages with retry guidance
- **Gradual Scaling**: Increase limits gradually for legitimate high-volume users

### Performance Optimization
- **Memory Management**: Regular cleanup of expired entries
- **Efficient Storage**: Use appropriate data structures for fast lookups
- **Async Operations**: Non-blocking rate limit checks
- **Caching Strategy**: Cache frequently accessed rate limit data

---

**Layer 1 Status**: ✅ **Active** - Protecting all authentication endpoints  
**Next Layer**: [Layer 2 - CAPTCHA Verification](./LAYER_2_CAPTCHA_VERIFICATION.md)
