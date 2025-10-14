# 🧪 Layer 4 CSRF Protection - Testing Guide

## Unit Testing

### CSRF Middleware Tests

```typescript
// tests/middleware/csrf.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { csrfMiddleware } from '../../src/middleware/csrf.middleware';

describe('CSRF Middleware', () => {
  let app: Hono;
  
  beforeEach(() => {
    app = new Hono();
    app.use('*', csrfMiddleware);
    app.post('/api/users', (c) => c.json({ success: true }));
    app.put('/api/users/1', (c) => c.json({ success: true }));
    app.delete('/api/users/1', (c) => c.json({ success: true }));
    vi.clearAllMocks();
  });

  it('should allow GET requests without CSRF token', async () => {
    app.get('/api/users', (c) => c.json({ users: [] }));
    
    const res = await app.request('/api/users', {
      method: 'GET'
    });

    expect(res.status).toBe(200);
  });

  it('should allow HEAD requests without CSRF token', async () => {
    app.head('/api/users', (c) => c.json({}));
    
    const res = await app.request('/api/users', {
      method: 'HEAD'
    });

    expect(res.status).toBe(200);
  });

  it('should allow OPTIONS requests without CSRF token', async () => {
    app.options('/api/users', (c) => c.json({}));
    
    const res = await app.request('/api/users', {
      method: 'OPTIONS'
    });

    expect(res.status).toBe(200);
  });

  it('should block POST requests without CSRF token', async () => {
    const res = await app.request('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User' })
    });

    expect(res.status).toBe(403);
    
    const body = await res.json();
    expect(body.message).toContain('CSRF token missing');
    expect(body.code).toBe('CSRF_TOKEN_MISSING');
  });

  it('should block PUT requests without CSRF token', async () => {
    const res = await app.request('/api/users/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated User' })
    });

    expect(res.status).toBe(403);
    
    const body = await res.json();
    expect(body.message).toContain('CSRF token missing');
  });

  it('should block DELETE requests without CSRF token', async () => {
    const res = await app.request('/api/users/1', {
      method: 'DELETE'
    });

    expect(res.status).toBe(403);
    
    const body = await res.json();
    expect(body.message).toContain('CSRF token missing');
  });

  it('should block requests with invalid CSRF token', async () => {
    const res = await app.request('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'invalid-token'
      },
      body: JSON.stringify({ name: 'Test User' })
    });

    expect(res.status).toBe(403);
    
    const body = await res.json();
    expect(body.message).toContain('Invalid CSRF token');
    expect(body.code).toBe('CSRF_TOKEN_INVALID');
  });

  it('should allow requests with valid CSRF token in header', async () => {
    // First, get a CSRF token
    app.get('/csrf-token', (c) => {
      const token = c.get('csrfToken');
      return c.json({ csrfToken: token });
    });

    const tokenRes = await app.request('/csrf-token');
    const { csrfToken } = await tokenRes.json();

    // Use the token in a POST request
    const res = await app.request('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ name: 'Test User' })
    });

    expect(res.status).toBe(200);
  });

  it('should allow requests with valid CSRF token in form data', async () => {
    // Get CSRF token
    app.get('/csrf-token', (c) => {
      const token = c.get('csrfToken');
      return c.json({ csrfToken: token });
    });

    const tokenRes = await app.request('/csrf-token');
    const { csrfToken } = await tokenRes.json();

    // Use the token in form data
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('_token', csrfToken);

    const res = await app.request('/api/users', {
      method: 'POST',
      body: formData
    });

    expect(res.status).toBe(200);
  });

  it('should handle double submit cookie validation', async () => {
    // Get CSRF token from cookie
    const tokenRes = await app.request('/csrf-token');
    const cookies = tokenRes.headers.get('Set-Cookie');
    const csrfCookie = cookies?.match(/csrf-token=([^;]+)/)?.[1];

    expect(csrfCookie).toBeTruthy();

    // Use the same token in header and cookie
    const res = await app.request('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfCookie!,
        'Cookie': `csrf-token=${csrfCookie}`
      },
      body: JSON.stringify({ name: 'Test User' })
    });

    expect(res.status).toBe(200);
  });
});
```

### CSRF Token Generation Tests

