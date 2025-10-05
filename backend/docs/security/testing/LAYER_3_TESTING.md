# 🧪 Layer 3 Session Security - Testing Guide

## Unit Testing

### Session Middleware Tests

```typescript
// tests/middleware/session-auth.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { sessionAuthMiddleware } from '../../src/middleware/session-auth.middleware';
import jwt from 'jsonwebtoken';

describe('Session Authentication Middleware', () => {
  let app: Hono;
  
  beforeEach(() => {
    app = new Hono();
    app.use('/protected/*', sessionAuthMiddleware);
    app.get('/protected/profile', (c) => {
      const user = c.get('user');
      return c.json({ user });
    });
    
    process.env.JWT_SECRET = 'test-secret-key';
    vi.clearAllMocks();
  });

  it('should allow access with valid JWT token', async () => {
    const payload = { userId: 1, email: 'test@example.com' };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

    const res = await app.request('/protected/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(res.status).toBe(200);
    
    const body = await res.json();
    expect(body.user.userId).toBe(1);
    expect(body.user.email).toBe('test@example.com');
  });

  it('should block access without token', async () => {
    const res = await app.request('/protected/profile');

    expect(res.status).toBe(401);
    
    const body = await res.json();
    expect(body.message).toContain('No token provided');
    expect(body.code).toBe('NO_TOKEN');
  });

  it('should block access with invalid token', async () => {
    const res = await app.request('/protected/profile', {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });

    expect(res.status).toBe(401);
    
    const body = await res.json();
    expect(body.message).toContain('Invalid token');
    expect(body.code).toBe('INVALID_TOKEN');
  });

  it('should block access with expired token', async () => {
    const payload = { userId: 1, email: 'test@example.com' };
    const expiredToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '-1h' });

    const res = await app.request('/protected/profile', {
      headers: {
        'Authorization': `Bearer ${expiredToken}`
      }
    });

    expect(res.status).toBe(401);
    
    const body = await res.json();
    expect(body.message).toContain('Token expired');
    expect(body.code).toBe('TOKEN_EXPIRED');
  });

  it('should handle malformed authorization header', async () => {
    const testCases = [
      'InvalidFormat',
      'Bearer',
      'Basic dGVzdA==',
      'Bearer token1 token2'
    ];

    for (const authHeader of testCases) {
      const res = await app.request('/protected/profile', {
        headers: {
          'Authorization': authHeader
        }
      });

      expect(res.status).toBe(401);
      
      const body = await res.json();
      expect(body.success).toBe(false);
    }
  });
});
```

### JWT Service Tests

```typescript
// tests/services/jwt.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { JWTService } from '../../src/services/jwt.service';

describe('JWT Service', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  it('should generate and verify valid tokens', async () => {
    const payload = { userId: 1, email: 'test@example.com' };
    
    const token = JWTService.generateToken(payload);
    expect(token).toBeTruthy();
    
    const decoded = JWTService.verifyToken(token);
    expect(decoded.userId).toBe(1);
    expect(decoded.email).toBe('test@example.com');
  });

  it('should generate refresh tokens', async () => {
    const payload = { userId: 1 };
    
    const refreshToken = JWTService.generateRefreshToken(payload);
    expect(refreshToken).toBeTruthy();
    
    const decoded = JWTService.verifyRefreshToken(refreshToken);
    expect(decoded.userId).toBe(1);
  });

  it('should reject invalid tokens', () => {
    expect(() => {
      JWTService.verifyToken('invalid-token');
    }).toThrow();
  });

  it('should reject expired tokens', () => {
    const payload = { userId: 1 };
    const expiredToken = JWTService.generateToken(payload, '-1h');
    
    expect(() => {
      JWTService.verifyToken(expiredToken);
    }).toThrow(/expired/);
  });

  it('should handle missing secret key', () => {
    delete process.env.JWT_SECRET;
    
    expect(() => {
      JWTService.generateToken({ userId: 1 });
    }).toThrow(/JWT_SECRET/);
  });
});
```

## Integration Testing

### Session Management Integration

