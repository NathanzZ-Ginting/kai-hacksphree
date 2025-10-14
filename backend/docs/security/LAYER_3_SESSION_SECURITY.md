# 🛡️ PENTA Security Layer 3: Session Security

## Overview

The third layer of our PENTA Security Framework implements robust session management with JWT (JSON Web Tokens) authentication. This layer ensures secure user sessions, proper authentication state management, and protection against session-based attacks.

## Features

### 🔐 **JWT Authentication**
- **Stateless Sessions**: JWT-based authentication for scalability
- **Secure Token Generation**: Strong cryptographic signing
- **Automatic Expiration**: Configurable token lifetimes
- **Refresh Token Support**: Seamless token renewal

### 🛡️ **Session Protection**
- **Secure Headers**: HTTP-only, Secure, SameSite cookies
- **CSRF Integration**: Works seamlessly with Layer 4
- **Session Validation**: Comprehensive token verification
- **Automatic Cleanup**: Expired session handling

## Implementation

### JWT Configuration

```typescript
// src/config/jwt.config.ts
export const jwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
  accessTokenExpiry: '15m',  // 15 minutes
  refreshTokenExpiry: '7d',  // 7 days
  issuer: 'kai-hacksphree',
  audience: 'kai-users'
};

// Token payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
  sessionId: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}
```

### Session Middleware

```typescript
// src/middleware/session-middleware.ts
import { MiddlewareHandler } from 'hono';
import { sign, verify } from 'hono/jwt';
import { jwtConfig, JWTPayload } from '../config/jwt.config';

export const sessionAuth: MiddlewareHandler = async (c, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('❌ No valid authorization header found');
      return c.json({
        success: false,
        message: 'Token akses diperlukan',
        code: 'NO_TOKEN'
      }, 401);
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    
    console.log('🔍 Validating session token...');
    
    // Verify JWT token
    const payload = await verify(token, jwtConfig.accessTokenSecret) as JWTPayload;
    
    if (!payload) {
      console.warn('❌ Invalid token payload');
      return c.json({
        success: false,
        message: 'Token tidak valid',
        code: 'INVALID_TOKEN'
      }, 401);
    }

    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      console.warn('⏰ Token has expired');
      return c.json({
        success: false,
        message: 'Token telah kedaluwarsa',
        code: 'TOKEN_EXPIRED'
      }, 401);
    }

    // Validate issuer and audience
    if (payload.iss !== jwtConfig.issuer || payload.aud !== jwtConfig.audience) {
      console.warn('❌ Invalid token issuer or audience');
      return c.json({
        success: false,
        message: 'Token tidak valid',
        code: 'INVALID_TOKEN'
      }, 401);
    }

    // Store user info in context for next middleware/controller
    c.set('user', {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId
    });

    console.log(`✅ Session validated for user: ${payload.email}`);
    await next();

  } catch (error) {
    console.error('💥 Session validation error:', error);
    
    if (error instanceof Error && error.message.includes('JWT')) {
      return c.json({
        success: false,
        message: 'Token tidak valid',
        code: 'INVALID_TOKEN'
      }, 401);
    }

    return c.json({
      success: false,
      message: 'Kesalahan validasi sesi',
      code: 'SESSION_ERROR'
    }, 500);
  }
};
```

### Token Generation Service

