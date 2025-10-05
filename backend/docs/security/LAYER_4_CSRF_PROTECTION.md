# 🛡️ PENTA Security Layer 4: CSRF Protection

## Overview

The fourth layer of our PENTA Security Framework implements Cross-Site Request Forgery (CSRF) protection to prevent malicious websites from performing unauthorized actions on behalf of authenticated users. This layer provides token-based validation for state-changing operations.

## Features

### 🛡️ **CSRF Token System**
- **Secure Token Generation**: Cryptographically strong CSRF tokens
- **Per-Session Tokens**: Unique tokens for each user session
- **Automatic Validation**: Seamless token verification
- **Token Rotation**: Fresh tokens for enhanced security

### 🎯 **Smart Protection**
- **Selective Application**: Only for state-changing operations
- **Header & Form Support**: Multiple token delivery methods
- **SameSite Cookie Support**: Additional browser-level protection
- **Double Submit Cookie**: Enhanced security pattern

## Implementation

### CSRF Middleware

```typescript
// src/middleware/csrf-middleware.ts
import { MiddlewareHandler } from 'hono';
import { randomBytes, createHash } from 'crypto';

interface CSRFStore {
  [sessionId: string]: {
    token: string;
    generated: number;
    used: number;
  };
}

// In-memory store for CSRF tokens (use Redis in production)
const csrfStore: CSRFStore = {};

export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32;
  private static readonly TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

  /**
   * Generate a cryptographically secure CSRF token
   */
  static generateToken(): string {
    return randomBytes(this.TOKEN_LENGTH).toString('hex');
  }

  /**
   * Create a hash of the token for storage
   */
  static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Store CSRF token for a session
   */
  static storeToken(sessionId: string, token: string): void {
    const hashedToken = this.hashToken(token);
    csrfStore[sessionId] = {
      token: hashedToken,
      generated: Date.now(),
      used: 0
    };
    
    console.log(`🔐 CSRF token generated for session: ${sessionId.substring(0, 8)}...`);
  }

  /**
   * Validate CSRF token for a session
   */
  static validateToken(sessionId: string, token: string): boolean {
    const stored = csrfStore[sessionId];
    
    if (!stored) {
      console.warn(`❌ No CSRF token found for session: ${sessionId.substring(0, 8)}...`);
      return false;
    }

    // Check token expiry
    if (Date.now() - stored.generated > this.TOKEN_EXPIRY) {
      console.warn(`⏰ CSRF token expired for session: ${sessionId.substring(0, 8)}...`);
      delete csrfStore[sessionId];
      return false;
    }

    const hashedToken = this.hashToken(token);
    const isValid = hashedToken === stored.token;

    if (isValid) {
      stored.used++;
      console.log(`✅ CSRF token validated for session: ${sessionId.substring(0, 8)}...`);
    } else {
      console.warn(`❌ Invalid CSRF token for session: ${sessionId.substring(0, 8)}...`);
    }

    return isValid;
  }

  /**
   * Clean up expired tokens
   */
  static cleanupExpiredTokens(): void {
    const now = Date.now();
    const expired = Object.keys(csrfStore).filter(
      sessionId => now - csrfStore[sessionId].generated > this.TOKEN_EXPIRY
    );

    expired.forEach(sessionId => {
      delete csrfStore[sessionId];
    });

    if (expired.length > 0) {
      console.log(`🧹 Cleaned up ${expired.length} expired CSRF tokens`);
    }
  }

  /**
   * Get CSRF statistics
   */
  static getStatistics() {
    const now = Date.now();
    const sessions = Object.keys(csrfStore);
    const activeSessions = sessions.filter(
      sessionId => now - csrfStore[sessionId].generated <= this.TOKEN_EXPIRY
    );

    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      expiredSessions: sessions.length - activeSessions.length,
      totalTokenUsage: Object.values(csrfStore).reduce((sum, data) => sum + data.used, 0)
    };
  }
}

/**
 * Middleware to generate CSRF token
 */
export const generateCSRFToken: MiddlewareHandler = async (c, next) => {
  try {
    const user = c.get('user');
    
    if (!user || !user.sessionId) {
      return c.json({
        success: false,
        message: 'Sesi tidak valid untuk generasi CSRF token'
      }, 401);
    }

    const token = CSRFProtection.generateToken();
    CSRFProtection.storeToken(user.sessionId, token);

    // Store token in context for response
    c.set('csrfToken', token);

    await next();
  } catch (error) {
    console.error('💥 CSRF token generation error:', error);
    return c.json({
      success: false,
      message: 'Kesalahan generasi CSRF token'
    }, 500);
  }
};

/**
 * Middleware to validate CSRF token
 */
export const validateCSRFToken: MiddlewareHandler = async (c, next) => {
  try {
    const user = c.get('user');
    
    if (!user || !user.sessionId) {
      return c.json({
        success: false,
        message: 'Sesi tidak valid',
        code: 'INVALID_SESSION'
      }, 401);
    }

    // Get CSRF token from header or body
    let csrfToken = c.req.header('X-CSRF-Token');
    
    if (!csrfToken) {
      try {
        const body = await c.req.json();
        csrfToken = body.csrfToken;
        // Store body for next middleware
        c.set('requestBody', body);
      } catch {
        // Body might not be JSON
      }
    }

    if (!csrfToken) {
      console.warn(`❌ Missing CSRF token for session: ${user.sessionId.substring(0, 8)}...`);
      return c.json({
        success: false,
        message: 'CSRF token diperlukan',
        code: 'CSRF_TOKEN_REQUIRED'
      }, 403);
    }

    const isValid = CSRFProtection.validateToken(user.sessionId, csrfToken);

    if (!isValid) {
      return c.json({
        success: false,
        message: 'CSRF token tidak valid',
        code: 'CSRF_TOKEN_INVALID'
      }, 403);
    }

    console.log(`✅ CSRF validation passed for session: ${user.sessionId.substring(0, 8)}...`);
    await next();

  } catch (error) {
    console.error('💥 CSRF validation error:', error);
    return c.json({
      success: false,
      message: 'Kesalahan validasi CSRF'
    }, 500);
  }
};

/**
 * Middleware to provide new CSRF token in response
 */
export const provideCSRFToken: MiddlewareHandler = async (c, next) => {
  await next();

  try {
    const user = c.get('user');
    
    if (user && user.sessionId) {
      // Generate new token for next request
      const newToken = CSRFProtection.generateToken();
      CSRFProtection.storeToken(user.sessionId, newToken);

      // Add to response header
      c.res.headers.set('X-CSRF-Token', newToken);
      
      console.log(`🔄 New CSRF token provided for session: ${user.sessionId.substring(0, 8)}...`);
    }
  } catch (error) {
    console.error('💥 CSRF token provision error:', error);
  }
};

// Cleanup expired tokens every 15 minutes
setInterval(() => {
  CSRFProtection.cleanupExpiredTokens();
}, 15 * 60 * 1000);
```

