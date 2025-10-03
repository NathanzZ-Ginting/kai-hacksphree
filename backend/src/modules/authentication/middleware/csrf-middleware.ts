import { Context, Next, MiddlewareHandler } from 'hono';
import { ErrorsRes } from '../../../common/utils/api-response.js';
import crypto from 'crypto';

// CSRF token storage (in production, use Redis or database)
interface CSRFSession {
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

class CSRFProtection {
  private tokens: Map<string, CSRFSession> = new Map();
  private readonly TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // Auto-cleanup expired tokens every 10 minutes
    setInterval(() => {
      this.cleanupExpiredTokens();
    }, 10 * 60 * 1000);
  }

  /**
   * Generate CSRF token for session
   */
  generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    
    this.tokens.set(sessionId, {
      token,
      createdAt: now,
      expiresAt: new Date(now.getTime() + this.TOKEN_EXPIRY)
    });

    console.log(`🛡️ [CSRF] Generated token for session: ${sessionId.substring(0, 8)}...`);
    return token;
  }

  /**
   * Validate CSRF token
   */
  validateToken(sessionId: string, providedToken: string): boolean {
    const csrfSession = this.tokens.get(sessionId);
    
    if (!csrfSession) {
      console.log(`❌ [CSRF] No token found for session: ${sessionId.substring(0, 8)}...`);
      return false;
    }

    if (new Date() > csrfSession.expiresAt) {
      console.log(`⏰ [CSRF] Token expired for session: ${sessionId.substring(0, 8)}...`);
      this.tokens.delete(sessionId);
      return false;
    }

    const isValid = csrfSession.token === providedToken;
    console.log(`${isValid ? '✅' : '❌'} [CSRF] Token validation for session: ${sessionId.substring(0, 8)}... - ${isValid ? 'VALID' : 'INVALID'}`);
    
    return isValid;
  }

  /**
   * Regenerate token (call after successful form submission)
   */
  regenerateToken(sessionId: string): string {
    console.log(`🔄 [CSRF] Regenerating token for session: ${sessionId.substring(0, 8)}...`);
    return this.generateToken(sessionId);
  }

  /**
   * Remove token for session
   */
  removeToken(sessionId: string): void {
    this.tokens.delete(sessionId);
    console.log(`🗑️ [CSRF] Removed token for session: ${sessionId.substring(0, 8)}...`);
  }

  /**
   * Get token for session (for sending to frontend)
   */
  getToken(sessionId: string): string | null {
    const csrfSession = this.tokens.get(sessionId);
    return csrfSession?.token || null;
  }

  /**
   * Cleanup expired tokens
   */
  private cleanupExpiredTokens(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [sessionId, csrfSession] of this.tokens.entries()) {
      if (now > csrfSession.expiresAt) {
        this.tokens.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 [CSRF] Cleaned up ${cleanedCount} expired tokens`);
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    const now = new Date();
    let activeTokens = 0;
    let expiredTokens = 0;

    for (const csrfSession of this.tokens.values()) {
      if (now <= csrfSession.expiresAt) {
        activeTokens++;
      } else {
        expiredTokens++;
      }
    }

    return {
      totalTokens: this.tokens.size,
      activeTokens,
      expiredTokens,
      cleanupInterval: '10 minutes',
      tokenExpiry: '30 minutes'
    };
  }
}

// Singleton instance
const csrfProtection = new CSRFProtection();

/**
 * Middleware to generate CSRF token for GET requests to protected forms
 */
export const generateCSRFToken: MiddlewareHandler = async (c: Context, next: Next) => {
  const sessionId = c.get('sessionId');
  
  if (!sessionId) {
    return c.json(ErrorsRes('Session tidak valid untuk generate CSRF token'), 401);
  }

  // Generate or get existing token
  let token = csrfProtection.getToken(sessionId);
  if (!token) {
    token = csrfProtection.generateToken(sessionId);
  }

  // Add token to response
  c.set('csrfToken', token);
  
  await next();
};

/**
 * Middleware to validate CSRF token for POST/PUT/DELETE requests
 */
export const validateCSRFToken: MiddlewareHandler = async (c: Context, next: Next) => {
  const sessionId = c.get('sessionId');
  
  if (!sessionId) {
    return c.json(ErrorsRes('Session tidak valid untuk validasi CSRF'), 401);
  }

  // Get CSRF token from header or body
  const csrfToken = c.req.header('X-CSRF-Token') || 
                   c.req.header('x-csrf-token') ||
                   (await c.req.json().catch(() => ({})))?.csrfToken;

  if (!csrfToken) {
    console.log(`❌ [CSRF] Missing token for session: ${sessionId.substring(0, 8)}...`);
    return c.json(ErrorsRes('CSRF token diperlukan untuk request ini'), 403);
  }

  const isValid = csrfProtection.validateToken(sessionId, csrfToken);
  
  if (!isValid) {
    return c.json(ErrorsRes('CSRF token tidak valid atau sudah expired'), 403);
  }

  // Regenerate token after successful validation (single-use token)
  const newToken = csrfProtection.regenerateToken(sessionId);
  c.set('newCSRFToken', newToken);

  await next();
};

/**
 * Middleware to provide CSRF token in response
 */
export const provideCSRFToken: MiddlewareHandler = async (c: Context, next: Next) => {
  await next();
  
  const newToken = c.get('newCSRFToken');
  if (newToken) {
    // Add new token to response headers
    c.header('X-New-CSRF-Token', newToken);
  }
};

/**
 * Get CSRF token for session (utility function)
 */
export const getCSRFTokenForSession = (sessionId: string): string | null => {
  return csrfProtection.getToken(sessionId);
};

/**
 * Remove CSRF token on logout
 */
export const removeCSRFToken = (sessionId: string): void => {
  csrfProtection.removeToken(sessionId);
};

/**
 * Get CSRF statistics
 */
export const getCSRFStats = () => {
  return csrfProtection.getStats();
};