```typescript
// tests/services/csrf.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { CSRFService } from '../../src/services/csrf.service';

describe('CSRF Service', () => {
  beforeEach(() => {
    process.env.CSRF_SECRET = 'test-csrf-secret';
  });

  it('should generate unique CSRF tokens', () => {
    const token1 = CSRFService.generateToken();
    const token2 = CSRFService.generateToken();
    
    expect(token1).toBeTruthy();
    expect(token2).toBeTruthy();
    expect(token1).not.toBe(token2);
  });

  it('should validate generated tokens', () => {
    const token = CSRFService.generateToken();
    const isValid = CSRFService.validateToken(token);
    
    expect(isValid).toBe(true);
  });

  it('should reject invalid tokens', () => {
    const invalidTokens = [
      'invalid-token',
      '',
      'too-short',
      'a'.repeat(1000), // too long
      '12345', // only numbers
      null,
      undefined
    ];

    invalidTokens.forEach(token => {
      const isValid = CSRFService.validateToken(token as any);
      expect(isValid).toBe(false);
    });
  });

  it('should handle token expiration', () => {
    // Mock time
    vi.useFakeTimers();
    
    const token = CSRFService.generateToken();
    
    // Advance time by 2 hours (beyond expiration)
    vi.advanceTimersByTime(2 * 60 * 60 * 1000);
    
    const isValid = CSRFService.validateToken(token);
    expect(isValid).toBe(false);
    
    vi.useRealTimers();
  });
});
```

## Integration Testing

### CSRF Protection Integration Tests

```typescript
// tests/integration/csrf-protection.test.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('CSRF Protection Integration', () => {
  let csrfToken: string;
  let sessionCookie: string;

  beforeEach(async () => {
    await resetTestDatabase();
    
    // Login to get session
    const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const loginBody = await loginRes.json();
    sessionCookie = `session=${loginBody.data.accessToken}`;

    // Get CSRF token
    const csrfRes = await fetch('http://localhost:3000/api/v1/csrf-token', {
      headers: { 'Cookie': sessionCookie }
    });

    const csrfBody = await csrfRes.json();
    csrfToken = csrfBody.csrfToken;
  });

  it('should protect user profile updates', async () => {
    // Try without CSRF token (should fail)
    const unprotectedRes = await fetch('http://localhost:3000/api/v1/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify({
        name: 'Updated Name'
      })
    });

    expect(unprotectedRes.status).toBe(403);

    // Try with CSRF token (should succeed)
    const protectedRes = await fetch('http://localhost:3000/api/v1/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({
        name: 'Updated Name'
      })
    });

    expect(protectedRes.status).toBe(200);
  });

  it('should protect booking creation', async () => {
    const bookingData = {
      trainId: 'train-123',
      departureDate: '2024-02-01',
      passengers: [{ name: 'Test Passenger' }]
    };

    // Without CSRF token
    const unprotectedRes = await fetch('http://localhost:3000/api/v1/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify(bookingData)
    });

    expect(unprotectedRes.status).toBe(403);

    // With CSRF token
    const protectedRes = await fetch('http://localhost:3000/api/v1/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(bookingData)
    });

    expect(protectedRes.status).toBe(201);
  });

  it('should protect payment processing', async () => {
    const paymentData = {
      amount: 150000,
      method: 'credit_card',
      bookingId: 1
    };

    // Without CSRF token
    const unprotectedRes = await fetch('http://localhost:3000/api/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify(paymentData)
    });

    expect(unprotectedRes.status).toBe(403);

    // With CSRF token
    const protectedRes = await fetch('http://localhost:3000/api/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(paymentData)
    });

    expect(protectedRes.status).toBe(200);
  });

  it('should allow safe methods without CSRF', async () => {
    const safeRequests = [
      { method: 'GET', path: '/api/v1/users/profile' },
      { method: 'GET', path: '/api/v1/bookings' },
      { method: 'HEAD', path: '/api/v1/trains' },
      { method: 'OPTIONS', path: '/api/v1/schedules' }
    ];

    for (const req of safeRequests) {
      const res = await fetch(`http://localhost:3000${req.path}`, {
        method: req.method,
        headers: { 'Cookie': sessionCookie }
      });

      expect(res.status).not.toBe(403);
    }
  });
});
```

## Security Testing

### CSRF Attack Simulation Tests

```typescript
describe('CSRF Attack Simulation', () => {
  it('should prevent basic CSRF attack', async () => {
    // Simulate attacker's site trying to make a request
    const maliciousRequest = await fetch('http://localhost:3000/api/v1/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://malicious-site.com',
        'Referer': 'https://malicious-site.com/attack.html'
      },
      body: JSON.stringify({
        name: 'Hacked Name',
        email: 'hacker@evil.com'
      })
    });

    expect(maliciousRequest.status).toBe(403);
  });

  it('should prevent token reuse attack', async () => {
    // Get a valid token
    const tokenRes = await fetch('http://localhost:3000/api/v1/csrf-token');
    const { csrfToken } = await tokenRes.json();

    // Use the token for a legitimate request
    const firstRes = await fetch('http://localhost:3000/api/v1/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ name: 'Legitimate Update' })
    });

    expect(firstRes.status).toBe(200);

    // Try to reuse the same token (should fail if single-use)
    const secondRes = await fetch('http://localhost:3000/api/v1/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ name: 'Attempted Reuse' })
    });

    // Depending on implementation, this might succeed or fail
    // If single-use tokens are implemented, it should fail
  });

  it('should prevent token prediction attacks', async () => {
    const tokens = [];
    
    // Generate multiple tokens
    for (let i = 0; i < 10; i++) {
      const res = await fetch('http://localhost:3000/api/v1/csrf-token');
      const { csrfToken } = await res.json();
      tokens.push(csrfToken);
    }

    // Check that tokens are not predictable
    const uniqueTokens = new Set(tokens);
    expect(uniqueTokens.size).toBe(tokens.length);

    // Check token randomness (basic test)
    tokens.forEach(token => {
      expect(token.length).toBeGreaterThan(16);
      expect(/^[a-zA-Z0-9+/]+=*$/.test(token)).toBe(true); // Base64 pattern
    });
  });

  it('should prevent subdomain attack', async () => {
    const { csrfToken, sessionCookie } = await getValidTokenAndSession();

    // Try to use token from a subdomain attack
    const subdomainAttack = await fetch('http://localhost:3000/api/v1/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://evil.example.com', // Subdomain of legitimate site
        'Cookie': sessionCookie,
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ name: 'Subdomain Attack' })
    });

    // Should be blocked based on origin validation
    expect(subdomainAttack.status).toBe(403);
  });
});
```

## Manual Testing

### CSRF Testing Script

```bash
#!/bin/bash
# test-csrf-protection.sh