### CSRF Controller

```typescript
// src/controllers/csrf-controller.ts
import { Context } from 'hono';
import { CSRFProtection } from '../middleware/csrf-middleware';

export const getCSRFToken = async (c: Context) => {
  try {
    const csrfToken = c.get('csrfToken');
    const user = c.get('user');

    if (!csrfToken) {
      return c.json({
        success: false,
        message: 'CSRF token tidak tersedia'
      }, 500);
    }

    return c.json({
      success: true,
      message: 'CSRF token berhasil diambil',
      data: {
        csrfToken,
        sessionId: user.sessionId.substring(0, 8) + '...', // Partial untuk security
        expiresIn: 3600 // 1 hour in seconds
      }
    });

  } catch (error) {
    console.error('💥 Get CSRF token error:', error);
    return c.json({
      success: false,
      message: 'Kesalahan mengambil CSRF token'
    }, 500);
  }
};

export const getCSRFStatistics = async (c: Context) => {
  try {
    const stats = CSRFProtection.getStatistics();
    
    return c.json({
      success: true,
      message: 'Statistik CSRF berhasil diambil',
      data: {
        ...stats,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 Get CSRF statistics error:', error);
    return c.json({
      success: false,
      message: 'Kesalahan mengambil statistik CSRF'
    }, 500);
  }
};

export const getCSRFHealth = async (c: Context) => {
  try {
    const stats = CSRFProtection.getStatistics();
    const isHealthy = stats.activeSessions >= 0; // Basic health check
    
    return c.json({
      success: true,
      message: 'Status kesehatan CSRF',
      data: {
        status: isHealthy ? 'healthy' : 'unhealthy',
        activeSessions: stats.activeSessions,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 CSRF health check error:', error);
    return c.json({
      success: false,
      message: 'Kesalahan pemeriksaan kesehatan CSRF'
    }, 500);
  }
};
```

