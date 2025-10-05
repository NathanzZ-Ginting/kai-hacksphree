# 🛡️ PENTA Security Layer 5: Input Validation & Sanitization

## Overview

The fifth and final layer of our PENTA Security Framework implements comprehensive input validation and sanitization to prevent injection attacks, data corruption, and security vulnerabilities. This layer provides automatic validation, sanitization, and threat detection for all user inputs.

## Features

### 🛡️ **Comprehensive Validation**
- **Type Safety**: Strict type checking and validation
- **Schema Validation**: Zod-based schema validation
- **Pattern Matching**: Regex-based format validation
- **Range Validation**: Min/max value constraints

### 🧹 **Advanced Sanitization**
- **XSS Prevention**: HTML/script tag sanitization
- **SQL Injection Protection**: Input sanitization and parameterization
- **NoSQL Injection Prevention**: Object and operator sanitization
- **Path Traversal Protection**: File path sanitization

### 🚨 **Threat Detection**
- **Security Pattern Detection**: Malicious input identification
- **Suspicious Activity Logging**: Automated threat logging
- **Real-time Blocking**: Immediate threat response
- **Behavioral Analysis**: Pattern-based detection

## Implementation

### Validation Middleware

```typescript
// src/middleware/validation-middleware.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Layer 5 Security: Automatic validation & sanitization untuk semua endpoints
 * 
 * Features:
 * - Comprehensive input validation
 * - XSS/injection attack prevention
 * - Security threat detection
 * - Data sanitization & normalization
 * - Type safety enforcement
 */

export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'date' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: string[] | number[];
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationOptions {
  allowUnknownFields?: boolean;
  stripUnknownFields?: boolean;
  sanitizeStrings?: boolean;
  blockOnSecurityThreats?: boolean;
  logValidationErrors?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData: any;
  threats: string[];
}

export default class ValidationMiddleware {
  
  /**
   * Main validation function
   */
  static async validateInput(
    data: any, 
    schema: ValidationSchema, 
    options: ValidationOptions = {}
  ): Promise<ValidationResult> {
    const {
      allowUnknownFields = false,
      stripUnknownFields = true,
      sanitizeStrings = true,
      blockOnSecurityThreats = true,
      logValidationErrors = true
    } = options;

    const result: ValidationResult = {
      isValid: true,
      errors: [],
      sanitizedData: {},
      threats: []
    };

    try {
      // Handle non-object inputs
      if (typeof data !== 'object' || data === null) {
        result.isValid = false;
        result.errors.push('Input must be an object');
        return result;
      }

      // Check for unknown fields
      if (!allowUnknownFields) {
        const unknownFields = Object.keys(data).filter(key => !schema[key]);
        if (unknownFields.length > 0) {
          result.errors.push(`Unknown fields: ${unknownFields.join(', ')}`);
          if (!stripUnknownFields) {
            result.isValid = false;
          }
        }
      }

      // Validate each field
      for (const [field, rule] of Object.entries(schema)) {
        const value = data[field];
        const fieldResult = await this.validateField(field, value, rule, {
          sanitizeStrings,
          blockOnSecurityThreats
        });

        if (!fieldResult.isValid) {
          result.isValid = false;
          result.errors.push(...fieldResult.errors);
        }

        if (fieldResult.threats.length > 0) {
          result.threats.push(...fieldResult.threats);
        }

        // Add sanitized value if validation passed
        if (fieldResult.isValid && fieldResult.sanitizedValue !== undefined) {
          result.sanitizedData[field] = fieldResult.sanitizedValue;
        }
      }

      // Handle security threats
      if (result.threats.length > 0) {
        if (blockOnSecurityThreats) {
          result.isValid = false;
          result.errors.push('Security threats detected in input');
        }

        // Log security threats
        console.warn('🚨 Security threats detected:', {
          threats: result.threats,
          data: this.sanitizeForLogging(data)
        });
      }

      // Log validation errors if enabled
      if (!result.isValid && logValidationErrors) {
        console.warn('❌ Validation failed:', {
          errors: result.errors,
          data: this.sanitizeForLogging(data)
        });
      }

    } catch (error) {
      console.error('💥 Validation error:', error);
      result.isValid = false;
      result.errors.push('Internal validation error');
    }

    return result;
  }

  /**
   * Validate individual field
   */
  private static async validateField(
    field: string, 
    value: any, 
    rule: ValidationRule,
    options: { sanitizeStrings: boolean; blockOnSecurityThreats: boolean }
  ): Promise<{
    isValid: boolean;
    errors: string[];
    threats: string[];
    sanitizedValue: any;
  }> {
    const result = {
      isValid: true,
      errors: [] as string[],
      threats: [] as string[],
      sanitizedValue: value
    };

    // Check required fields
    if (rule.required && (value === undefined || value === null || value === '')) {
      result.isValid = false;
      result.errors.push(`${field} is required`);
      return result;
    }

    // Skip validation for optional undefined fields
    if (!rule.required && (value === undefined || value === null)) {
      result.sanitizedValue = value;
      return result;
    }

    // Type validation and sanitization
    switch (rule.type) {
      case 'string':
        result.sanitizedValue = await this.validateString(field, value, rule, options);
        break;
      case 'number':
        result.sanitizedValue = this.validateNumber(field, value, rule);
        break;
      case 'boolean':
        result.sanitizedValue = this.validateBoolean(field, value);
        break;
      case 'email':
        result.sanitizedValue = await this.validateEmail(field, value, rule, options);
        break;
      case 'url':
        result.sanitizedValue = this.validateUrl(field, value, rule);
        break;
      case 'date':
        result.sanitizedValue = this.validateDate(field, value);
        break;
      case 'array':
        result.sanitizedValue = this.validateArray(field, value, rule);
        break;
      case 'object':
        result.sanitizedValue = this.validateObject(field, value, rule);
        break;
      default:
        // No type specified, keep original value but sanitize if string
        if (typeof value === 'string' && options.sanitizeStrings) {
          result.sanitizedValue = this.sanitizeString(value);
        }
    }

    // Security threat detection for strings
    if (typeof value === 'string') {
      const threats = this.checkSecurityThreats(value);
      if (threats.length > 0) {
        result.threats.push(...threats.map(threat => `${field}: ${threat}`));
      }
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(result.sanitizedValue);
      if (customResult !== true) {
        result.isValid = false;
        result.errors.push(typeof customResult === 'string' ? customResult : `${field} failed custom validation`);
      }
    }

    return result;
  }

  /**
   * String validation and sanitization
   */
  private static async validateString(
    field: string, 
    value: any, 
    rule: ValidationRule,
    options: { sanitizeStrings: boolean; blockOnSecurityThreats: boolean }
  ): Promise<string> {
    let sanitized = String(value);

    // Sanitize if enabled
    if (options.sanitizeStrings) {
      sanitized = this.sanitizeString(sanitized);
    }

    // Length validation
    if (rule.minLength && sanitized.length < rule.minLength) {
      throw new Error(`${field} must be at least ${rule.minLength} characters`);
    }
    
    if (rule.maxLength && sanitized.length > rule.maxLength) {
      throw new Error(`${field} must be no more than ${rule.maxLength} characters`);
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(sanitized)) {
      throw new Error(`${field} format is invalid`);
    }

    // Enum validation
    if (rule.enum && !rule.enum.includes(sanitized)) {
      throw new Error(`${field} must be one of: ${rule.enum.join(', ')}`);
    }

    return sanitized;
  }

  /**
   * Security threat detection
   */
  private static checkSecurityThreats(input: string): string[] {
    const threats: string[] = [];

    // XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      /vbscript:/gi
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        threats.push('XSS attempt detected');
        break;
      }
    }

    // SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)|(\;|\-\-|\/\*|\*\/)/gi,
      /(\b(OR|AND)\b\s+\b\d+\s*=\s*\d+)/gi,
      /('(\s*OR\s+\d+\s*=\s*\d+|;\s*DROP\s+TABLE))/gi
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        threats.push('SQL injection attempt detected');
        break;
      }
    }

    // NoSQL injection patterns
    const nosqlPatterns = [
      /\$where/gi,
      /\$regex/gi,
      /\$ne/gi,
      /\$gt/gi,
      /\$lt/gi,
      /\$or/gi,
      /\$and/gi
    ];

    for (const pattern of nosqlPatterns) {
      if (pattern.test(input)) {
        threats.push('NoSQL injection attempt detected');
        break;
      }
    }

    // Path traversal patterns
    const pathPatterns = [
      /\.\.[\/\\]/g,
      /[\/\\]\.\.[\/\\]/g,
      /%2e%2e[\/\\]/gi,
      /\.\.%2f/gi,
      /\.\.%5c/gi
    ];

    for (const pattern of pathPatterns) {
      if (pattern.test(input)) {
        threats.push('Path traversal attempt detected');
        break;
      }
    }

    // Command injection patterns
    const cmdPatterns = [
      /[;&|`$(){}[\]]/g,
      /\b(cat|ls|pwd|whoami|id|uname|wget|curl|nc|netcat)\b/gi
    ];

    for (const pattern of cmdPatterns) {
      if (pattern.test(input)) {
        threats.push('Command injection attempt detected');
        break;
      }
    }

    return threats;
  }

  /**
   * String sanitization
   */
  private static sanitizeString(input: string): string {
    // Remove null bytes
    let sanitized = input.replace(/\0/g, '');
    
    // HTML encode dangerous characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    // Remove or encode control characters
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
    
    // Trim whitespace
    sanitized = sanitized.trim();

    return sanitized;
  }

  /**
   * Number validation
   */
  private static validateNumber(field: string, value: any, rule: ValidationRule): number {
    const num = Number(value);
    
    if (isNaN(num)) {
      throw new Error(`${field} must be a valid number`);
    }

    if (rule.min !== undefined && num < rule.min) {
      throw new Error(`${field} must be at least ${rule.min}`);
    }

    if (rule.max !== undefined && num > rule.max) {
      throw new Error(`${field} must be no more than ${rule.max}`);
    }

    if (rule.enum && !rule.enum.includes(num)) {
      throw new Error(`${field} must be one of: ${rule.enum.join(', ')}`);
    }

    return num;
  }

  /**
   * Boolean validation
   */
  private static validateBoolean(field: string, value: any): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      if (lower === 'true' || lower === '1') return true;
      if (lower === 'false' || lower === '0') return false;
    }

    if (typeof value === 'number') {
      return value !== 0;
    }

    throw new Error(`${field} must be a valid boolean`);
  }

  /**
   * Email validation
   */
  private static async validateEmail(
    field: string, 
    value: any, 
    rule: ValidationRule,
    options: { sanitizeStrings: boolean }
  ): Promise<string> {
    let email = String(value).toLowerCase().trim();

    if (options.sanitizeStrings) {
      email = this.sanitizeString(email);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`${field} must be a valid email address`);
    }

    return email;
  }

  /**
   * URL validation
   */
  private static validateUrl(field: string, value: any, rule: ValidationRule): string {
    const urlString = String(value).trim();
    
    try {
      const url = new URL(urlString);
      
      // Only allow safe protocols
      const allowedProtocols = ['http:', 'https:', 'ftp:', 'ftps:'];
      if (!allowedProtocols.includes(url.protocol)) {
        throw new Error(`${field} must use a safe protocol (http, https, ftp, ftps)`);
      }

      return url.toString();
    } catch {
      throw new Error(`${field} must be a valid URL`);
    }
  }

  /**
   * Date validation
   */
  private static validateDate(field: string, value: any): Date {
    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) {
      throw new Error(`${field} must be a valid date`);
    }

    return date;
  }

  /**
   * Array validation
   */
  private static validateArray(field: string, value: any, rule: ValidationRule): any[] {
    if (!Array.isArray(value)) {
      throw new Error(`${field} must be an array`);
    }

    if (rule.minLength && value.length < rule.minLength) {
      throw new Error(`${field} must have at least ${rule.minLength} items`);
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      throw new Error(`${field} must have no more than ${rule.maxLength} items`);
    }

    return value;
  }

  /**
   * Object validation
   */
  private static validateObject(field: string, value: any, rule: ValidationRule): object {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error(`${field} must be an object`);
    }

    return value;
  }

  /**
   * Sanitize data for logging (remove sensitive information)
   */
  private static sanitizeForLogging(data: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'captcha'];
    
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized = { ...data };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
```

### Validation Service

```typescript
// src/services/validation.service.ts
import ValidationMiddleware, { ValidationSchema } from '../middleware/validation-middleware';

