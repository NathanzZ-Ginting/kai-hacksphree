# 🧪 Layer 1 Rate Limiting - Testing Guide

## Unit Testing

### Rate Limiting Middleware Tests

```typescript
// tests/middleware/rate-limiting.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Hono } from 'hono';
import { RateLimitingMiddleware } from '../../src/middleware/rate-limiting.middleware';

describe('Rate Limiting Middleware', () => {
  let app: Hono;
  
  beforeEach(() => {
    app = new Hono();
    app.use('*', RateLimitingMiddleware);
    app.get('/test', (c) => c.json({ message: 'success' }));
  });

  it('should allow requests within rate limit', async () => {
    for (let i = 0; i < 10; i++) {
      const res = await app.request('/test', {
        headers: { 'X-Forwarded-For': '192.168.1.1' }
      });
      expect(res.status).toBe(200);
    }
  });

  it('should block requests exceeding rate limit', async () => {
    // Exhaust rate limit (10 requests per minute)
    for (let i = 0; i < 10; i++) {
      await app.request('/test', {
        headers: { 'X-Forwarded-For': '192.168.1.2' }
      });
    }

    // 11th request should be blocked
    const blockedRes = await app.request('/test', {
      headers: { 'X-Forwarded-For': '192.168.1.2' }
    });
    
    expect(blockedRes.status).toBe(429);
    
    const body = await blockedRes.json();
    expect(body.message).toContain('Too many requests');
  });

  it('should track different IPs separately', async () => {
    // IP 1 makes 10 requests
    for (let i = 0; i < 10; i++) {
      await app.request('/test', {
        headers: { 'X-Forwarded-For': '192.168.1.3' }
      });
    }

    // IP 2 should still be allowed
    const res = await app.request('/test', {
      headers: { 'X-Forwarded-For': '192.168.1.4' }
    });
    
    expect(res.status).toBe(200);
  });

  it('should include rate limit headers', async () => {
    const res = await app.request('/test', {
      headers: { 'X-Forwarded-For': '192.168.1.5' }
    });

    expect(res.headers.get('X-RateLimit-Limit')).toBe('10');
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('9');
    expect(res.headers.get('X-RateLimit-Reset')).toBeTruthy();
  });
});
```

### Different Endpoint Rate Limits

```typescript
describe('Endpoint-Specific Rate Limiting', () => {
  it('should apply stricter limits to sensitive endpoints', async () => {
    const authApp = new Hono();
    authApp.use('/auth/*', RateLimitingMiddleware);
    authApp.post('/auth/login', (c) => c.json({ success: true }));

    // Login endpoint: 5 attempts per 15 minutes
    for (let i = 0; i < 5; i++) {
      const res = await authApp.request('/auth/login', {
        method: 'POST',
        headers: { 'X-Forwarded-For': '192.168.1.6' }
      });
      expect(res.status).toBe(200);
    }

    // 6th attempt should be blocked
    const blockedRes = await authApp.request('/auth/login', {
      method: 'POST',
      headers: { 'X-Forwarded-For': '192.168.1.6' }
    });
    
    expect(blockedRes.status).toBe(429);
  });
});
```

## Integration Testing

### Load Testing with Rate Limits

```typescript
// tests/integration/rate-limiting-load.test.ts
import { describe, it, expect } from 'vitest';

describe('Rate Limiting Load Tests', () => {
  it('should handle concurrent requests correctly', async () => {
    const promises = [];
    const ip = '192.168.1.10';

    // Send 15 concurrent requests
    for (let i = 0; i < 15; i++) {
      promises.push(
        fetch('http://localhost:3000/api/v1/test', {
          headers: { 'X-Forwarded-For': ip }
        })
      );
    }

    const responses = await Promise.all(promises);
    
    const successResponses = responses.filter(r => r.status === 200);
    const rateLimitedResponses = responses.filter(r => r.status === 429);

    expect(successResponses.length).toBe(10);
    expect(rateLimitedResponses.length).toBe(5);
  });

  it('should reset rate limits after time window', async () => {
    // This test requires time manipulation or waiting
    // Using mock timers for faster testing
    
    vi.useFakeTimers();
    
    // Exhaust rate limit
    for (let i = 0; i < 10; i++) {
      await app.request('/test', {
        headers: { 'X-Forwarded-For': '192.168.1.11' }
      });
    }

    // Advance time by 1 minute
    vi.advanceTimersByTime(60000);

    // Should allow requests again
    const res = await app.request('/test', {
      headers: { 'X-Forwarded-For': '192.168.1.11' }
    });
    
    expect(res.status).toBe(200);
    
    vi.useRealTimers();
  });
});
```

## Manual Testing

### Rate Limiting Test Script

```bash
#!/bin/bash
# test-rate-limiting.sh

echo "Testing Rate Limiting..."

BASE_URL="http://localhost:3000/api/v1"
IP="192.168.1.100"

echo "1. Testing normal requests (within limit)..."
for i in {1..5}; do
  echo "Request $i:"
  curl -w "Status: %{http_code}\n" \
       -H "X-Forwarded-For: $IP" \
       -s "$BASE_URL/test" | tail -1
  sleep 1
done

echo -e "\n2. Testing rate limit exceeded..."
for i in {6..12}; do
  echo "Request $i:"
  curl -w "Status: %{http_code}\n" \
       -H "X-Forwarded-For: $IP" \
       -s "$BASE_URL/test" | tail -1
done

echo -e "\n3. Testing different IP (should work)..."
curl -w "Status: %{http_code}\n" \
     -H "X-Forwarded-For: 192.168.1.101" \
     -s "$BASE_URL/test" | tail -1
```

