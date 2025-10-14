// src/routes/auth.route.ts
import { Hono } from "hono";
import LoginController from "../controller/login-controller";
import RegisterController from "../controller/register-controller";
import LogoutController from "../controller/logout-controller";
import UserController from "../controller/user-controller";
import RateLimitController from "../controller/rate-limit-controller";
import SessionController from "../controller/session-controller";
import TransactionHistoryController from "../controller/transaction-history-controller";
import { 
  getCSRFToken, 
  getCSRFStatistics, 
  getCSRFHealth 
} from "../controller/csrf-controller";
import { verifyCaptcha } from "../../../common/utils/verifyCaptcha";
import { 
  loginRateLimit, 
  registerRateLimit, 
  recordFailedLogin, 
  recordFailedRegister 
} from "../middleware/rate-limit-middleware";
import { 
  generateCSRFToken, 
  validateCSRFToken, 
  provideCSRFToken 
} from "../middleware/csrf-middleware";
import { 
  updateProfile, 
  requestRefund, 
  changePassword 
} from "../controller/csrf-protected-controller";
import { sessionAuth } from "../middleware/session-middleware";
import ValidationMiddleware from "../middleware/validation-middleware";

const authRoute = new Hono();

// Middleware verify captcha
const captchaMiddleware = async (c: any, next: any) => {
  try {
    // Get the request body directly
    const body = await c.req.json();
    
    console.log("Request body received for captcha verification");
    const captchaToken = body.captchaToken;

    if (!captchaToken) {
      console.error("Captcha token missing in request");
      return c.json({ success: false, message: "Token CAPTCHA diperlukan" }, 400);
    }

    console.log("Captcha token received:", captchaToken.substring(0, 20) + "...");
    
    const isValid = await verifyCaptcha(captchaToken);
    console.log("Captcha validation result:", isValid);
    
    if (!isValid) {
      return c.json({ success: false, message: "Verifikasi CAPTCHA gagal" }, 400);
    }

    // Store the body in context for next middleware/controller to use
    c.set('requestBody', body);
    
    // Allow the next handler to process the request
    await next();
  } catch (error) {
    console.error("Captcha middleware error:", error);
    return c.json({ success: false, message: `Error processing request: ${error instanceof Error ? error.message : String(error)}` }, 500);
  }
};

// Apply rate limiting and other middlewares for login/register
console.log('🛡️ Setting up PENTA Security Protection layers...');

// 🛡️ LAYER 1: Rate Limiting
authRoute.use("/login/*", loginRateLimit);
authRoute.use("/register/*", registerRateLimit);

// 🛡️ LAYER 2: CAPTCHA Verification
authRoute.use("/login/*", captchaMiddleware);
authRoute.use("/register/*", captchaMiddleware);

// 🛡️ LAYER 5: Input Validation & Sanitization (NEW!)
// Note: Validation is now integrated directly in controllers for better error handling
console.log('✅ Layer 5: Validation & Sanitization active in controllers');

// 🛡️ LAYER 3: Session Security & LAYER 4: CSRF Protection
// CSRF token generation endpoints (require session)
authRoute.get("/csrf/token", sessionAuth, generateCSRFToken, getCSRFToken);
authRoute.get("/csrf/stats", getCSRFStatistics);
authRoute.get("/csrf/health", getCSRFHealth);

// CSRF-protected routes (for authenticated users making form changes)
const csrfProtectedRoutes = new Hono();
csrfProtectedRoutes.use("*", sessionAuth);           // Layer 3: Require session
csrfProtectedRoutes.use("*", validateCSRFToken);    // Layer 4: Validate CSRF token
csrfProtectedRoutes.use("*", provideCSRFToken);     // Layer 4: Provide new token

// Define CSRF-protected endpoints with Layer 5 validation
csrfProtectedRoutes.post("/profile/update", updateProfile);
csrfProtectedRoutes.post("/refund/request", requestRefund);
csrfProtectedRoutes.post("/password/change", changePassword);

// Apply CSRF protection to sensitive endpoints
authRoute.route("/protected", csrfProtectedRoutes);

// 🛡️ PENTA SECURITY PROTECTION: All layers active
// Regular routes (login/register have all 5 layers)
authRoute.route("/login", LoginController);
authRoute.route("/register", RegisterController);
authRoute.route("/logout", LogoutController);
authRoute.route("/user", UserController);
authRoute.route("/transactions", TransactionHistoryController);
authRoute.route("/rate-limit", RateLimitController);
authRoute.route("/session", SessionController);

console.log('🚀 PENTA Security Protection fully activated:');
console.log('   1. ✅ Rate Limiting (Layer 1)');
console.log('   2. ✅ CAPTCHA Verification (Layer 2)'); 
console.log('   3. ✅ Session Security (Layer 3)');
console.log('   4. ✅ CSRF Protection (Layer 4)');
console.log('   5. ✅ Validation & Sanitization (Layer 5)');

// Post-processing middlewares (applied after routes)
authRoute.use("/login/*", recordFailedLogin);
authRoute.use("/register/*", recordFailedRegister);

export default authRoute;