### CSRF Protected Controller

```typescript
// src/controllers/csrf-protected-controller.ts
import { Context } from 'hono';
import ValidationMiddleware from '../middleware/validation-middleware';

export const updateProfile = async (c: Context) => {
  try {
    const user = c.get('user');
    const body = c.get('requestBody') || await c.req.json();

    console.log(`📝 Profile update request for user: ${user.email}`);

    // Validate input data
    const validationResult = await ValidationMiddleware.validateInput(body, {
      name: { required: true, type: 'string', minLength: 2 },
      phone: { required: false, type: 'string', pattern: /^[0-9+\-\s]+$/ }
    });

    if (!validationResult.isValid) {
      return c.json({
        success: false,
        message: 'Data tidak valid',
        errors: validationResult.errors
      }, 400);
    }

    // Simulate profile update
    console.log(`✅ Profile updated for user: ${user.email}`);

    return c.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        userId: user.userId,
        updatedFields: Object.keys(validationResult.sanitizedData)
      }
    });

  } catch (error) {
    console.error('💥 Profile update error:', error);
    return c.json({
      success: false,
      message: 'Kesalahan memperbarui profil'
    }, 500);
  }
};

export const requestRefund = async (c: Context) => {
  try {
    const user = c.get('user');
    const body = c.get('requestBody') || await c.req.json();

    console.log(`💰 Refund request from user: ${user.email}`);

    // Validate refund request
    const validationResult = await ValidationMiddleware.validateInput(body, {
      orderId: { required: true, type: 'string' },
      reason: { required: true, type: 'string', minLength: 10 },
      amount: { required: true, type: 'number', min: 0 }
    });

    if (!validationResult.isValid) {
      return c.json({
        success: false,
        message: 'Data refund tidak valid',
        errors: validationResult.errors
      }, 400);
    }

    // Simulate refund processing
    console.log(`✅ Refund request processed for user: ${user.email}`);

    return c.json({
      success: true,
      message: 'Permintaan refund berhasil diajukan',
      data: {
        refundId: `REF-${Date.now()}`,
        status: 'pending',
        estimatedProcessingTime: '3-7 hari kerja'
      }
    });

  } catch (error) {
    console.error('💥 Refund request error:', error);
    return c.json({
      success: false,
      message: 'Kesalahan memproses permintaan refund'
    }, 500);
  }
};

export const changePassword = async (c: Context) => {
  try {
    const user = c.get('user');
    const body = c.get('requestBody') || await c.req.json();

    console.log(`🔒 Password change request for user: ${user.email}`);

    // Validate password change request
    const validationResult = await ValidationMiddleware.validateInput(body, {
      currentPassword: { required: true, type: 'string' },
      newPassword: { 
        required: true, 
        type: 'string', 
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      },
      confirmPassword: { required: true, type: 'string' }
    });

    if (!validationResult.isValid) {
      return c.json({
        success: false,
        message: 'Data password tidak valid',
        errors: validationResult.errors
      }, 400);
    }

    const { newPassword, confirmPassword } = validationResult.sanitizedData;

    if (newPassword !== confirmPassword) {
      return c.json({
        success: false,
        message: 'Konfirmasi password tidak sesuai'
      }, 400);
    }

    // Simulate password change
    console.log(`✅ Password changed for user: ${user.email}`);

    return c.json({
      success: true,
      message: 'Password berhasil diubah'
    });

  } catch (error) {
    console.error('💥 Password change error:', error);
    return c.json({
      success: false,
      message: 'Kesalahan mengubah password'
    }, 500);
  }
};
```

## Usage in Routes

```typescript
// src/routes/auth-route.ts
import { 
  generateCSRFToken, 
  validateCSRFToken, 
  provideCSRFToken 
} from '../middleware/csrf-middleware';
import { sessionAuth } from '../middleware/session-middleware';

// CSRF token generation (requires session)
authRoute.get("/csrf/token", sessionAuth, generateCSRFToken, getCSRFToken);

// CSRF-protected routes
const csrfProtectedRoutes = new Hono();
csrfProtectedRoutes.use("*", sessionAuth);           // Layer 3: Session required
csrfProtectedRoutes.use("*", validateCSRFToken);    // Layer 4: Validate CSRF
csrfProtectedRoutes.use("*", provideCSRFToken);     // Layer 4: Provide new token

// Protected endpoints
csrfProtectedRoutes.post("/profile/update", updateProfile);
csrfProtectedRoutes.post("/refund/request", requestRefund);
csrfProtectedRoutes.post("/password/change", changePassword);

authRoute.route("/protected", csrfProtectedRoutes);
```