```typescript
// tests/integration/session-management.test.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('Session Management Integration', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it('should complete full authentication flow', async () => {
    // 1. Register user
    const registerRes = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePass123!',
        captchaToken: 'valid-token'
      })
    });

    expect(registerRes.status).toBe(201);

    // 2. Login user
    const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'SecurePass123!'
      })
    });

    expect(loginRes.status).toBe(200);
    
    const loginBody = await loginRes.json();
    expect(loginBody.data.accessToken).toBeTruthy();
    expect(loginBody.data.refreshToken).toBeTruthy();

    // 3. Access protected resource
    const profileRes = await fetch('http://localhost:3000/api/v1/users/profile', {
      headers: {
        'Authorization': `Bearer ${loginBody.data.accessToken}`
      }
    });

    expect(profileRes.status).toBe(200);
    
    const profileBody = await profileRes.json();
    expect(profileBody.data.email).toBe('test@example.com');
  });

  it('should refresh expired tokens', async () => {
    // Create user and login
    const { accessToken, refreshToken } = await createUserAndLogin();

    // Wait for token to expire (in real test, mock time)
    vi.useFakeTimers();
    vi.advanceTimersByTime(3600000); // 1 hour

    // Try to access protected resource (should fail)
    const profileRes = await fetch('http://localhost:3000/api/v1/users/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    expect(profileRes.status).toBe(401);

    // Refresh token
    const refreshRes = await fetch('http://localhost:3000/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    expect(refreshRes.status).toBe(200);
    
    const refreshBody = await refreshRes.json();
    expect(refreshBody.data.accessToken).toBeTruthy();

    // Try again with new token
    const newProfileRes = await fetch('http://localhost:3000/api/v1/users/profile', {
      headers: {
        'Authorization': `Bearer ${refreshBody.data.accessToken}`
      }
    });

    expect(newProfileRes.status).toBe(200);

    vi.useRealTimers();
  });

  it('should logout and invalidate tokens', async () => {
    const { accessToken, refreshToken } = await createUserAndLogin();

    // Logout
    const logoutRes = await fetch('http://localhost:3000/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    expect(logoutRes.status).toBe(200);

    // Try to access protected resource (should fail)
    const profileRes = await fetch('http://localhost:3000/api/v1/users/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    expect(profileRes.status).toBe(401);

    // Try to refresh (should fail)
    const refreshRes = await fetch('http://localhost:3000/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    expect(refreshRes.status).toBe(401);
  });
});
```

## Security Testing

### Token Security Tests

```typescript
describe('Token Security Tests', () => {
  it('should prevent token tampering', async () => {
    const { accessToken } = await createUserAndLogin();
    
    // Tamper with token
    const parts = accessToken.split('.');
    const payload = JSON.parse(atob(parts[1]));
    payload.userId = 999; // Change user ID
    parts[1] = btoa(JSON.stringify(payload));
    const tamperedToken = parts.join('.');

    const res = await fetch('http://localhost:3000/api/v1/users/profile', {
      headers: {
        'Authorization': `Bearer ${tamperedToken}`
      }
    });

    expect(res.status).toBe(401);
  });

  it('should prevent JWT algorithm confusion attacks', async () => {
    // Create token with 'none' algorithm
    const header = { alg: 'none', typ: 'JWT' };
    const payload = { userId: 1, email: 'hacker@example.com' };
    
    const noneToken = `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.`;

    const res = await fetch('http://localhost:3000/api/v1/users/profile', {
      headers: {
        'Authorization': `Bearer ${noneToken}`
      }
    });

    expect(res.status).toBe(401);
  });

  it('should prevent cross-user token usage', async () => {
    // Create two users
    const user1 = await createUserAndLogin('user1@example.com');
    const user2 = await createUserAndLogin('user2@example.com');

    // Try to access user2's profile with user1's token
    const res = await fetch(`http://localhost:3000/api/v1/users/${user2.userId}/profile`, {
      headers: {
        'Authorization': `Bearer ${user1.accessToken}`
      }
    });

    expect(res.status).toBe(403); // Forbidden
  });

  it('should detect concurrent session abuse', async () => {
    const { accessToken } = await createUserAndLogin();

    // Make multiple concurrent requests
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        fetch('http://localhost:3000/api/v1/users/profile', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Forwarded-For': `192.168.1.${i}`
          }
        })
      );
    }

    const responses = await Promise.all(promises);
    
    // Some requests might be blocked due to suspicious activity
    const blockedRequests = responses.filter(r => r.status === 429).length;
    expect(blockedRequests).toBeGreaterThan(0);
  });
});
```

## Performance Testing

### Session Performance Tests

```typescript
describe('Session Performance Tests', () => {
  it('should handle concurrent authentication requests', async () => {
    const promises = [];
    
    for (let i = 0; i < 50; i++) {
      promises.push(
        fetch('http://localhost:3000/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `user${i}@example.com`,
            password: 'password123'
          })
        })
      );
    }

    const startTime = Date.now();
    const responses = await Promise.all(promises);
    const endTime = Date.now();

    // Check response times
    expect(endTime - startTime).toBeLessThan(5000); // 5 seconds
    
    // Check success rate
    const successCount = responses.filter(r => r.status === 200).length;
    expect(successCount).toBeGreaterThan(40); // At least 80% success
  });

  it('should efficiently verify tokens', async () => {
    const { accessToken } = await createUserAndLogin();
    
    const startTime = Date.now();
    
    // Make multiple protected requests
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(
        fetch('http://localhost:3000/api/v1/users/profile', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      );
    }

    await Promise.all(promises);
    const endTime = Date.now();

    const averageTime = (endTime - startTime) / 100;
    expect(averageTime).toBeLessThan(50); // Less than 50ms average
  });
});
```

## Manual Testing

### Session Testing Script

```bash
#!/bin/bash
# test-session-security.sh