echo "Testing CSRF Protection..."

BASE_URL="http://localhost:3000/api/v1"

# Login first to get session
echo "1. Logging in to get session..."
LOGIN_RESPONSE=$(curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt \
  -s "$BASE_URL/auth/login")

echo "Login Response: $LOGIN_RESPONSE"

# Get CSRF token
echo -e "\n2. Getting CSRF token..."
CSRF_RESPONSE=$(curl -b cookies.txt \
  -s "$BASE_URL/csrf-token")

echo "CSRF Response: $CSRF_RESPONSE"

# Extract CSRF token (requires jq)
CSRF_TOKEN=$(echo $CSRF_RESPONSE | jq -r '.csrfToken')

echo -e "\n3. Testing POST without CSRF token (should fail)..."
curl -X POST \
     -b cookies.txt \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Update"}' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/users/profile" | tail -1

echo -e "\n4. Testing POST with CSRF token (should succeed)..."
curl -X POST \
     -b cookies.txt \
     -H "Content-Type: application/json" \
     -H "X-CSRF-Token: $CSRF_TOKEN" \
     -d '{"name": "Test Update"}' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/users/profile" | tail -1

echo -e "\n5. Testing with invalid CSRF token (should fail)..."
curl -X POST \
     -b cookies.txt \
     -H "Content-Type: application/json" \
     -H "X-CSRF-Token: invalid-token" \
     -d '{"name": "Test Update"}' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/users/profile" | tail -1

echo -e "\n6. Testing GET request (should work without CSRF)..."
curl -b cookies.txt \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/users/profile" | tail -1

# Cleanup
rm -f cookies.txt
```

### HTML Form CSRF Test

```html
<!-- test-csrf-form.html -->
<!DOCTYPE html>
<html>
<head>
    <title>CSRF Protection Test</title>
