import { Hono } from "hono";
import { SuccessRes, ErrorsRes } from "../../../common/utils/api-response";
import { getSessionStats, getCurrentSession } from "../middleware/session-middleware";
import { sessionAuth, optionalSessionAuth } from "../middleware/session-middleware";

const SessionController = new Hono();

/**
 * GET /auth/session/stats
 * Get session statistics (admin only or for monitoring)
 */
SessionController.get("/stats", async (c) => {
  const stats = getSessionStats();
  
  return c.json(SuccessRes("Session statistics retrieved successfully", {
    ...stats,
    timestamp: new Date().toISOString(),
    sessionExpiry: "30 minutes",
    cookieConfig: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: "30 minutes"
    }
  }));
});

/**
 * GET /auth/session/me
 * Get current user session info (requires authentication)
 */
SessionController.get("/me", sessionAuth, async (c) => {
  const session = getCurrentSession(c);
  
  if (!session) {
    return c.json(ErrorsRes("Session tidak ditemukan"), 401);
  }

  return c.json(SuccessRes("Session info retrieved successfully", {
    userUuid: session.userUuid,
    email: session.email,
    createdAt: new Date(session.createdAt).toISOString(),
    lastActivity: new Date(session.lastActivity).toISOString(),
    ipAddress: session.ipAddress,
    userAgent: session.userAgent,
    isExpired: false,
    expiresAt: new Date(session.lastActivity + (30 * 60 * 1000)).toISOString()
  }));
});

/**
 * GET /auth/session/health
 * Health check for session system
 */
SessionController.get("/health", async (c) => {
  const stats = getSessionStats();
  
  return c.json(SuccessRes("Session system is operational", {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    activeSessions: stats.activeSessions,
    totalSessions: stats.totalSessions
  }));
});

export default SessionController;