```typescript
// src/services/token.service.ts
import { sign } from 'hono/jwt';
import { jwtConfig } from '../config/jwt.config';
import { randomUUID } from 'crypto';

export class TokenService {
  
  static async generateAccessToken(user: {
    id: string;
    email: string;
    role?: string;
  }): Promise<string> {
    const sessionId = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role || 'user',
      sessionId,
      iat: now,
      exp: now + (15 * 60), // 15 minutes
      iss: jwtConfig.issuer,
      aud: jwtConfig.audience
    };

    console.log(`🎫 Generating access token for user: ${user.email}`);
    return await sign(payload, jwtConfig.accessTokenSecret);
  }

  static async generateRefreshToken(user: {
    id: string;
    email: string;
  }): Promise<string> {
    const sessionId = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    const payload = {
      userId: user.id,
      email: user.email,
      sessionId,
      type: 'refresh',
      iat: now,
      exp: now + (7 * 24 * 60 * 60), // 7 days
      iss: jwtConfig.issuer,
      aud: jwtConfig.audience
    };

    console.log(`🔄 Generating refresh token for user: ${user.email}`);
    return await sign(payload, jwtConfig.refreshTokenSecret);
  }

  static async validateRefreshToken(token: string): Promise<JWTPayload | null> {
    try {
      const payload = await verify(token, jwtConfig.refreshTokenSecret) as JWTPayload;
      
      // Check if it's a refresh token
      if (payload.type !== 'refresh') {
        console.warn('❌ Token is not a refresh token');
        return null;
      }

      return payload;
    } catch (error) {
      console.error('💥 Refresh token validation error:', error);
      return null;
    }
  }

  static async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      const payload = await this.validateRefreshToken(refreshToken);
      
      if (!payload) {
        return null;
      }

      // Generate new tokens
      const newAccessToken = await this.generateAccessToken({
        id: payload.userId,
        email: payload.email,
        role: payload.role
      });

      const newRefreshToken = await this.generateRefreshToken({
        id: payload.userId,
        email: payload.email
      });

      console.log(`🔄 Tokens refreshed for user: ${payload.email}`);
      
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };

    } catch (error) {
      console.error('💥 Token refresh error:', error);
      return null;
    }
  }
}
```

### Session Controller

```typescript
// src/controllers/session.controller.ts
import { Context } from 'hono';
import { TokenService } from '../services/token.service';

export class SessionController {
  
  static async validateSession(c: Context) {
    try {
      const user = c.get('user');
      
      if (!user) {
        return c.json({
          success: false,
          message: 'Sesi tidak valid'
        }, 401);
      }

      console.log(`✅ Session valid for user: ${user.email}`);
      
      return c.json({
        success: true,
        message: 'Sesi valid',
        data: {
          userId: user.userId,
          email: user.email,
          role: user.role,
          sessionId: user.sessionId
        }
      });

    } catch (error) {
      console.error('💥 Session validation error:', error);
      return c.json({
        success: false,
        message: 'Kesalahan validasi sesi'
      }, 500);
    }
  }

  static async refreshToken(c: Context) {
    try {
      const body = await c.req.json();
      const { refreshToken } = body;

      if (!refreshToken) {
        return c.json({
          success: false,
          message: 'Refresh token diperlukan'
        }, 400);
      }

      const tokens = await TokenService.refreshAccessToken(refreshToken);

      if (!tokens) {
        return c.json({
          success: false,
          message: 'Refresh token tidak valid atau telah kedaluwarsa'
        }, 401);
      }

      return c.json({
        success: true,
        message: 'Token berhasil diperbaharui',
        data: tokens
      });

    } catch (error) {
      console.error('💥 Token refresh error:', error);
      return c.json({
        success: false,
        message: 'Kesalahan memperbaharui token'
      }, 500);
    }
  }

  static async logout(c: Context) {
    try {
      const user = c.get('user');
      
      if (user) {
        console.log(`👋 User logged out: ${user.email}`);
        // Here you could implement token blacklisting if needed
      }

      return c.json({
        success: true,
        message: 'Berhasil logout'
      });

    } catch (error) {
      console.error('💥 Logout error:', error);
      return c.json({
        success: false,
        message: 'Kesalahan saat logout'
      }, 500);
    }
  }
}
```

## Usage in Routes

```typescript
// src/routes/auth-route.ts
import { sessionAuth } from '../middleware/session-middleware';
import { SessionController } from '../controllers/session.controller';

// Session management routes
authRoute.get('/session/validate', sessionAuth, SessionController.validateSession);
authRoute.post('/session/refresh', SessionController.refreshToken);
authRoute.post('/session/logout', sessionAuth, SessionController.logout);

// Protected routes requiring session
authRoute.use('/protected/*', sessionAuth);
```

## Frontend Integration

### Token Storage

```typescript
// Frontend: Token management
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'kai_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'kai_refresh_token';

  static setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  }
}
```

### Automatic Token Refresh

