# 🛡️ PENTA Security Layer 2: CAPTCHA Verification

## Overview

The second layer of our PENTA Security Framework implements Google reCAPTCHA v2 integration to distinguish between human users and automated bots. This layer provides robust protection against automated attacks while maintaining good user experience.

## Features

### 🤖 **Bot Protection**
- **Google reCAPTCHA v2**: Industry-standard bot detection
- **Server-side Verification**: Secure token validation
- **Configurable Thresholds**: Adjustable security levels
- **Fallback Mechanisms**: Graceful degradation when service unavailable

### 🎯 **Smart Integration**
- **Selective Application**: Applied only to sensitive endpoints
- **Non-blocking UI**: Asynchronous verification process
- **Error Handling**: Comprehensive error messages and recovery
- **Performance Optimized**: Minimal impact on user experience

## Implementation

### CAPTCHA Verification Utility

```typescript
// src/common/utils/verifyCaptcha.ts
interface CaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export const verifyCaptcha = async (token: string): Promise<boolean> => {
  try {
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      return false;
    }

    console.log('🔍 Verifying CAPTCHA token...');
    
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    if (!response.ok) {
      console.error('CAPTCHA verification request failed:', response.status);
      return false;
    }

    const data: CaptchaResponse = await response.json();
    
    console.log('📊 CAPTCHA verification result:', {
      success: data.success,
      hostname: data.hostname,
      errors: data['error-codes']
    });

    if (!data.success) {
      console.warn('❌ CAPTCHA verification failed:', data['error-codes']);
      return false;
    }

    console.log('✅ CAPTCHA verification successful');
    return true;

  } catch (error) {
    console.error('💥 CAPTCHA verification error:', error);
    return false;
  }
};
```

### CAPTCHA Middleware

```typescript
// src/middleware/captcha-middleware.ts
import { MiddlewareHandler } from 'hono';
import { verifyCaptcha } from '../utils/verifyCaptcha';

export const captchaMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    // Get the request body
    const body = await c.req.json();
    
    console.log('🔐 CAPTCHA middleware activated');
    const captchaToken = body.captchaToken;

    if (!captchaToken) {
      console.error('❌ CAPTCHA token missing in request');
      return c.json({ 
        success: false, 
        message: "Token CAPTCHA diperlukan",
        code: "CAPTCHA_REQUIRED"
      }, 400);
    }

    console.log('🎫 CAPTCHA token received:', captchaToken.substring(0, 20) + "...");
    
    const isValid = await verifyCaptcha(captchaToken);
    console.log('📋 CAPTCHA validation result:', isValid);
    
    if (!isValid) {
      return c.json({ 
        success: false, 
        message: "Verifikasi CAPTCHA gagal. Silakan coba lagi.",
        code: "CAPTCHA_INVALID"
      }, 400);
    }

    // Store the body in context for next middleware/controller
    c.set('requestBody', body);
    
    console.log('✅ CAPTCHA verification passed, proceeding...');
    await next();
    
  } catch (error) {
    console.error('💥 CAPTCHA middleware error:', error);
    return c.json({ 
      success: false, 
      message: `Error processing CAPTCHA: ${error instanceof Error ? error.message : String(error)}`,
      code: "CAPTCHA_ERROR"
    }, 500);
  }
};
```

### Usage in Routes

```typescript
// src/routes/auth-route.ts
import { captchaMiddleware } from '../middleware/captcha-middleware';

// Apply CAPTCHA verification to sensitive endpoints
authRoute.use("/login/*", captchaMiddleware);
authRoute.use("/register/*", captchaMiddleware);
```

## Frontend Integration

### React Component Implementation

```typescript
// Frontend: CAPTCHA component
import ReCAPTCHA from 'react-google-recaptcha';

interface CaptchaProps {
  onVerify: (token: string | null) => void;
  onExpired?: () => void;
  onError?: () => void;
}

export const CaptchaComponent: React.FC<CaptchaProps> = ({
  onVerify,
  onExpired,
  onError
}) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleCaptchaChange = (token: string | null) => {
    console.log('🎯 CAPTCHA token received:', token ? 'Valid' : 'Null');
    onVerify(token);
  };

  const handleExpired = () => {
    console.warn('⏰ CAPTCHA token expired');
    onExpired?.();
  };

  const handleError = () => {
    console.error('❌ CAPTCHA error occurred');
    onError?.();
  };

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      onChange={handleCaptchaChange}
      onExpired={handleExpired}
      onErrored={handleError}
      theme="light"
      size="normal"
    />
  );
};
```

### Form Integration

```typescript
// Frontend: Login form with CAPTCHA
const LoginForm: React.FC = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast.error('Silakan verifikasi CAPTCHA terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          captchaToken
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Login berhasil!');
        // Handle successful login
      } else {
        toast.error(data.message);
        // Reset CAPTCHA on failure
        setCaptchaToken(null);
      }
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email and password fields */}
      
      <CaptchaComponent
        onVerify={setCaptchaToken}
        onExpired={() => setCaptchaToken(null)}
        onError={() => setCaptchaToken(null)}
      />
      
      <button 
        type="submit" 
        disabled={!captchaToken || isSubmitting}
      >
        {isSubmitting ? 'Memproses...' : 'Login'}
      </button>
    </form>
  );
};
```

## Configuration

### Environment Variables

```bash
# Backend (.env)
RECAPTCHA_SECRET_KEY=your_secret_key_here

# Frontend (.env.local)
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

### CAPTCHA Settings

```typescript
interface CaptchaConfig {
  siteKey: string;
  secretKey: string;
  theme: 'light' | 'dark';
  size: 'compact' | 'normal';
  type: 'image' | 'audio';
  timeout: number; // Token expiration time
}