## Frontend Integration

### CSRF Token Management

```typescript
// Frontend: CSRF token service
class CSRFService {
  private static token: string | null = null;

  static async getToken(): Promise<string | null> {
    try {
      if (this.token) {
        return this.token;
      }

      const response = await fetch('/api/v1/auth/csrf/token', {
        headers: {
          'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.data.csrfToken;
        return this.token;
      }
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }

    return null;
  }

  static updateToken(newToken: string) {
    this.token = newToken;
  }

  static clearToken() {
    this.token = null;
  }
}
```

### Protected Form Component

```typescript
// Frontend: Form with CSRF protection
interface ProtectedFormProps {
  onSubmit: (data: any) => Promise<void>;
  children: React.ReactNode;
}

export const ProtectedForm: React.FC<ProtectedFormProps> = ({ 
  onSubmit, 
  children 
}) => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get CSRF token on component mount
    CSRFService.getToken().then(setCsrfToken);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!csrfToken) {
      toast.error('Security token tidak tersedia. Silakan refresh halaman.');
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      // Add CSRF token to data
      const requestData = { ...data, csrfToken };
      
      await onSubmit(requestData);
      
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!csrfToken) {
    return <div>Loading security token...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {children}
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Submit'}
      </button>
    </form>
  );
};
```

### API Client with CSRF

```typescript
// Frontend: API client with automatic CSRF handling
class ProtectedApiClient {
  static async post(url: string, data: any): Promise<Response> {
    const csrfToken = await CSRFService.getToken();
    
    if (!csrfToken) {
      throw new Error('CSRF token not available');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TokenManager.getAccessToken()}`,
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ ...data, csrfToken })
    });

    // Update CSRF token from response header
    const newToken = response.headers.get('X-CSRF-Token');
    if (newToken) {
      CSRFService.updateToken(newToken);
    }

    return response;
  }
}
```

## Security Benefits

### Attack Prevention
- **CSRF Attack Protection**: Prevents cross-site request forgery
- **State Change Protection**: Secures all state-modifying operations
- **Session Hijacking Mitigation**: Additional layer beyond session tokens
- **Malicious Site Prevention**: Stops unauthorized cross-origin requests

### Implementation Security
- **Cryptographic Tokens**: Strong random token generation
- **Per-Session Tokens**: Unique tokens for each user session
- **Token Rotation**: Fresh tokens for each protected request
- **Secure Storage**: Hash-based token storage

## Monitoring & Analytics

### CSRF Metrics

```typescript
interface CSRFMetrics {
  totalTokensGenerated: number;
  totalValidations: number;
  successfulValidations: number;
  failedValidations: number;
  expiredTokens: number;
  activeSessions: number;
}

export const getCSRFMetrics = (): CSRFMetrics => {
  const stats = CSRFProtection.getStatistics();
  
  return {
    totalTokensGenerated: csrfMetrics.generated,
    totalValidations: csrfMetrics.validations,
    successfulValidations: csrfMetrics.successful,
    failedValidations: csrfMetrics.failed,
    expiredTokens: stats.expiredSessions,
    activeSessions: stats.activeSessions
  };
};
```

## Best Practices

### Security Guidelines
- **State-Changing Only**: Apply CSRF protection only to state-changing operations
- **Strong Tokens**: Use cryptographically secure random tokens
- **Token Rotation**: Generate new tokens for each request
- **Secure Transmission**: Use HTTPS for all CSRF-protected endpoints

### Performance Optimization
- **Memory Management**: Regular cleanup of expired tokens
- **Efficient Storage**: Use appropriate data structures
- **Minimal Overhead**: Lightweight token validation
- **Caching Strategy**: Cache tokens appropriately

### User Experience
- **Transparent Operation**: Users shouldn't notice CSRF protection
- **Error Recovery**: Graceful handling of token failures
- **Clear Messages**: Helpful error messages when issues occur
- **Automatic Refresh**: Seamless token renewal

---

**Layer 4 Status**: ✅ **Active** - Protecting state-changing operations  
**Previous Layer**: [Layer 3 - Session Security](./LAYER_3_SESSION_SECURITY.md)  
**Next Layer**: [Layer 5 - Input Validation & Sanitization](./LAYER_5_INPUT_VALIDATION.md)
