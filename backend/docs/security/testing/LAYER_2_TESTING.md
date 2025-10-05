# 🧪 Layer 2 CAPTCHA Verification - Testing Guide

## Unit Testing

### CAPTCHA Middleware Tests

```typescript
// tests/middleware/captcha.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { captchaMiddleware } from '../../src/middleware/captcha.middleware';
import { verifyCaptcha } from '../../src/common/utils/verifyCaptcha';

// Mock the verifyCaptcha function
vi.mock('../../src/common/utils/verifyCaptcha');

describe('CAPTCHA Middleware', () => {
  let app: Hono;
  
  beforeEach(() => {
    app = new Hono();
    app.use('/auth/*', captchaMiddleware);
    app.post('/auth/register', (c) => c.json({ success: true }));
    vi.clearAllMocks();
  });

  it('should allow requests with valid CAPTCHA', async () => {
    // Mock successful CAPTCHA verification
    vi.mocked(verifyCaptcha).mockResolvedValue(true);

    const res = await app.request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        captchaToken: 'valid-token'
      })
    });

    expect(res.status).toBe(200);
    expect(verifyCaptcha).toHaveBeenCalledWith('valid-token');
  });

  it('should block requests with invalid CAPTCHA', async () => {
    // Mock failed CAPTCHA verification
    vi.mocked(verifyCaptcha).mockResolvedValue(false);

    const res = await app.request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        captchaToken: 'invalid-token'
      })
    });

    expect(res.status).toBe(400);
    
    const body = await res.json();
    expect(body.message).toContain('CAPTCHA verification failed');
    expect(body.code).toBe('CAPTCHA_FAILED');
  });

  it('should block requests without CAPTCHA token', async () => {
    const res = await app.request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    expect(res.status).toBe(400);
    
    const body = await res.json();
    expect(body.message).toContain('CAPTCHA token is required');
  });

  it('should handle CAPTCHA verification errors', async () => {
    // Mock CAPTCHA service error
    vi.mocked(verifyCaptcha).mockRejectedValue(new Error('Service unavailable'));

    const res = await app.request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        captchaToken: 'some-token'
      })
    });

    expect(res.status).toBe(500);
    
    const body = await res.json();
    expect(body.message).toContain('CAPTCHA verification error');
  });
});
```

### CAPTCHA Verification Function Tests

```typescript
// tests/utils/verifyCaptcha.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyCaptcha } from '../../src/common/utils/verifyCaptcha';

// Mock fetch
global.fetch = vi.fn();

describe('verifyCaptcha Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret-key';
  });

  it('should return true for valid CAPTCHA', async () => {
    // Mock successful reCAPTCHA response
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        score: 0.9,
        action: 'register'
      })
    } as Response);

    const result = await verifyCaptcha('valid-token');
    
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'secret=test-secret-key&response=valid-token'
      })
    );
  });

  it('should return false for invalid CAPTCHA', async () => {
    // Mock failed reCAPTCHA response
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: false,
        'error-codes': ['invalid-input-response']
      })
    } as Response);

    const result = await verifyCaptcha('invalid-token');
    
    expect(result).toBe(false);
  });

  it('should return false for low score CAPTCHA', async () => {
    // Mock low score reCAPTCHA response
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        score: 0.2, // Below threshold
        action: 'register'
      })
    } as Response);

    const result = await verifyCaptcha('low-score-token');
    
    expect(result).toBe(false);
  });

  it('should handle network errors', async () => {
    // Mock network error
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const result = await verifyCaptcha('any-token');
    
    expect(result).toBe(false);
  });

  it('should handle missing secret key', async () => {
    delete process.env.RECAPTCHA_SECRET_KEY;

    const result = await verifyCaptcha('any-token');
    
    expect(result).toBe(false);
  });
});
```

## Integration Testing

### Full Authentication Flow with CAPTCHA