const captchaConfig: CaptchaConfig = {
  siteKey: process.env.VITE_RECAPTCHA_SITE_KEY!,
  secretKey: process.env.RECAPTCHA_SECRET_KEY!,
  theme: 'light',
  size: 'normal',
  type: 'image',
  timeout: 120000 // 2 minutes
};
```

## Error Handling

### Server-side Error Responses

```typescript
// CAPTCHA-specific error codes
const CAPTCHA_ERRORS = {
  CAPTCHA_REQUIRED: {
    code: 'CAPTCHA_REQUIRED',
    message: 'Token CAPTCHA diperlukan',
    status: 400
  },
  CAPTCHA_INVALID: {
    code: 'CAPTCHA_INVALID',
    message: 'Verifikasi CAPTCHA gagal. Silakan coba lagi.',
    status: 400
  },
  CAPTCHA_EXPIRED: {
    code: 'CAPTCHA_EXPIRED',
    message: 'Token CAPTCHA telah kedaluwarsa',
    status: 400
  },
  CAPTCHA_ERROR: {
    code: 'CAPTCHA_ERROR',
    message: 'Terjadi kesalahan pada verifikasi CAPTCHA',
    status: 500
  }
};
```

### Client-side Error Handling

```typescript
const handleCaptchaError = (errorCode: string) => {
  switch (errorCode) {
    case 'CAPTCHA_REQUIRED':
      toast.error('Silakan verifikasi CAPTCHA terlebih dahulu');
      break;
    case 'CAPTCHA_INVALID':
      toast.error('Verifikasi CAPTCHA gagal. Silakan coba lagi.');
      // Reset CAPTCHA
      recaptchaRef.current?.reset();
      break;
    case 'CAPTCHA_EXPIRED':
      toast.error('CAPTCHA telah kedaluwarsa. Silakan verifikasi ulang.');
      // Reset CAPTCHA
      recaptchaRef.current?.reset();
      break;
    default:
      toast.error('Terjadi kesalahan pada verifikasi CAPTCHA');
  }
};
```

## Monitoring & Analytics

### CAPTCHA Statistics

```typescript
interface CaptchaStats {
  totalVerifications: number;
  successfulVerifications: number;
  failedVerifications: number;
  errorRate: number;
  averageVerificationTime: number;
}

export const getCaptchaStats = (): CaptchaStats => {
  // Implementation for tracking CAPTCHA statistics
  return {
    totalVerifications: captchaMetrics.total,
    successfulVerifications: captchaMetrics.success,
    failedVerifications: captchaMetrics.failed,
    errorRate: (captchaMetrics.failed / captchaMetrics.total) * 100,
    averageVerificationTime: captchaMetrics.avgTime
  };
};
```

### Performance Monitoring

```typescript
// Track CAPTCHA performance
const trackCaptchaVerification = (startTime: number, success: boolean) => {
  const duration = Date.now() - startTime;
  
  console.log(`📊 CAPTCHA verification completed in ${duration}ms - ${success ? 'SUCCESS' : 'FAILED'}`);
  
  // Update metrics
  captchaMetrics.total++;
  if (success) {
    captchaMetrics.success++;
  } else {
    captchaMetrics.failed++;
  }
  captchaMetrics.avgTime = (captchaMetrics.avgTime + duration) / 2;
};
```

## Security Benefits

### Bot Protection
- **Automated Attack Prevention**: Blocks bot-driven attacks
- **Brute Force Mitigation**: Combines with rate limiting for enhanced protection
- **Spam Prevention**: Prevents automated form submissions
- **Credential Stuffing Protection**: Stops automated login attempts

### User Experience
- **Non-intrusive**: Modern reCAPTCHA requires minimal user interaction
- **Accessibility**: Supports audio challenges for visually impaired users
- **Mobile Optimized**: Works seamlessly on mobile devices
- **Quick Verification**: Most users complete verification in seconds

## Testing

### Unit Tests

```typescript
describe('CAPTCHA Verification', () => {
  it('should accept valid CAPTCHA tokens', async () => {
    const mockToken = 'valid_captcha_token';
    const result = await verifyCaptcha(mockToken);
    expect(result).toBe(true);
  });
  
  it('should reject invalid CAPTCHA tokens', async () => {
    const mockToken = 'invalid_captcha_token';
    const result = await verifyCaptcha(mockToken);
    expect(result).toBe(false);
  });
  
  it('should handle missing CAPTCHA tokens', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('CAPTCHA_REQUIRED');
  });
});
```

### Integration Tests

```typescript
describe('CAPTCHA Integration', () => {
  it('should complete full login flow with CAPTCHA', async () => {
    const captchaToken = await getCaptchaToken(); // Mock function
    
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password',
        captchaToken
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

## Best Practices

### Implementation Guidelines
- **Selective Application**: Apply only to sensitive endpoints
- **Graceful Degradation**: Handle service outages gracefully
- **Clear Instructions**: Provide clear user guidance
- **Accessibility**: Ensure audio alternatives are available

### Performance Optimization
- **Lazy Loading**: Load reCAPTCHA script only when needed
- **Caching**: Cache verification results for short periods
- **Async Processing**: Non-blocking verification process
- **Error Recovery**: Automatic retry mechanisms

### Security Considerations
- **Secret Key Protection**: Never expose secret keys in frontend
- **Token Validation**: Always verify tokens server-side
- **Replay Protection**: Ensure tokens are used only once
- **Timeout Handling**: Implement appropriate token expiration

---

**Layer 2 Status**: ✅ **Active** - Protecting authentication endpoints  
**Previous Layer**: [Layer 1 - Rate Limiting](./LAYER_1_RATE_LIMITING.md)  
**Next Layer**: [Layer 3 - Session Security](./LAYER_3_SESSION_SECURITY.md)