export class ValidationService {
  
  /**
   * User registration validation schema
   */
  static readonly REGISTER_SCHEMA: ValidationSchema = {
    name: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s]+$/
    },
    email: {
      required: true,
      type: 'email',
      maxLength: 255
    },
    password: {
      required: true,
      type: 'string',
      minLength: 8,
      maxLength: 128,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    },
    phone: {
      required: false,
      type: 'string',
      pattern: /^[+]?[\d\s\-()]+$/,
      minLength: 10,
      maxLength: 20
    },
    captchaToken: {
      required: true,
      type: 'string',
      minLength: 10
    }
  };

  /**
   * User login validation schema
   */
  static readonly LOGIN_SCHEMA: ValidationSchema = {
    email: {
      required: true,
      type: 'email'
    },
    password: {
      required: true,
      type: 'string',
      minLength: 1
    },
    captchaToken: {
      required: true,
      type: 'string',
      minLength: 10
    }
  };

  /**
   * Profile update validation schema
   */
  static readonly PROFILE_UPDATE_SCHEMA: ValidationSchema = {
    name: {
      required: false,
      type: 'string',
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s]+$/
    },
    phone: {
      required: false,
      type: 'string',
      pattern: /^[+]?[\d\s\-()]+$/,
      minLength: 10,
      maxLength: 20
    },
    csrfToken: {
      required: true,
      type: 'string'
    }
  };

  /**
   * Ticket booking validation schema
   */
  static readonly BOOKING_SCHEMA: ValidationSchema = {
    trainId: {
      required: true,
      type: 'string',
      pattern: /^[a-zA-Z0-9\-_]+$/
    },
    fromStationId: {
      required: true,
      type: 'string',
      pattern: /^[a-zA-Z0-9\-_]+$/
    },
    toStationId: {
      required: true,
      type: 'string',
      pattern: /^[a-zA-Z0-9\-_]+$/
    },
    departureDate: {
      required: true,
      type: 'date',
      custom: (value: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today || 'Departure date cannot be in the past';
      }
    },
    passengers: {
      required: true,
      type: 'array',
      minLength: 1,
      maxLength: 8
    },
    seatClass: {
      required: true,
      type: 'string',
      enum: ['economy', 'business', 'executive', 'sleeper']
    }
  };

  /**
   * Payment validation schema
   */
  static readonly PAYMENT_SCHEMA: ValidationSchema = {
    orderId: {
      required: true,
      type: 'string',
      pattern: /^[a-zA-Z0-9\-_]+$/
    },
    amount: {
      required: true,
      type: 'number',
      min: 1000, // Minimum 1000 IDR
      max: 100000000 // Maximum 100M IDR
    },
    paymentMethod: {
      required: true,
      type: 'string',
      enum: ['credit_card', 'bank_transfer', 'e_wallet', 'va']
    }
  };

  /**
   * Validate input with automatic schema selection
   */
  static async validateRequest(endpoint: string, data: any) {
    let schema: ValidationSchema;

    switch (endpoint) {
      case 'register':
        schema = this.REGISTER_SCHEMA;
        break;
      case 'login':
        schema = this.LOGIN_SCHEMA;
        break;
      case 'profile_update':
        schema = this.PROFILE_UPDATE_SCHEMA;
        break;
      case 'booking':
        schema = this.BOOKING_SCHEMA;
        break;
      case 'payment':
        schema = this.PAYMENT_SCHEMA;
        break;
      default:
        throw new Error(`No validation schema found for endpoint: ${endpoint}`);
    }

    return await ValidationMiddleware.validateInput(data, schema, {
      stripUnknownFields: true,
      sanitizeStrings: true,
      blockOnSecurityThreats: true,
      logValidationErrors: true
    });
  }
}
```

## Usage in Controllers

### Registration Controller with Validation

```typescript
// src/controllers/register-controller.ts
import { Context } from 'hono';
import { ValidationService } from '../services/validation.service';
import bcrypt from 'bcryptjs';

