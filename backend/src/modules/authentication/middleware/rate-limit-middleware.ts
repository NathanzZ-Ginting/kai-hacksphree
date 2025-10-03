import { Context, Next, MiddlewareHandler } from "hono";
import { ErrorsRes } from "../../../common/utils/api-response";

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockExpiry?: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private readonly windowMs: number;
  private readonly maxAttempts: number;
  private readonly blockDurationMs: number;

  constructor(
    windowMs: number = 5 * 60 * 1000, // 5 minutes
    maxAttempts: number = 5,
    blockDurationMs: number = 15 * 60 * 1000 // 15 minutes block
  ) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
    this.blockDurationMs = blockDurationMs;

    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private getClientKey(c: Context): string {
    // Try to get real IP from various headers (for reverse proxy scenarios)
    const forwarded = c.req.header("x-forwarded-for");
    const realIp = c.req.header("x-real-ip");
    const cfConnectingIp = c.req.header("cf-connecting-ip");
    
    let clientIp = forwarded?.split(",")[0]?.trim() || realIp || cfConnectingIp;
    
    // Fallback to connection remote address if available
    if (!clientIp) {
      // For Hono with Node.js adapter, we might need to access the raw request
      const env = c.env as any;
      clientIp = env?.remoteAddress || "unknown";
    }

    return `auth_rate_limit:${clientIp}`;
  }

  public isAllowed(c: Context): { allowed: boolean; resetTime?: number; remaining?: number } {
    const key = this.getClientKey(c);
    const now = Date.now();
    const entry = this.store.get(key);

    // Check if client is currently blocked
    if (entry?.blocked && entry.blockExpiry && now < entry.blockExpiry) {
      return { 
        allowed: false, 
        resetTime: entry.blockExpiry 
      };
    }

    // If no entry exists or window has expired, create new entry
    if (!entry || now > entry.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
        blocked: false
      });
      return { 
        allowed: true, 
        remaining: this.maxAttempts - 1,
        resetTime: now + this.windowMs
      };
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > this.maxAttempts) {
      entry.blocked = true;
      entry.blockExpiry = now + this.blockDurationMs;
      return { 
        allowed: false, 
        resetTime: entry.blockExpiry 
      };
    }

    return { 
      allowed: true, 
      remaining: this.maxAttempts - entry.count,
      resetTime: entry.resetTime
    };
  }

  public recordFailedAttempt(c: Context): void {
    // This method is called after a failed login attempt
    // The count is already incremented in isAllowed, so we don't need to do anything here
    // But we can use this for logging or additional logic
    const key = this.getClientKey(c);
    const entry = this.store.get(key);
    
    if (entry) {
      console.log(`Failed auth attempt from ${key}. Count: ${entry.count}/${this.maxAttempts}`);
    }
  }

  public recordSuccessfulAttempt(c: Context): void {
    // Reset the rate limit for successful authentication
    const key = this.getClientKey(c);
    this.store.delete(key);
    console.log(`Successful auth from ${key}. Rate limit reset.`);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      // Remove expired entries (both rate limit window and block expiry)
      if (now > entry.resetTime && (!entry.blockExpiry || now > entry.blockExpiry)) {
        this.store.delete(key);
      }
    }
  }

  public getStats(): { totalEntries: number; blockedIPs: number } {
    const now = Date.now();
    let blockedIPs = 0;
    
    for (const entry of this.store.values()) {
      if (entry.blocked && entry.blockExpiry && now < entry.blockExpiry) {
        blockedIPs++;
      }
    }

    return {
      totalEntries: this.store.size,
      blockedIPs
    };
  }
}

// Create rate limiter instances for different endpoints
export const authRateLimiter = new RateLimiter(
  5 * 60 * 1000,  // 5 minutes window
  5,              // max 5 attempts
  5 * 60 * 1000   // 5 minutes block (changed from 15 minutes)
);

export const registerRateLimiter = new RateLimiter(
  10 * 60 * 1000, // 10 minutes window  
  3,              // max 3 attempts (stricter for registration)
  10 * 60 * 1000  // 10 minutes block (changed from 30 minutes)
);

/**
 * Rate limiting middleware for authentication endpoints
 */
export const createRateLimitMiddleware = (rateLimiter: RateLimiter, action: string = "authentication"): MiddlewareHandler => {
  return async (c: Context, next: Next) => {
    const result = rateLimiter.isAllowed(c);

    if (!result.allowed) {
      const resetTime = result.resetTime ? new Date(result.resetTime) : new Date();
      const waitMinutes = Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60));

      return c.json(
        ErrorsRes(
          `Terlalu banyak percobaan ${action}. Coba lagi dalam ${waitMinutes} menit.`,
          {
            retryAfter: resetTime.toISOString(),
            waitMinutes
          }
        ),
        429
      );
    }

    // Add rate limit headers
    c.header("X-RateLimit-Limit", rateLimiter["maxAttempts"].toString());
    c.header("X-RateLimit-Remaining", (result.remaining || 0).toString());
    c.header("X-RateLimit-Reset", new Date(result.resetTime || 0).toISOString());

    await next();
  };
};

/**
 * Middleware to record failed authentication attempts
 */
export const recordFailedAuthMiddleware = (rateLimiter: RateLimiter): MiddlewareHandler => {
  return async (c: Context, next: Next) => {
    await next();
    
    try {
      // Check if the response indicates a failed authentication
      const response = await c.res.clone().json() as ApiResponse;
      if (!response.success && c.res.status === 500) {
        rateLimiter.recordFailedAttempt(c);
      } else if (response.success) {
        rateLimiter.recordSuccessfulAttempt(c);
      }
    } catch (error) {
      // If we can't parse the response, assume it's an error
      console.error("Error parsing response in rate limit middleware:", error);
      rateLimiter.recordFailedAttempt(c);
    }
  };
};

// Pre-configured middlewares
export const loginRateLimit: MiddlewareHandler = createRateLimitMiddleware(authRateLimiter, "login");
export const registerRateLimit: MiddlewareHandler = createRateLimitMiddleware(registerRateLimiter, "registrasi");
export const recordFailedLogin: MiddlewareHandler = recordFailedAuthMiddleware(authRateLimiter);
export const recordFailedRegister: MiddlewareHandler = recordFailedAuthMiddleware(registerRateLimiter);