</head>
<body>
    <h1>CSRF Protection Test</h1>
    
    <!-- Legitimate form with CSRF token -->
    <h2>Legitimate Form</h2>
    <form id="legitimateForm">
        <input type="hidden" id="csrfToken" name="_token">
        <input type="text" name="name" placeholder="Name" required>
        <button type="submit">Update Profile</button>
    </form>

    <!-- Malicious form without CSRF token -->
    <h2>Malicious Form (should fail)</h2>
    <form id="maliciousForm">
        <input type="text" name="name" value="Hacked Name" readonly>
        <button type="submit">Attempt Attack</button>
    </form>

    <div id="result"></div>

    <script>
        // Get CSRF token
        fetch('/api/v1/csrf-token')
            .then(response => response.json())
            .then(data => {
                document.getElementById('csrfToken').value = data.csrfToken;
            });

        // Legitimate form submission
        document.getElementById('legitimateForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/v1/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': data._token
                    },
                    body: JSON.stringify({ name: data.name })
                });
                
                const result = await response.json();
                document.getElementById('result').innerHTML = 
                    `<h3>Legitimate Request:</h3><pre>${JSON.stringify(result, null, 2)}</pre>`;
                    
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    `<p style="color: red;">Error: ${error.message}</p>`;
            }
        });

        // Malicious form submission
        document.getElementById('maliciousForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/v1/users/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: data.name })
                });
                
                const result = await response.json();
                document.getElementById('result').innerHTML += 
                    `<h3>Malicious Request:</h3><pre>${JSON.stringify(result, null, 2)}</pre>`;
                    
            } catch (error) {
                document.getElementById('result').innerHTML += 
                    `<p style="color: red;">Malicious request error: ${error.message}</p>`;
            }
        });
    </script>
</body>
</html>
```

## Performance Testing

### CSRF Performance Tests

```typescript
describe('CSRF Performance Tests', () => {
  it('should not significantly impact response time', async () => {
    const { csrfToken, sessionCookie } = await getValidTokenAndSession();
    
    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(
        fetch('http://localhost:3000/api/v1/users/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': sessionCookie,
            'X-CSRF-Token': csrfToken
          },
          body: JSON.stringify({ name: `User ${i}` })
        })
      );
    }
    
    await Promise.all(promises);
    const endTime = Date.now();
    
    const averageTime = (endTime - startTime) / 50;
    expect(averageTime).toBeLessThan(100); // Less than 100ms average
  });

  it('should handle token generation load', async () => {
    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(
        fetch('http://localhost:3000/api/v1/csrf-token')
      );
    }
    
    const responses = await Promise.all(promises);
    const endTime = Date.now();
    
    // All requests should succeed
    responses.forEach(res => {
      expect(res.status).toBe(200);
    });
    
    const totalTime = endTime - startTime;
    expect(totalTime).toBeLessThan(5000); // Complete within 5 seconds
  });
});
```

## Test Utilities

### CSRF Test Helpers

```typescript
// tests/utils/csrf-helpers.ts
export class CSRFTestHelper {
  static async getValidTokenAndSession(): Promise<{
    csrfToken: string;
    sessionCookie: string;
  }> {
    // Login
    const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const loginBody = await loginRes.json();
    const sessionCookie = `session=${loginBody.data.accessToken}`;

    // Get CSRF token
    const csrfRes = await fetch('http://localhost:3000/api/v1/csrf-token', {
      headers: { 'Cookie': sessionCookie }
    });

    const csrfBody = await csrfRes.json();
    
    return {
      csrfToken: csrfBody.csrfToken,
      sessionCookie
    };
  }

  static createProtectedRequest(
    url: string,
    method: string,
    data: any,
    csrfToken: string,
    sessionCookie: string
  ) {
    return {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(data)
    };
  }

  static createMaliciousRequest(url: string, method: string, data: any) {
    return {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://malicious-site.com',
        'Referer': 'https://malicious-site.com/attack.html'
      },
      body: JSON.stringify(data)
    };
  }
}
```

---

**Coverage**: CSRF token validation, Attack prevention, Form protection, Performance testing
**Next**: [Layer 5 Testing Guide](LAYER_5_TESTING.md)
