/**
 * 🛡️ VALIDATION & SANITIZATION MIDDLEWARE
 * Layer 5 Security: Automatic validation & sanitization untuk semua endpoints
 * 
 * Features:
 * - Automatic input validation dengan schema
 * - Output sanitization untuk prevent XSS
 * - Security threat detection
 * - Request body validation
 * - Query parameter validation
 */

import { Context, Next, MiddlewareHandler } from 'hono';
import { InputValidator, ValidationRules, ValidationResult } from '../../../common/utils/input-validation.js';
import { SanitizationFactory, OutputSanitizer, JSONSanitizer } from '../../../common/utils/output-sanitization.js';
import { ErrorsRes } from '../../../common/utils/api-response.js';

// ===========================================
// 📋 VALIDATION SCHEMAS
// ===========================================

export interface ValidationSchema {
  body?: Record<string, (value: any) => ValidationResult>;
  query?: Record<string, (value: any) => ValidationResult>;
  params?: Record<string, (value: any) => ValidationResult>;
  required?: string[];
  optional?: string[];
}

export interface ValidationOptions {
  sanitizeInput?: boolean;
  sanitizeOutput?: boolean;
  blockOnSecurityThreats?: boolean;
  logSuspiciousActivity?: boolean;
}

// ===========================================
// 🔍 INPUT VALIDATION MIDDLEWARE
// ===========================================

export class ValidationMiddleware {
  
