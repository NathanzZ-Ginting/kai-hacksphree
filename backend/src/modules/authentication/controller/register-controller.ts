import { Hono } from "hono";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response";
import { RegisterService } from "../services/register-service";
import { RegisterValidation } from "../validation/register-validation";
import { InputValidator, ValidationRules } from "../../../common/utils/input-validation";
import { SanitizationFactory } from "../../../common/utils/output-sanitization";
import z from "zod";
import path from "path";

const RegisterController = new Hono();

RegisterController.post("/", async (c) => {
  try {
    // Try to get body from context first (from captcha middleware), otherwise parse from request
    let requestData: any = (c as any).get('requestBody');
    if (!requestData) {
      requestData = await c.req.json();
    }
    
    const { name, email, password, age, phoneNumber } = requestData as { 
      name: string; 
      email: string; 
      password: string; 
      age: number; 
      phoneNumber: string; 
    };

    if (!name || !email || !password) {
      return c.json(ErrorsRes("Isi lengkap data diri anda!"), 400);
    }

    // 🛡️ LAYER 5: INPUT VALIDATION & SANITIZATION
    console.log('🔍 Layer 5: Starting registration input validation & sanitization...');
    
    const validationErrors: string[] = [];
    
    // Validate name
    const nameValidation = InputValidator.validateName(name);
    if (!nameValidation.isValid) {
      validationErrors.push(...nameValidation.errors);
    }
    
    // Validate email dengan regex
    const emailValidation = InputValidator.validateEmail(email);
    if (!emailValidation.isValid) {
      validationErrors.push(...emailValidation.errors);
    }
    
    // Validate password dengan strong requirement
    const passwordValidation = InputValidator.validatePassword(password, 'strong');
    if (!passwordValidation.isValid) {
      validationErrors.push(...passwordValidation.errors);
    }
    
    // Validate phone number (Indonesian format)
    if (phoneNumber) {
      const phoneValidation = InputValidator.validatePhoneIndonesia(phoneNumber);
      if (!phoneValidation.isValid) {
        validationErrors.push(...phoneValidation.errors);
      }
    }
    
    // Return validation errors if any
    if (validationErrors.length > 0) {
      console.log('❌ Registration validation failed:', validationErrors);
      return c.json(ErrorsRes("Data registrasi tidak valid", validationErrors), 400);
    }
    
    // Check for security threats
    const allInputs = { name, email, password, phoneNumber: phoneNumber || '' };
    for (const [key, value] of Object.entries(allInputs)) {
      if (typeof value === 'string' && value) {
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
    const sanitizedName = nameValidation.sanitized || name;
    const sanitizedEmail = emailValidation.sanitized || email;
    const sanitizedPhone = phoneNumber ? InputValidator.validatePhoneIndonesia(phoneNumber).sanitized : phoneNumber;
    
    console.log('✅ Layer 5: Registration input validation passed');

    // Legacy validation (keep for backward compatibility)
    try {
      await RegisterValidation.parse({
        name: sanitizedName,
        email: sanitizedEmail,
        password: password,
        age: age,
        phoneNumber: sanitizedPhone,
      });
    } catch (error) {
      return c.json(
        ErrorsRes(
          "Data tidak valid!",
          (error as z.ZodError).issues.map((e) => ({
            path: e.path[0],
            message: e.message,
          }))
        ), 400
      );
    }

    const result = await RegisterService(sanitizedName, sanitizedEmail, password, age, sanitizedPhone)

    if(!result.success) {
        return c.json(ErrorsRes(result.message), 500)
    }

    console.log('✅ Layer 5: User registration successful with sanitized data');
    
    // 🛡️ LAYER 5: OUTPUT SANITIZATION
    // Don't expose sensitive data in response
    return c.json(SuccessRes(result.message), 201)
        
  } catch (error) {
    console.error("Register controller error:", error);
    return c.json(ErrorsRes("Terjadi kesalahan pada server"), 500);
  }
});

export default RegisterController;