```typescript
// tests/integration/auth-captcha.test.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('Authentication with CAPTCHA Integration', () => {
  beforeEach(async () => {
    // Reset test database
    await resetTestDatabase();
  });

  it('should complete registration with valid CAPTCHA', async () => {
    // Get valid CAPTCHA token (in real test, mock this)
    const captchaToken = await getCaptchaToken();

    const registrationData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!',
      captchaToken
    };

    const res = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData)
    });

    expect(res.status).toBe(201);
    
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.email).toBe('test@example.com');
  });

  it('should block registration with invalid CAPTCHA', async () => {
    const registrationData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!',
      captchaToken: 'invalid-token'
    };

    const res = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData)
    });

    expect(res.status).toBe(400);
    
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('CAPTCHA');
  });

  it('should handle login with CAPTCHA after failed attempts', async () => {
    // Create user first
    await createTestUser();

    // Make multiple failed login attempts to trigger CAPTCHA requirement
    for (let i = 0; i < 3; i++) {
      await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
      });
    }

    // Next login should require CAPTCHA
    const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'correctpassword'
      })
    });

    expect(loginRes.status).toBe(400);
    
    const body = await loginRes.json();
    expect(body.message).toContain('CAPTCHA required');
  });
});
```

## Manual Testing

### CAPTCHA Testing Script

```bash
#!/bin/bash
# test-captcha.sh

echo "Testing CAPTCHA Verification..."

BASE_URL="http://localhost:3000/api/v1/auth"

echo "1. Testing registration without CAPTCHA token..."
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "SecurePass123!"
     }' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/register" | tail -1

echo -e "\n2. Testing registration with invalid CAPTCHA token..."
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test2@example.com",
       "password": "SecurePass123!",
       "captchaToken": "invalid-token"
     }' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/register" | tail -1

echo -e "\n3. Testing login without CAPTCHA (should work initially)..."
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
       "email": "existing@example.com",
       "password": "correctpassword"
     }' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/login" | tail -1
```

### Frontend CAPTCHA Testing

```html
<!-- test-captcha.html -->
<!DOCTYPE html>
<html>
<head>
    <title>CAPTCHA Test</title>
    <script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
</head>
<body>
    <h1>CAPTCHA Test Form</h1>
    
    <form id="testForm">
        <input type="email" name="email" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Submit</button>
    </form>

    <div id="result"></div>

    <script>
        document.getElementById('testForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                // Get CAPTCHA token
                const token = await grecaptcha.execute('YOUR_SITE_KEY', {
                    action: 'register'
                });
                
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                data.captchaToken = token;
                
                const response = await fetch('/api/v1/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                document.getElementById('result').innerHTML = 
                    `<pre>${JSON.stringify(result, null, 2)}</pre>`;
                    
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    `<p style="color: red;">Error: ${error.message}</p>`;
            }
        });
    </script>
</body>
</html>
```

## Performance Testing

### CAPTCHA Performance Tests

```typescript
// tests/performance/captcha-performance.test.ts
describe('CAPTCHA Performance', () => {
  it('should not significantly impact response time', async () => {
    const startTime = Date.now();
    
    // Mock fast CAPTCHA verification
    vi.mocked(verifyCaptcha).mockResolvedValue(true);
    
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        app.request('/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `test${i}@example.com`,
            password: 'password123',
            captchaToken: 'valid-token'
          })
        })
      );
    }
    
    await Promise.all(promises);
    const endTime = Date.now();
    
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 10;
    
    // CAPTCHA verification should add minimal overhead
    expect(averageTime).toBeLessThan(200); // ms
  });

  it('should handle concurrent CAPTCHA verifications', async () => {
    vi.mocked(verifyCaptcha).mockImplementation(async (token) => {
      // Simulate variable CAPTCHA verification time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      return token !== 'invalid-token';
    });

    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(
        app.request('/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `test${i}@example.com`,
            password: 'password123',
            captchaToken: i % 5 === 0 ? 'invalid-token' : 'valid-token'
          })
        })
      );
    }

    const responses = await Promise.all(promises);
    
    const successCount = responses.filter(r => r.status === 201).length;
    const failureCount = responses.filter(r => r.status === 400).length;
    
    expect(successCount).toBe(40); // 40 valid tokens
    expect(failureCount).toBe(10); // 10 invalid tokens
  });
});
```

