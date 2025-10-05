# 🔐 Layer 3 Session Security - Usage Guide

## Quick Start

### Basic Implementation

```typescript
// Import session middleware
import { sessionAuth } from '../middleware/session-middleware';

// Apply to protected routes
authRoute.use("/protected/*", sessionAuth);
authRoute.use("/user/*", sessionAuth);
```

## Token Generation

### Login Implementation

```typescript
// src/controllers/login-controller.ts
import { TokenService } from '../services/token.service';

export const login = async (c: Context) => {
  try {
    // After successful authentication
    const user = await authenticateUser(email, password);
    
    if (!user) {
      return c.json({
        success: false,
        message: 'Invalid credentials'
      }, 401);
    }

    // Generate tokens
    const accessToken = await TokenService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = await TokenService.generateRefreshToken({
      id: user.id,
      email: user.email
    });

    return c.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    return c.json({
      success: false,
      message: 'Login error'
    }, 500);
  }
};
```

## Protected Routes

### Apply Session Protection

```typescript
// src/routes/auth-route.ts
import { sessionAuth } from '../middleware/session-middleware';

const authRoute = new Hono();

// Public routes (no session required)
authRoute.route("/login", LoginController);
authRoute.route("/register", RegisterController);

// Protected routes (session required)
authRoute.use("/user/*", sessionAuth);
authRoute.use("/profile/*", sessionAuth);
authRoute.use("/orders/*", sessionAuth);

// Routes with session protection
authRoute.route("/user", UserController);
authRoute.route("/profile", ProfileController);
authRoute.route("/orders", OrderController);
```

### Access User Data in Controllers

```typescript
// src/controllers/user-controller.ts
export const getProfile = async (c: Context) => {
  try {
    // Get user from session context
    const user = c.get('user');
    
    if (!user) {
      return c.json({
        success: false,
        message: 'Unauthorized'
      }, 401);
    }

    // Use user data
    const profile = await getUserProfile(user.userId);

    return c.json({
      success: true,
      data: {
        userId: user.userId,
        email: user.email,
        profile
      }
    });

  } catch (error) {
    return c.json({
      success: false,
      message: 'Error retrieving profile'
    }, 500);
  }
};
```

## Frontend Integration

### Token Storage

```typescript
// utils/TokenManager.ts
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

### API Client with Auto-Refresh

```typescript
// utils/ApiClient.ts
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

## Session Management Routes

### Session Validation

```typescript
// src/routes/session-route.ts
import { SessionController } from '../controllers/session.controller';

const sessionRoute = new Hono();

// Session management endpoints
sessionRoute.get('/validate', sessionAuth, SessionController.validateSession);
sessionRoute.post('/refresh', SessionController.refreshToken);
sessionRoute.post('/logout', sessionAuth, SessionController.logout);

export default sessionRoute;
```

### Session Controllers

```typescript
// src/controllers/session.controller.ts
export class SessionController {
  
  static async validateSession(c: Context) {
    try {
      const user = c.get('user');
      
      return c.json({
        success: true,
        message: 'Session valid',
        data: {
          userId: user.userId,
          email: user.email,
          role: user.role,
          sessionId: user.sessionId
        }
      });

    } catch (error) {
      return c.json({
        success: false,
        message: 'Session validation error'
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
          message: 'Refresh token required'
        }, 400);
      }

      const tokens = await TokenService.refreshAccessToken(refreshToken);

      if (!tokens) {
        return c.json({
          success: false,
          message: 'Invalid or expired refresh token'
        }, 401);
      }

      return c.json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: tokens
      });

    } catch (error) {
      return c.json({
        success: false,
        message: 'Token refresh error'
      }, 500);
    }
  }

  static async logout(c: Context) {
    try {
      const user = c.get('user');
      
      if (user) {
        console.log(`User logged out: ${user.email}`);
        // Implement token blacklisting if needed
      }

      return c.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      return c.json({
        success: false,
        message: 'Logout error'
      }, 500);
    }
  }
}
```

## Environment Configuration

```bash
# .env
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
JWT_ISSUER=kai-hacksphree
JWT_AUDIENCE=kai-users
```

---

**Related**: [Layer 3 Overview](../LAYER_3_SESSION_SECURITY.md) | [Layer 3 Testing](../testing/LAYER_3_TESTING.md)