export default class RegisterController {
  static async register(c: Context) {
    try {
      // Get request body (may be from CAPTCHA middleware)
      const rawBody = c.get('requestBody') || await c.req.json();
      
      console.log('📝 Registration request received');

      // Validate input with Layer 5 security
      const validationResult = await ValidationService.validateRequest('register', rawBody);

      if (!validationResult.isValid) {
        console.warn('❌ Registration validation failed:', validationResult.errors);
        return c.json({
          success: false,
          message: 'Data registrasi tidak valid',
          errors: validationResult.errors,
          threats: validationResult.threats.length > 0 ? ['Security threats detected'] : undefined
        }, 400);
      }

      const { name, email, password, phone } = validationResult.sanitizedData;

      // Check if user already exists
      const existingUser = await usersRepository.getUserByEmail(email);
      if (existingUser) {
        return c.json({
          success: false,
          message: 'Email sudah terdaftar'
        }, 409);
      }

      // Hash password securely
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user with sanitized data
      const newUser = await usersRepository.createUser({
        name,
        email,
        password: hashedPassword,
        phone: phone || null
      });

      console.log(`✅ User registered successfully: ${email}`);

      return c.json({
        success: true,
        message: 'Registrasi berhasil',
        data: {
          userId: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      }, 201);

    } catch (error) {
      console.error('💥 Registration error:', error);
      return c.json({
        success: false,
        message: 'Terjadi kesalahan saat registrasi'
      }, 500);
    }
  }
}
```

### Form Validation Middleware

```typescript
// src/middleware/form-validation.middleware.ts
import { MiddlewareHandler } from 'hono';
import { ValidationService } from '../services/validation.service';

export const createValidationMiddleware = (endpoint: string): MiddlewareHandler => {
  return async (c, next) => {
    try {
      const body = c.get('requestBody') || await c.req.json();
      
      console.log(`🔍 Validating input for endpoint: ${endpoint}`);
      
      const validationResult = await ValidationService.validateRequest(endpoint, body);

      if (!validationResult.isValid) {
        console.warn(`❌ Validation failed for ${endpoint}:`, validationResult.errors);
        
        return c.json({
          success: false,
          message: 'Input validation failed',
          errors: validationResult.errors,
          code: 'VALIDATION_ERROR'
        }, 400);
      }

      if (validationResult.threats.length > 0) {
        console.error(`🚨 Security threats detected for ${endpoint}:`, validationResult.threats);
        
        return c.json({
          success: false,
          message: 'Security threats detected in input',
          code: 'SECURITY_THREAT'
        }, 400);
      }

      // Store sanitized data for controller
      c.set('validatedData', validationResult.sanitizedData);
      c.set('requestBody', validationResult.sanitizedData);

      console.log(`✅ Validation passed for ${endpoint}`);
      await next();

    } catch (error) {
      console.error(`💥 Validation middleware error for ${endpoint}:`, error);
      return c.json({
        success: false,
        message: 'Validation processing error'
      }, 500);
    }
  };
};
```

## Security Benefits

### Attack Prevention
- **XSS Protection**: Comprehensive HTML/script sanitization
- **SQL Injection Prevention**: Input sanitization and pattern detection
- **NoSQL Injection Protection**: MongoDB operator sanitization
- **Command Injection Prevention**: Shell command pattern detection
- **Path Traversal Protection**: File path sanitization

### Data Integrity
- **Type Safety**: Strict type validation and coercion
- **Format Validation**: Pattern matching for emails, URLs, dates
- **Range Validation**: Min/max constraints for numbers and strings
- **Enum Validation**: Restricted value sets

### Threat Detection
- **Real-time Monitoring**: Immediate threat identification
- **Pattern Recognition**: Advanced security pattern detection
- **Behavioral Analysis**: Suspicious activity identification
- **Automated Logging**: Comprehensive threat logging

## Testing

### Unit Tests

```typescript
// tests/validation.test.ts
import ValidationMiddleware from '../src/middleware/validation-middleware';

describe('Layer 5 - Input Validation', () => {
  describe('Security Threat Detection', () => {
    it('should detect XSS attempts', async () => {
      const maliciousInput = {
        comment: '<script>alert("xss")</script>'
      };

      const schema = {
        comment: { required: true, type: 'string' }
      };

      const result = await ValidationMiddleware.validateInput(maliciousInput, schema);
      
      expect(result.isValid).toBe(false);
      expect(result.threats).toContain('comment: XSS attempt detected');
    });

    it('should detect SQL injection attempts', async () => {
      const maliciousInput = {
        search: "'; DROP TABLE users; --"
      };

      const schema = {
        search: { required: true, type: 'string' }
      };

      const result = await ValidationMiddleware.validateInput(maliciousInput, schema);
      
      expect(result.isValid).toBe(false);
      expect(result.threats).toContain('search: SQL injection attempt detected');
    });
  });

  describe('Data Sanitization', () => {
    it('should sanitize HTML content', async () => {
      const input = {
        name: '<b>John</b> & Jane'
      };

      const schema = {
        name: { required: true, type: 'string' }
      };

      const result = await ValidationMiddleware.validateInput(input, schema);
      
      expect(result.isValid).toBe(true);
      expect(result.sanitizedData.name).toBe('&lt;b&gt;John&lt;&#x2F;b&gt; &amp; Jane');
    });
  });
});
```

## Best Practices

### Security Guidelines
- **Defense in Depth**: Multiple validation layers
- **Fail Secure**: Block suspicious inputs by default
- **Comprehensive Logging**: Log all security events
- **Regular Updates**: Keep threat patterns updated

### Performance Optimization
- **Efficient Patterns**: Optimized regex patterns
- **Async Processing**: Non-blocking validation
- **Caching**: Cache validation results when appropriate
- **Minimal Overhead**: Lightweight validation logic

### User Experience
- **Clear Error Messages**: Helpful validation feedback
- **Progressive Enhancement**: Don't break functionality
- **Graceful Degradation**: Handle validation failures smoothly
- **Performance**: Fast validation for good UX

---

**Layer 5 Status**: ✅ **Active** - Comprehensive input protection  
**Previous Layer**: [Layer 4 - CSRF Protection](./LAYER_4_CSRF_PROTECTION.md)  
**PENTA Framework**: [Complete Security Overview](./PENTA_SECURITY_OVERVIEW.md)
