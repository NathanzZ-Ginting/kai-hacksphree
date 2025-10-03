import { Context, Handler } from 'hono';
import { SuccessRes, ErrorsRes } from '../../../common/utils/api-response.js';

/**
 * Update user profile (CSRF protected example)
 * POST /api/v1/auth/protected/profile/update
 */
export const updateProfile: Handler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const sessionId = c.get('sessionId');
    
    // Simulate profile update logic
    const { name, email, phone } = body;
    
    if (!name || !email) {
      return c.json(ErrorsRes('Name dan email diperlukan'), 400);
    }

    // Here would be actual profile update logic
    console.log(`🔒 [CSRF Protected] Profile update for session: ${sessionId.substring(0, 8)}...`);
    
    return c.json(SuccessRes('Profile berhasil diupdate', {
      name,
      email,
      phone,
      updatedAt: new Date().toISOString(),
      csrfProtected: true
    }));

  } catch (error) {
    console.error('❌ [Profile Update] Error:', error);
    return c.json(ErrorsRes('Internal server error'), 500);
  }
};

/**
 * Request refund (CSRF protected example)
 * POST /api/v1/auth/protected/refund/request
 */
export const requestRefund: Handler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const sessionId = c.get('sessionId');
    
    const { ticketId, reason, amount } = body;
    
    if (!ticketId || !reason) {
      return c.json(ErrorsRes('Ticket ID dan alasan diperlukan'), 400);
    }

    // Here would be actual refund logic
    console.log(`🔒 [CSRF Protected] Refund request for session: ${sessionId.substring(0, 8)}...`);
    
    return c.json(SuccessRes('Permintaan refund berhasil disubmit', {
      refundId: 'REF' + Date.now(),
      ticketId,
      reason,
      amount: amount || 'TBD',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      csrfProtected: true
    }));

  } catch (error) {
    console.error('❌ [Refund Request] Error:', error);
    return c.json(ErrorsRes('Internal server error'), 500);
  }
};

/**
 * Change password (CSRF protected example)
 * POST /api/v1/auth/protected/password/change
 */
export const changePassword: Handler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const sessionId = c.get('sessionId');
    
    const { currentPassword, newPassword, confirmPassword } = body;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      return c.json(ErrorsRes('Semua field password diperlukan'), 400);
    }

    if (newPassword !== confirmPassword) {
      return c.json(ErrorsRes('Password baru tidak cocok'), 400);
    }

    if (newPassword.length < 8) {
      return c.json(ErrorsRes('Password minimal 8 karakter'), 400);
    }

    // Here would be actual password change logic
    console.log(`🔒 [CSRF Protected] Password change for session: ${sessionId.substring(0, 8)}...`);
    
    return c.json(SuccessRes('Password berhasil diubah', {
      changedAt: new Date().toISOString(),
      csrfProtected: true,
      message: 'Silahkan login ulang dengan password baru'
    }));

  } catch (error) {
    console.error('❌ [Password Change] Error:', error);
    return c.json(ErrorsRes('Internal server error'), 500);
  }
};