echo "Testing Session Security..."

BASE_URL="http://localhost:3000/api/v1"

echo "1. Testing login and token generation..."
LOGIN_RESPONSE=$(curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }' \
  -s "$BASE_URL/auth/login")

echo "Login Response: $LOGIN_RESPONSE"

# Extract tokens (requires jq)
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.refreshToken')

echo -e "\n2. Testing protected resource access..."
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/users/profile" | tail -1

echo -e "\n3. Testing access without token..."
curl -w "Status: %{http_code}\n" \
     -s "$BASE_URL/users/profile" | tail -1

echo -e "\n4. Testing access with invalid token..."
curl -H "Authorization: Bearer invalid-token" \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/users/profile" | tail -1

echo -e "\n5. Testing token refresh..."
curl -X POST \
     -H "Content-Type: application/json" \
     -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}" \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/auth/refresh" | tail -1

echo -e "\n6. Testing logout..."
curl -X POST \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}" \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/auth/logout" | tail -1
```

### Token Validation Test

```typescript
// Token validation test utility
export class TokenTestHelper {
  static async testTokenLifecycle() {
    console.log('Starting token lifecycle test...');

    // 1. Login
    const loginRes = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (loginRes.status !== 200) {
      throw new Error('Login failed');
    }

    const { accessToken, refreshToken } = (await loginRes.json()).data;
    console.log('✅ Login successful');

    // 2. Access protected resource
    const profileRes = await fetch('/api/v1/users/profile', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (profileRes.status !== 200) {
      throw new Error('Protected access failed');
    }
    console.log('✅ Protected access successful');

    // 3. Refresh token
    const refreshRes = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (refreshRes.status !== 200) {
      throw new Error('Token refresh failed');
    }
    console.log('✅ Token refresh successful');

    // 4. Logout
    const logoutRes = await fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (logoutRes.status !== 200) {
      throw new Error('Logout failed');
    }
    console.log('✅ Logout successful');

    console.log('✅ Token lifecycle test completed successfully');
  }
}
```

## Monitoring Tests

### Session Monitoring Tests

```typescript
describe('Session Monitoring', () => {
  it('should log successful authentications', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    await app.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'correctpassword'
      })
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('User authenticated successfully')
    );
  });

  it('should track failed authentication attempts', async () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    
    await app.request('/protected/profile', {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Authentication failed')
    );
  });

  it('should detect token abuse patterns', async () => {
    const consoleSpy = vi.spyOn(console, 'error');
    
    // Simulate rapid token usage from different IPs
    const token = 'valid-token';
    
    for (let i = 0; i < 10; i++) {
      await app.request('/protected/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Forwarded-For': `192.168.1.${i}`
        }
      });
    }

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Suspicious token usage detected')
    );
  });
});
```

---

**Coverage**: Authentication flow, Token security, Session management, Performance monitoring
**Next**: [Layer 4 Testing Guide](LAYER_4_TESTING.md)
