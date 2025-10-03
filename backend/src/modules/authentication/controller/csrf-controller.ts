import { Context, Handler } from 'hono';
import { SuccessRes, ErrorsRes } from '../../../common/utils/api-response.js';
import { getCSRFTokenForSession, getCSRFStats } from '../middleware/csrf-middleware.js';

/**
 * Get CSRF token for current session
 * GET /api/v1/auth/csrf/token
 */
export const getCSRFToken: Handler = async (c: Context) => {
  try {
    const sessionId = c.get('sessionId');
    
    if (!sessionId) {
      return c.json(ErrorsRes('Session tidak valid'), 401);
    }

    const csrfToken = c.get('csrfToken');
    
    if (!csrfToken) {
      return c.json(ErrorsRes('CSRF token tidak ditemukan'), 404);
    }

    return c.json(SuccessRes('CSRF token berhasil digenerate', {
      csrfToken,
      sessionId: sessionId.substring(0, 8) + '...', // Partial untuk security
      expiresIn: '30 minutes',
      usage: 'Include in X-CSRF-Token header atau csrfToken field untuk form submissions'
    }));

  } catch (error) {
    console.error('❌ [CSRF Controller] Error getting token:', error);
    return c.json(ErrorsRes('Internal server error'), 500);
  }
};

/**
 * Get CSRF statistics (for monitoring)
 * GET /api/v1/auth/csrf/stats
 */
export const getCSRFStatistics: Handler = async (c: Context) => {
  try {
    const stats = getCSRFStats();
    
    return c.json(SuccessRes('CSRF statistics retrieved successfully', {
      ...stats,
      timestamp: new Date().toISOString(),
      status: 'active'
    }));

  } catch (error) {
    console.error('❌ [CSRF Controller] Error getting stats:', error);
    return c.json(ErrorsRes('Internal server error'), 500);
  }
};

/**
 * Health check for CSRF system
 * GET /api/v1/auth/csrf/health
 */
export const getCSRFHealth: Handler = async (c: Context) => {
  try {
    const stats = getCSRFStats();
    
    return c.json(SuccessRes('CSRF system is healthy', {
      status: 'healthy',
      activeTokens: stats.activeTokens,
      systemUptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));

  } catch (error) {
    console.error('❌ [CSRF Controller] Health check failed:', error);
    return c.json(ErrorsRes('CSRF system unhealthy'), 500);
  }
};