### Authentication Rate Limiting Test

```bash
#!/bin/bash
# test-auth-rate-limiting.sh

echo "Testing Authentication Rate Limiting..."

BASE_URL="http://localhost:3000/api/v1/auth"
IP="192.168.1.200"

echo "Testing login rate limiting..."
for i in {1..7}; do
  echo "Login attempt $i:"
  curl -X POST \
       -H "Content-Type: application/json" \
       -H "X-Forwarded-For: $IP" \
       -d '{"email":"test@example.com","password":"wrongpassword"}' \
       -w "Status: %{http_code}\n" \
       -s "$BASE_URL/login" | tail -1
  sleep 1
done
```

## Performance Testing

### Rate Limiting Performance Test

```typescript
// tests/performance/rate-limiting-performance.test.ts
describe('Rate Limiting Performance', () => {
  it('should not significantly impact response time', async () => {
    const startTime = Date.now();
    
    // Make requests within rate limit
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        app.request('/test', {
          headers: { 'X-Forwarded-For': `192.168.1.${i}` }
        })
      );
    }
    
    await Promise.all(promises);
    const endTime = Date.now();
    
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 10;
    
    // Should complete within reasonable time
    expect(averageTime).toBeLessThan(100); // ms
  });

  it('should handle high concurrency', async () => {
    const promises = [];
    
    // Create 100 concurrent requests from different IPs
    for (let i = 0; i < 100; i++) {
      promises.push(
        app.request('/test', {
          headers: { 'X-Forwarded-For': `10.0.0.${i}` }
        })
      );
    }
    
    const startTime = Date.now();
    const responses = await Promise.all(promises);
    const endTime = Date.now();
    
    // All should succeed (different IPs)
    responses.forEach(res => {
      expect(res.status).toBe(200);
    });
    
    // Should complete in reasonable time
    expect(endTime - startTime).toBeLessThan(5000);
  });
});
```

## Monitoring Tests

### Rate Limit Monitoring

```typescript
describe('Rate Limiting Monitoring', () => {
  it('should log rate limit violations', async () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    
    // Exceed rate limit
    for (let i = 0; i < 11; i++) {
      await app.request('/test', {
        headers: { 'X-Forwarded-For': '192.168.1.99' }
      });
    }
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Rate limit exceeded')
    );
  });

  it('should track suspicious patterns', async () => {
    const consoleSpy = vi.spyOn(console, 'error');
    
    // Simulate rapid burst from same IP
    const promises = [];
    for (let i = 0; i < 20; i++) {
      promises.push(
        app.request('/test', {
          headers: { 'X-Forwarded-For': '192.168.1.98' }
        })
      );
    }
    
    await Promise.all(promises);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Suspicious activity detected')
    );
  });
});
```

## Test Data Setup

### Rate Limiting Test Utilities

```typescript
// tests/utils/rate-limiting-helpers.ts
export class RateLimitingTestHelper {
  static async exhaustRateLimit(app: Hono, ip: string, endpoint: string = '/test') {
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(
        app.request(endpoint, {
          headers: { 'X-Forwarded-For': ip }
        })
      );
    }
    return Promise.all(requests);
  }

  static async waitForReset() {
    // Wait for rate limit window to reset
    await new Promise(resolve => setTimeout(resolve, 60000));
  }

  static generateUniqueIP(): string {
    return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  static async checkRateLimitHeaders(response: Response) {
    return {
      limit: response.headers.get('X-RateLimit-Limit'),
      remaining: response.headers.get('X-RateLimit-Remaining'),
      reset: response.headers.get('X-RateLimit-Reset')
    };
  }
}
```

## Configuration Testing

### Test Different Rate Limit Configurations

```typescript
describe('Rate Limiting Configuration', () => {
  it('should respect custom rate limits', async () => {
    const customApp = new Hono();
    
    // Custom middleware with different limits
    const customRateLimit = createRateLimitMiddleware({
      windowMs: 30000, // 30 seconds
      max: 3, // 3 requests
      message: 'Custom rate limit exceeded'
    });
    
    customApp.use('*', customRateLimit);
    customApp.get('/test', (c) => c.json({ success: true }));

    // Should allow 3 requests
    for (let i = 0; i < 3; i++) {
      const res = await customApp.request('/test', {
        headers: { 'X-Forwarded-For': '192.168.1.50' }
      });
      expect(res.status).toBe(200);
    }

    // 4th request should be blocked
    const blockedRes = await customApp.request('/test', {
      headers: { 'X-Forwarded-For': '192.168.1.50' }
    });
    
    expect(blockedRes.status).toBe(429);
    const body = await blockedRes.json();
    expect(body.message).toBe('Custom rate limit exceeded');
  });
});
```

---

**Coverage**: Unit tests, Integration tests, Load testing, Performance monitoring
**Next**: [Layer 2 Testing Guide](LAYER_2_TESTING.md)