  /**
   * Create validation middleware dengan schema
   */
  static validate(schema: ValidationSchema, options: ValidationOptions = {}): MiddlewareHandler {
    const {
      sanitizeInput = true,
      sanitizeOutput = true,
      blockOnSecurityThreats = true,
      logSuspiciousActivity = true
    } = options;
    
    return async (c: Context, next: Next) => {
      try {
        const validationErrors: Record<string, string[]> = {};
        const sanitizedData: Record<string, any> = {};
        
        // Parse request body
        let requestBody: any = {};
        try {
          const contentType = c.req.header('content-type');
          if (contentType && contentType.includes('application/json')) {
            requestBody = await c.req.json();
          }
        } catch (error) {
          return c.json(ErrorsRes('Invalid JSON format dalam request body'), 400);
        }
        
        // Validate request body
        if (schema.body && requestBody) {
          const bodyValidation = InputValidator.validateFields(requestBody, schema.body);
          
          if (!bodyValidation.isValid) {
            Object.assign(validationErrors, bodyValidation.errors);
          }
          
          if (sanitizeInput) {
            sanitizedData.body = bodyValidation.sanitized;
          }
        }
        
        // Validate query parameters
        if (schema.query) {
          const queryEntries = Object.entries(c.req.queries() || {});
          const queryParams = Object.fromEntries(queryEntries.map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
          const queryValidation = InputValidator.validateFields(queryParams, schema.query);
          
          if (!queryValidation.isValid) {
            Object.assign(validationErrors, queryValidation.errors);
          }
          
          if (sanitizeInput) {
            sanitizedData.query = queryValidation.sanitized;
          }
        }
        
        // Validate URL parameters
        if (schema.params) {
          const urlParams = c.req.param();
          const paramsValidation = InputValidator.validateFields(urlParams, schema.params);
          
          if (!paramsValidation.isValid) {
            Object.assign(validationErrors, paramsValidation.errors);
          }
          
          if (sanitizeInput) {
            sanitizedData.params = paramsValidation.sanitized;
          }
        }
        
        // Check required fields
        if (schema.required) {
          for (const field of schema.required) {
            if (!requestBody[field] && requestBody[field] !== 0 && requestBody[field] !== false) {
              if (!validationErrors[field]) {
                validationErrors[field] = [];
              }
              validationErrors[field].push(`${field} wajib diisi`);
            }
          }
        }
        
        // Security threat detection
        if (blockOnSecurityThreats) {
          const queryEntries = Object.entries(c.req.queries() || {});
          const queryParams = Object.fromEntries(queryEntries.map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
          const allInputs = { ...requestBody, ...queryParams };
          
          for (const [key, value] of Object.entries(allInputs)) {
            if (typeof value === 'string') {
              const threats = ValidationMiddleware.checkSecurityThreats(value);
              
              if (threats.length > 0) {
                if (logSuspiciousActivity) {
                  console.warn('🚨 Security threat detected:', {
                    field: key,
                    value: value.substring(0, 100), // Log first 100 chars only
                    threats,
                    ip: ValidationMiddleware.getClientIP(c),
                    userAgent: c.req.header('user-agent'),
                    timestamp: new Date().toISOString()
                  });
                }
                
                return c.json(ErrorsRes('Input mengandung konten berbahaya'), 400);
              }
            }
          }
        }
        
        // Return validation errors if any
        if (Object.keys(validationErrors).length > 0) {
          return c.json(ErrorsRes('Validasi input gagal', validationErrors), 400);
        }
        
        // Store sanitized data in context for use by handlers
        if (sanitizeInput) {
          c.set('sanitizedData', sanitizedData);
        }
        
        // Continue to next middleware/handler
        await next();
        
        // Sanitize output response if needed
        if (sanitizeOutput) {
          ValidationMiddleware.sanitizeResponse(c);
        }
        
      } catch (error) {
        console.error('Validation middleware error:', error);
        return c.json(ErrorsRes('Internal validation error'), 500);
      }
    };
  }
  
  /**
   * Quick validation untuk specific types
   */
  static validateLoginInput(): MiddlewareHandler {
    return ValidationMiddleware.validate({
      body: ValidationRules.login,
      required: ['email', 'password', 'captchaToken']
    });
  }
  
  static validateRegistrationInput(): MiddlewareHandler {
    return ValidationMiddleware.validate({
      body: ValidationRules.registration,
      required: ['email', 'username', 'name', 'password', 'captchaToken']
    });
  }
  
  static validateProfileUpdateInput(): MiddlewareHandler {
    return ValidationMiddleware.validate({
      body: ValidationRules.profileUpdate,
      required: ['csrfToken'] // CSRF required for profile updates
    });
  }
  
  static validatePasswordChangeInput(): MiddlewareHandler {
    return ValidationMiddleware.validate({
      body: ValidationRules.passwordChange,
      required: ['currentPassword', 'newPassword', 'csrfToken']
    });
  }
  
  /**
   * Security threat detection
   */
  private static checkSecurityThreats(input: string): string[] {
    const threats: string[] = [];
    
    // SQL Injection detection
    const sqlPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
      /w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
      /((\%27)|(\'))union/i
    ];
    
    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        threats.push('Potential SQL Injection');
        break;
      }
    }
    
    // XSS detection
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>/gi
    ];
    
    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        threats.push('Potential XSS Attack');
        break;
      }
    }
    
    // Path traversal detection
    if (/\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c/i.test(input)) {
      threats.push('Path Traversal Attempt');
    }
    
    // Command injection detection
    if (/[;&|`$(){}[\]]/g.test(input)) {
      threats.push('Potential Command Injection');
    }
    
    return threats;
  }
  
  /**
   * Get client IP address
   */
  private static getClientIP(c: Context): string {
    return c.req.header('x-forwarded-for') ||
           c.req.header('x-real-ip') ||
           c.req.header('cf-connecting-ip') ||
           'unknown';
  }
  
  /**
   * Sanitize response output
   */
  private static sanitizeResponse(c: Context) {
    // Note: This is handled by response interceptor
    // We can add response sanitization logic here if needed
  }
}

// ===========================================
// 🧹 OUTPUT SANITIZATION MIDDLEWARE
// ===========================================

export class SanitizationMiddleware {
  
  /**
   * Middleware untuk sanitize semua JSON responses
   */
  static sanitizeJSONResponse(): MiddlewareHandler {
    return async (c: Context, next: Next) => {
      await next();
      
      // Intercept response and sanitize if JSON
      const response = c.res;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const responseText = await response.text();
          const responseData = JSON.parse(responseText);
          
          // Sanitize the response data
          const sanitized = JSONSanitizer.sanitizeAPIResponse(responseData);
          
          // Create new response with sanitized data
          c.res = new Response(JSON.stringify(sanitized), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
          
        } catch (error) {
          console.error('Response sanitization error:', error);
          // If sanitization fails, return original response
        }
      }
    };
  }
  
  /**
   * Middleware untuk escape HTML dalam user data
   */
  static escapeHTMLResponse(): MiddlewareHandler {
    return async (c: Context, next: Next) => {
      await next();
      
      // Get response and escape HTML in user-facing strings
      const response = c.res;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const responseText = await response.text();
          const responseData = JSON.parse(responseText);
          
          // Escape HTML in response
          const escaped = JSONSanitizer.sanitizeObject(responseData, true);
          
          c.res = new Response(JSON.stringify(escaped), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
          
        } catch (error) {
          console.error('HTML escape error:', error);
        }
      }
    };
  }
}

// ===========================================
// 🎯 PREDEFINED VALIDATION RULES
// ===========================================

export const CommonValidations = {
  // Text validation
  shortText: (value: string) => InputValidator.validateText(value, 1, 100),
  mediumText: (value: string) => InputValidator.validateText(value, 1, 500),
  longText: (value: string) => InputValidator.validateText(value, 1, 2000),
  
  // ID validation
  uuid: (value: string) => {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return {
      isValid: uuidPattern.test(value),
      errors: uuidPattern.test(value) ? [] : ['Format UUID tidak valid'],
      sanitized: value.toLowerCase().trim()
    };
  },
  
  // Number validation
  positiveInteger: (value: any) => {
    const num = parseInt(value);
    return {
      isValid: !isNaN(num) && num > 0,
      errors: (!isNaN(num) && num > 0) ? [] : ['Harus berupa angka positif'],
      sanitized: num
    };
  },
  
  // Boolean validation
  boolean: (value: any) => {
    const validBooleans = ['true', 'false', true, false, 1, 0, '1', '0'];
    return {
      isValid: validBooleans.includes(value),
      errors: validBooleans.includes(value) ? [] : ['Harus berupa boolean'],
      sanitized: Boolean(value)
    };
  }
};

export default ValidationMiddleware;
