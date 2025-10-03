import { Hono } from "hono";
import { SuccessRes } from "../../../common/utils/api-response";
import { authRateLimiter, registerRateLimiter } from "../middleware/rate-limit-middleware";

const RateLimitController = new Hono();

/**
 * GET /auth/rate-limit/stats
 * Get rate limiting statistics
 */
RateLimitController.get("/stats", async (c) => {
  const authStats = authRateLimiter.getStats();
  const registerStats = registerRateLimiter.getStats();

  return c.json(SuccessRes("Rate limit statistics retrieved successfully", {
    login: {
      ...authStats,
      description: "Login rate limiting (5 attempts per 5 minutes, 5 min block)"
    },
    register: {
      ...registerStats,
      description: "Registration rate limiting (3 attempts per 10 minutes, 10 min block)"
    },
    timestamp: new Date().toISOString()
  }));
});

/**
 * GET /auth/rate-limit/health
 * Health check for rate limiting system
 */
RateLimitController.get("/health", async (c) => {
  return c.json(SuccessRes("Rate limiting system is operational", {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }));
});

export default RateLimitController;
