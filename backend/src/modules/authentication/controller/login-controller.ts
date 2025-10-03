import { Hono } from "hono";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response";
import { LoginService } from "../services/login-service";
import { sign } from "hono/jwt";
import { getUserByEmail, updateUser } from "../../../common/repositories/users-repository";
import { LoginValidation } from "../validation/login-validation";
import { regenerateSecureSession } from "../middleware/session-middleware";
import { InputValidator, ValidationRules } from "../../../common/utils/input-validation";
import { SanitizationFactory } from "../../../common/utils/output-sanitization";
import z from "zod";
import path from "path";

const LoginController = new Hono();

LoginController.post("/", async (c) => {
  // Try to get body from context first (from captcha middleware), otherwise parse from request
  let requestData: any = (c as any).get('requestBody');
  if (!requestData) {
    requestData = await c.req.json();
  }
  
  const { email, password } = requestData as { email: string; password: string };

  if (!email || !password) {
    return c.json(ErrorsRes("Silahkan isi email dan password!"), 400);
  }

  // 🛡️ LAYER 5: INPUT VALIDATION & SANITIZATION
  console.log('🔍 Layer 5: Starting input validation & sanitization...');
  
  // Validate email dengan regex
  const emailValidation = InputValidator.validateEmail(email);
  if (!emailValidation.isValid) {
    console.log('❌ Email validation failed:', emailValidation.errors);
    return c.json(ErrorsRes("Email tidak valid", emailValidation.errors), 400);
  }
  
  // Validate password
  const passwordValidation = InputValidator.validatePassword(password, 'medium');
  if (!passwordValidation.isValid) {
    console.log('❌ Password validation failed:', passwordValidation.errors);
    return c.json(ErrorsRes("Password tidak valid", passwordValidation.errors), 400);
  }
  
  // Check for security threats
  const allInputs = { email, password };
  for (const [key, value] of Object.entries(allInputs)) {
    if (typeof value === 'string') {
      // Check SQL injection
      const sqlPattern = /((\%27)|(\')|(\-\-)|(\%23)|(#))/i;
      if (sqlPattern.test(value)) {
        console.log('🚨 SQL injection attempt detected in', key);
        return c.json(ErrorsRes("Input mengandung karakter berbahaya"), 400);
      }
      
      // Check XSS attempts
      const xssPattern = /<script[^>]*>|javascript:|on\w+\s*=/i;
      if (xssPattern.test(value)) {
        console.log('🚨 XSS attempt detected in', key);
        return c.json(ErrorsRes("Input mengandung karakter berbahaya"), 400);
      }
    }
  }
  
  // Use sanitized values
  const sanitizedEmail = emailValidation.sanitized || email;
  
  console.log('✅ Layer 5: Input validation passed');

  // Legacy validation (keep for backward compatibility)
  try{
    await LoginValidation.parse({
        email: sanitizedEmail, password: password
    })
  }catch(error) {
    return c.json(ErrorsRes("Data tidak valid!", (error as z.ZodError).issues.map((e) => ({
        path: e.path[0],
        message: e.message
    }))),400)
  }

  const result = await LoginService(sanitizedEmail, password);

  if (!process.env.X_KEY) {
    return c.json(ErrorsRes("Token JWT tidak dapat dibuat!"), 500);
  }

  if (!result.success) {
    return c.json(ErrorsRes(result.message), 500);
  }

  const user = await getUserByEmail(sanitizedEmail);
  const exp = Math.floor(Date.now() / 1000) + 60 * 50;

  const token = await sign(
    {
      uuid: user.uuid,
      exp,
    },
    process.env.X_KEY
  );

  await updateUser(user.uuid, {...user, token: token})

  // Create secure session with session regeneration
  const sessionId = regenerateSecureSession(c, user.uuid, sanitizedEmail);
  
  console.log(`✅ Layer 5: Secure session created for user ${sanitizedEmail}: ${sessionId.substring(0, 8)}...`);

  // 🛡️ LAYER 5: OUTPUT SANITIZATION
  const sanitizedUser = SanitizationFactory.sanitizeUserForAPI(result.data);
  
  return c.json(SuccessRes(result.message, {
    user: sanitizedUser,
    token: token,
    sessionId: sessionId.substring(0, 8) + "..." // Only show partial session ID for security
  }));
});

export default LoginController