## Security Testing

### CAPTCHA Bypass Attempts

```typescript
describe('CAPTCHA Security Tests', () => {
  it('should prevent bypass attempts', async () => {
    const bypassAttempts = [
      // Empty token
      { captchaToken: '' },
      // Null token
      { captchaToken: null },
      // Undefined token
      {},
      // Non-string token
      { captchaToken: 123 },
      // Very long token
      { captchaToken: 'a'.repeat(10000) },
      // Malicious token
      { captchaToken: '<script>alert("xss")</script>' }
    ];

    for (const attempt of bypassAttempts) {
      const res = await app.request('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
          ...attempt
        })
      });

      expect(res.status).toBe(400);
      
      const body = await res.json();
      expect(body.success).toBe(false);
    }
  });

  it('should prevent token reuse', async () => {
    const token = 'valid-but-used-token';
    
    // Mock successful verification for first use
    vi.mocked(verifyCaptcha).mockResolvedValueOnce(true);
    
    // First request should succeed
    const firstRes = await app.request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test1@example.com',
        password: 'password123',
        captchaToken: token
      })
    });
    
    expect(firstRes.status).toBe(201);
    
    // Mock token reuse detection (should fail)
    vi.mocked(verifyCaptcha).mockResolvedValueOnce(false);
    
    // Second request with same token should fail
    const secondRes = await app.request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test2@example.com',
        password: 'password123',
        captchaToken: token
      })
    });
    
    expect(secondRes.status).toBe(400);
  });
});
```

## Monitoring Tests

### CAPTCHA Failure Monitoring

```typescript
describe('CAPTCHA Monitoring', () => {
  it('should log CAPTCHA failures', async () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    
    vi.mocked(verifyCaptcha).mockResolvedValue(false);

    await app.request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        captchaToken: 'invalid-token'
      })
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('CAPTCHA verification failed')
    );
  });

  it('should track suspicious CAPTCHA patterns', async () => {
    const consoleSpy = vi.spyOn(console, 'error');
    
    // Simulate multiple CAPTCHA failures from same IP
    for (let i = 0; i < 5; i++) {
      vi.mocked(verifyCaptcha).mockResolvedValue(false);
      
      await app.request('/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Forwarded-For': '192.168.1.100'
        },
        body: JSON.stringify({
          email: `test${i}@example.com`,
          password: 'password123',
          captchaToken: 'invalid-token'
        })
      });
    }

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Multiple CAPTCHA failures')
    );
  });
});
```

## Test Utilities

### CAPTCHA Test Helpers

```typescript
// tests/utils/captcha-helpers.ts
export class CaptchaTestHelper {
  static mockValidCaptcha() {
    vi.mocked(verifyCaptcha).mockResolvedValue(true);
  }

  static mockInvalidCaptcha() {
    vi.mocked(verifyCaptcha).mockResolvedValue(false);
  }

  static mockCaptchaError() {
    vi.mocked(verifyCaptcha).mockRejectedValue(new Error('Service error'));
  }

  static async getCaptchaToken(): Promise<string> {
    // In real tests, this would generate a test token
    // For unit tests, return a mock token
    return 'test-captcha-token';
  }

  static createRequestWithCaptcha(data: any, token?: string) {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        captchaToken: token || 'valid-test-token'
      })
    };
  }
}
```

---

**Coverage**: Unit tests, Integration tests, Security testing, Performance monitoring
**Next**: [Layer 3 Testing Guide](LAYER_3_TESTING.md)
