import { Context, Next, MiddlewareHandler } from "hono";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { ErrorsRes } from "../../../common/utils/api-response";
import { getUserByEmail, updateUser } from "../../../common/repositories/users-repository";
import { randomBytes } from "crypto";

// Session store - In production, use Redis or database
interface SessionData {
  userId: string;
  userUuid: string;
  email: string;
  createdAt: number;
  lastActivity: number;
  ipAddress: string;
  userAgent: string;
}

class SessionManager {
  private store: Map<string, SessionData> = new Map();
  private readonly sessionExpiry = 30 * 60 * 1000; // 30 minutes
  private readonly cookieName = "kai_session_id";

  constructor() {
    // Clean up expired sessions every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  // Generate secure session ID
  private generateSessionId(): string {
    return randomBytes(32).toString('hex');
  }

  // Create new session
  createSession(userUuid: string, email: string, ipAddress?: string, userAgent?: string): string {
    const sessionId = this.generateSessionId();
    const now = Date.now();
    
    const sessionData: SessionData = {
      userId: sessionId,
      userUuid,
      email,
      createdAt: now,
      lastActivity: now,
      ipAddress: ipAddress || "unknown",
      userAgent: userAgent || "unknown"
    };

    this.store.set(sessionId, sessionData);
    console.log(`Session created for user ${email}: ${sessionId.substring(0, 8)}...`);
    
    return sessionId;
  }

  // Get session data
  getSession(sessionId: string): SessionData | null {
    const session = this.store.get(sessionId);
    
    if (!session) {
      return null;
    }

    // Check if session expired
    if (Date.now() - session.lastActivity > this.sessionExpiry) {
      this.store.delete(sessionId);
      console.log(`Session expired: ${sessionId.substring(0, 8)}...`);
      return null;
    }

    // Update last activity
    session.lastActivity = Date.now();
    this.store.set(sessionId, session);
    
    return session;
  }

  // Update session (for session regeneration)
  regenerateSession(oldSessionId: string, userUuid: string, email: string, ipAddress?: string, userAgent?: string): string | null {
    const oldSession = this.store.get(oldSessionId);
    
    if (!oldSession) {
      return null;
    }

    // Delete old session
    this.store.delete(oldSessionId);
    console.log(`Session regenerated for user ${email}: ${oldSessionId.substring(0, 8)}... -> new session`);

    // Create new session
    return this.createSession(userUuid, email, ipAddress, userAgent);
  }

  // Destroy session
  destroySession(sessionId: string): boolean {
    const deleted = this.store.delete(sessionId);
    if (deleted) {
      console.log(`Session destroyed: ${sessionId.substring(0, 8)}...`);
    }
    return deleted;
  }

  // Cleanup expired sessions
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [sessionId, session] of this.store.entries()) {
      if (now - session.lastActivity > this.sessionExpiry) {
        this.store.delete(sessionId);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired sessions`);
    }
  }

  // Get session statistics
  getStats(): { totalSessions: number; activeSessions: number } {
    const now = Date.now();
    let activeSessions = 0;
    
    for (const session of this.store.values()) {
      if (now - session.lastActivity <= this.sessionExpiry) {
        activeSessions++;
      }
    }

    return {
      totalSessions: this.store.size,
      activeSessions
    };
  }

  // Get cookie name
  getCookieName(): string {
    return this.cookieName;
  }
}

// Global session manager instance
export const sessionManager = new SessionManager();

/**
 * Secure cookie configuration
 */
const getSecureCookieOptions = (isProduction: boolean = process.env.NODE_ENV === 'production') => ({
  httpOnly: true,        // Prevent XSS attacks
  secure: isProduction,  // HTTPS only in production
  sameSite: 'Strict' as const,  // CSRF protection
  maxAge: 30 * 60,       // 30 minutes
  path: '/',             // Available for entire domain
});

/**
 * Create session and set secure cookie
 */
export const createSecureSession = (
  c: Context, 
  userUuid: string, 
  email: string
): string => {
  const ipAddress = getClientIP(c);
  const userAgent = c.req.header('user-agent') || 'unknown';
  
  const sessionId = sessionManager.createSession(userUuid, email, ipAddress, userAgent);
  
  // Set secure cookie
  setCookie(c, sessionManager.getCookieName(), sessionId, getSecureCookieOptions());
  
  return sessionId;
};

/**
 * Regenerate session ID (call after successful login)
 */
export const regenerateSecureSession = (
  c: Context,
  userUuid: string,
  email: string
): string => {
  const oldSessionId = getCookie(c, sessionManager.getCookieName());
  const ipAddress = getClientIP(c);
  const userAgent = c.req.header('user-agent') || 'unknown';
  
  let newSessionId: string;
  
  if (oldSessionId) {
    // Regenerate existing session
    const regeneratedId = sessionManager.regenerateSession(oldSessionId, userUuid, email, ipAddress, userAgent);
    newSessionId = regeneratedId || sessionManager.createSession(userUuid, email, ipAddress, userAgent);
  } else {
    // Create new session
    newSessionId = sessionManager.createSession(userUuid, email, ipAddress, userAgent);
  }
  
  // Set new secure cookie
  setCookie(c, sessionManager.getCookieName(), newSessionId, getSecureCookieOptions());
  
  return newSessionId;
};

/**
 * Destroy session and clear cookie
 */
export const destroySecureSession = (c: Context): boolean => {
  const sessionId = getCookie(c, sessionManager.getCookieName());
  
  if (sessionId) {
    sessionManager.destroySession(sessionId);
  }
  
  // Clear cookie
  deleteCookie(c, sessionManager.getCookieName(), {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });
  
  return true;
};

/**
 * Get client IP address
 */
const getClientIP = (c: Context): string => {
  const forwarded = c.req.header("x-forwarded-for");
  const realIp = c.req.header("x-real-ip");
  const cfConnectingIp = c.req.header("cf-connecting-ip");
  
  return forwarded?.split(",")[0]?.trim() || realIp || cfConnectingIp || "unknown";
};

/**
 * Session authentication middleware
 */
export const sessionAuth: MiddlewareHandler = async (c: Context, next: Next) => {
  const sessionId = getCookie(c, sessionManager.getCookieName());
  
  if (!sessionId) {
    return c.json(ErrorsRes("Session tidak ditemukan. Silahkan login kembali."), 401);
  }
  
  const session = sessionManager.getSession(sessionId);
  
  if (!session) {
    // Clear invalid cookie
    deleteCookie(c, sessionManager.getCookieName(), { path: '/' });
    return c.json(ErrorsRes("Session tidak valid atau sudah expired. Silahkan login kembali."), 401);
  }
  
  // Store session data in context for use in handlers
  c.set('session', session);
  c.set('sessionId', sessionId);
  
  await next();
};

/**
 * Optional session middleware (doesn't block if no session)
 */
export const optionalSessionAuth: MiddlewareHandler = async (c: Context, next: Next) => {
  const sessionId = getCookie(c, sessionManager.getCookieName());
  
  if (sessionId) {
    const session = sessionManager.getSession(sessionId);
    
    if (session) {
      c.set('session', session);
      c.set('sessionId', sessionId);
    } else {
      // Clear invalid cookie
      deleteCookie(c, sessionManager.getCookieName(), { path: '/' });
    }
  }
  
  await next();
};

/**
 * Get current session from context
 */
export const getCurrentSession = (c: Context): SessionData | null => {
  return (c as any).get('session') || null;
};

/**
 * Session statistics for monitoring
 */
export const getSessionStats = () => {
  return sessionManager.getStats();
};
