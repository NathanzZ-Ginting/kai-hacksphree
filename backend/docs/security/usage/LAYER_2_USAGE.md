# 🤖 Layer 2 CAPTCHA Verification - Usage Guide

## Quick Start

### Basic Implementation

```typescript
// Import CAPTCHA middleware
import { captchaMiddleware } from '../middleware/captcha-middleware';

// Apply to sensitive routes
authRoute.use("/login/*", captchaMiddleware);
authRoute.use("/register/*", captchaMiddleware);
```

## Environment Configuration

### Backend Setup

```bash
# .env
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### Frontend Setup

```bash
# .env.local
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

## Frontend Integration

### React Component

```typescript
// components/CaptchaComponent.tsx
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
    onVerify(token);
  };

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      onChange={handleCaptchaChange}
      onExpired={onExpired}
      onErrored={onError}
      theme="light"
      size="normal"
    />
  );
};
```

### Form Integration

```typescript
// Login form with CAPTCHA
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

## Backend Middleware Usage

### Apply to Routes

```typescript
// src/routes/auth-route.ts
import { captchaMiddleware } from '../middleware/captcha-middleware';

const authRoute = new Hono();

// Apply CAPTCHA to authentication endpoints
authRoute.use("/login/*", captchaMiddleware);
authRoute.use("/register/*", captchaMiddleware);

// Routes with CAPTCHA protection
authRoute.route("/login", LoginController);
authRoute.route("/register", RegisterController);
```

### Controller Implementation

```typescript
// src/controllers/login-controller.ts
export const login = async (c: Context) => {
  try {
    // Get body from CAPTCHA middleware context
    const body = c.get('requestBody') || await c.req.json();
    
    const { email, password } = body;
    // captchaToken already verified by middleware
    
    // Proceed with login logic
    const user = await authenticateUser(email, password);
    
    if (!user) {
      return c.json({
        success: false,
        message: 'Invalid credentials'
      }, 401);
    }

    return c.json({
      success: true,
      message: 'Login successful',
      data: { userId: user.id, email: user.email }
    });

  } catch (error) {
    return c.json({
      success: false,
      message: 'Login error'
    }, 500);
  }
};
```

## Error Handling

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
  }
};
```

## Monitoring

### CAPTCHA Statistics

```typescript
// Get CAPTCHA statistics
export const getCaptchaStats = async (c: Context) => {
  try {
    const stats = {
      totalVerifications: captchaMetrics.total,
      successfulVerifications: captchaMetrics.success,
      failedVerifications: captchaMetrics.failed,
      errorRate: (captchaMetrics.failed / captchaMetrics.total) * 100,
      averageVerificationTime: captchaMetrics.avgTime
    };

    return c.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Error retrieving CAPTCHA statistics'
    }, 500);
  }
};
```

---

**Related**: [Layer 2 Overview](../LAYER_2_CAPTCHA_VERIFICATION.md) | [Layer 2 Testing](../testing/LAYER_2_TESTING.md)