```typescript
// Frontend: HTTP interceptor with auto-refresh
class ApiClient {
  private static async refreshTokens(): Promise<boolean> {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch('/api/v1/auth/session/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        TokenManager.setTokens(data.data.accessToken, data.data.refreshToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  static async request(url: string, options: RequestInit = {}): Promise<Response> {
    let accessToken = TokenManager.getAccessToken();

    // Check if token needs refresh
    if (accessToken && TokenManager.isTokenExpired(accessToken)) {
      const refreshed = await this.refreshTokens();
      
      if (!refreshed) {
        // Redirect to login
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      
      accessToken = TokenManager.getAccessToken();
    }

    // Add authorization header
    const headers = {
      ...options.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` })
    };

    const response = await fetch(url, { ...options, headers });

    // Handle 401 responses
    if (response.status === 401) {
      const refreshed = await this.refreshTokens();
      
      if (refreshed) {
        // Retry request with new token
        const newToken = TokenManager.getAccessToken();
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`
          }
        });
      } else {
        // Redirect to login
        TokenManager.clearTokens();
        window.location.href = '/login';
      }
    }

    return response;
  }
}
```

## Security Features

### Token Security

```typescript
// Environment configuration
const tokenSecurity = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET, // Strong secret
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET, // Different secret
  algorithm: 'HS256', // HMAC SHA-256
  issuer: 'kai-hacksphree',
  audience: 'kai-users'
};
```

### Session Validation

```typescript
// Comprehensive session validation
const validateSession = (payload: JWTPayload): boolean => {
  const now = Math.floor(Date.now() / 1000);
  
  // Check expiration
  if (payload.exp < now) {
    return false;
  }
  
  // Check issuer
  if (payload.iss !== jwtConfig.issuer) {
    return false;
  }
  
  // Check audience
  if (payload.aud !== jwtConfig.audience) {
    return false;
  }
  
  // Check required fields
  if (!payload.userId || !payload.email || !payload.sessionId) {
    return false;
  }
  
  return true;
};
```

## Monitoring & Analytics

### Session Metrics

```typescript
interface SessionMetrics {
  activeSessions: number;
  totalLogins: number;
  tokenRefreshes: number;
  sessionDuration: number;
  failedValidations: number;
}

export const getSessionMetrics = (): SessionMetrics => {
  return {
    activeSessions: sessionStore.size,
    totalLogins: metrics.totalLogins,
    tokenRefreshes: metrics.refreshCount,
    sessionDuration: metrics.avgSessionDuration,
    failedValidations: metrics.failedValidations
  };
};
```

### Session Tracking

```typescript
// Track session events
const trackSessionEvent = (event: string, userId: string, details?: any) => {
  console.log(`📊 Session event: ${event} for user ${userId}`, details);
  
  // Update metrics
  switch (event) {
    case 'login':
      metrics.totalLogins++;
      break;
    case 'refresh':
      metrics.refreshCount++;
      break;
    case 'validation_failed':
      metrics.failedValidations++;
      break;
  }
};
```

## Best Practices

### Security Guidelines
- **Strong Secrets**: Use cryptographically strong JWT secrets
- **Short Expiry**: Keep access tokens short-lived (15 minutes)
- **Refresh Rotation**: Rotate refresh tokens on each use
- **Secure Storage**: Store refresh tokens securely

### Performance Optimization
- **Stateless Design**: JWT enables horizontal scaling
- **Efficient Validation**: Fast token verification
- **Automatic Cleanup**: Remove expired sessions
- **Connection Pooling**: Optimize database connections

### Error Handling
- **Clear Messages**: Provide helpful error messages
- **Graceful Degradation**: Handle service outages
- **Automatic Recovery**: Implement retry mechanisms
- **User Experience**: Smooth authentication flows

---

**Layer 3 Status**: ✅ **Active** - Securing user sessions  
**Previous Layer**: [Layer 2 - CAPTCHA Verification](./LAYER_2_CAPTCHA_VERIFICATION.md)  
**Next Layer**: [Layer 4 - CSRF Protection](./LAYER_4_CSRF_PROTECTION.md)
