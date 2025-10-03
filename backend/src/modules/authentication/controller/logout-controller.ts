import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { SuccessRes } from "../../../common/utils/api-response";
import { destroySecureSession } from "../middleware/session-middleware";
import { removeCSRFToken } from "../middleware/csrf-middleware";

const LogoutController = new Hono();

LogoutController.post("/", async (c) => {
  // Get session ID from cookies before destroying session
  const sessionId = getCookie(c, 'kai_session_id');
  
  // Remove CSRF token before session destruction
  if (sessionId) {
    removeCSRFToken(sessionId);
    console.log(`🛡️ [CSRF] Token removed for session: ${sessionId.substring(0, 8)}... during logout`);
  }

  // Destroy the secure session
  destroySecureSession(c);
  
  console.log('User logged out successfully with CSRF cleanup');

  return c.json(SuccessRes("Logout berhasil"));
});

export default LogoutController;
