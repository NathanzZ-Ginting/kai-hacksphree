/**
 * 🛡️ INPUT VALIDATION & SANITIZATION UTILITIES
 * Layer 5 Security: Validation & Sanitization untuk KAI Authentication
 * 
 * Features:
 * - Regex-based input validation untuk semua field types
 * - Indonesian-specific validations (KTP, phone numbers)
 * - Password strength validation
 * - SQL injection prevention
 * - Comprehensive sanitization
 */

// ===========================================
// 📋 VALIDATION REGEX PATTERNS
// ===========================================

export const ValidationPatterns = {
  // Basic patterns
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  username: /^[a-zA-Z0-9_]{3,30}$/,
  name: /^[a-zA-ZÀ-ÿ\u0100-\u017F\u1E00-\u1EFF\s'-]{2,50}$/,
  
  // Indonesian-specific patterns
  phoneIndonesia: /^(\+62|62|0)[0-9]{8,13}$/,  // Indonesian phone numbers
  
  // Password patterns (minimum 8 chars, 1 upper, 1 lower, 1 number)
  passwordStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,128}$/,
  passwordMedium: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,128}$/,
  
  // Special validation patterns
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^[0-9]+$/,
  alphabetic: /^[a-zA-Z\s]+$/,
  
  // Security patterns (detect malicious input)
  sqlInjection: /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
  xssAttempt: /(<script[^>]*>.*?<\/script>|javascript:|on\w+\s*=|<iframe|<object|<embed)/i,
  
  // File upload patterns
  imageExtension: /\.(jpg|jpeg|png|gif|webp)$/i,
  documentExtension: /\.(pdf|doc|docx|txt)$/i,
};

// ===========================================
// 🔍 VALIDATION FUNCTIONS
// ===========================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: string;
}

export class InputValidator {
  
  /**
   * Validate email address
   */
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push("Email wajib diisi");
      return { isValid: false, errors };
    }
    
    if (email.length > 254) {
      errors.push("Email terlalu panjang (maksimal 254 karakter)");
    }
    
    if (!ValidationPatterns.email.test(email)) {
      errors.push("Format email tidak valid");
    }
    
    if (InputValidator.containsMaliciousContent(email)) {
      errors.push("Email mengandung karakter berbahaya");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: email.toLowerCase().trim()
    };
  }
  
  /**
   * Validate username
   */
  static validateUsername(username: string): ValidationResult {
    const errors: string[] = [];
    
    if (!username) {
      errors.push("Username wajib diisi");
      return { isValid: false, errors };
    }
    
    if (username.length < 3) {
      errors.push("Username minimal 3 karakter");
    }
    
    if (username.length > 30) {
      errors.push("Username maksimal 30 karakter");
    }
    
    if (!ValidationPatterns.username.test(username)) {
      errors.push("Username hanya boleh mengandung huruf, angka, dan underscore");
    }
    
    if (InputValidator.containsMaliciousContent(username)) {
      errors.push("Username mengandung karakter berbahaya");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: username.toLowerCase().trim()
    };
  }
  
  /**
   * Validate full name
   */
  static validateName(name: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name) {
      errors.push("Nama wajib diisi");
      return { isValid: false, errors };
    }
    
    if (name.length < 2) {
      errors.push("Nama minimal 2 karakter");
    }
    
    if (name.length > 50) {
      errors.push("Nama maksimal 50 karakter");
    }
    
    if (!ValidationPatterns.name.test(name)) {
      errors.push("Nama hanya boleh mengandung huruf, spasi, tanda petik, dan dash");
    }
    
    if (InputValidator.containsMaliciousContent(name)) {
      errors.push("Nama mengandung karakter berbahaya");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: name.trim()
    };
  }
  
  /**
   * Validate Indonesian phone number
   */
  static validatePhoneIndonesia(phone: string): ValidationResult {
    const errors: string[] = [];
    
    if (!phone) {
      errors.push("Nomor telepon wajib diisi");
      return { isValid: false, errors };
    }
    
    // Remove spaces and dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    if (!ValidationPatterns.phoneIndonesia.test(cleanPhone)) {
      errors.push("Format nomor telepon Indonesia tidak valid (contoh: 08123456789 atau +6281234567890)");
    }
    
    if (InputValidator.containsMaliciousContent(phone)) {
      errors.push("Nomor telepon mengandung karakter berbahaya");
    }
    
    // Normalize to +62 format
    let normalized = cleanPhone;
    if (normalized.startsWith('0')) {
      normalized = '+62' + normalized.substring(1);
    } else if (normalized.startsWith('62')) {
      normalized = '+' + normalized;
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: normalized
    };
  }
  
  /**
   * Validate password strength
   */
  static validatePassword(password: string, level: 'strong' | 'medium' = 'strong'): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push("Password wajib diisi");
      return { isValid: false, errors };
    }
    
    if (password.length < (level === 'strong' ? 8 : 6)) {
      errors.push(`Password minimal ${level === 'strong' ? 8 : 6} karakter`);
    }
    
    if (password.length > 128) {
      errors.push("Password maksimal 128 karakter");
    }
    
    const pattern = level === 'strong' ? ValidationPatterns.passwordStrong : ValidationPatterns.passwordMedium;
    
    if (!pattern.test(password)) {
      if (level === 'strong') {
        errors.push("Password harus mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka");
      } else {
        errors.push("Password harus mengandung minimal 1 huruf dan 1 angka");
      }
    }
    
    // Check for common weak passwords
    const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'user', 'login'];
    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push("Password terlalu lemah, pilih password yang lebih unik");
    }
    
    if (InputValidator.containsMaliciousContent(password)) {
      errors.push("Password mengandung karakter berbahaya");
    }
    
    return {
      isValid: errors.length === 0,
      errors
      // Note: Don't return sanitized password for security
    };
  }
  
  /**
   * Validate general text input (descriptions, comments, etc.)
   */
  static validateText(text: string, minLength = 1, maxLength = 1000): ValidationResult {
    const errors: string[] = [];
    
    if (!text || text.trim().length === 0) {
      errors.push("Text wajib diisi");
      return { isValid: false, errors };
    }
    
    if (text.length < minLength) {
      errors.push(`Text minimal ${minLength} karakter`);
    }
    
    if (text.length > maxLength) {
      errors.push(`Text maksimal ${maxLength} karakter`);
    }
    
    if (InputValidator.containsMaliciousContent(text)) {
      errors.push("Text mengandung karakter berbahaya");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: text.trim()
    };
  }
  
  /**
   * Check for malicious content (SQL injection, XSS attempts)
   */
  static containsMaliciousContent(input: string): boolean {
    return ValidationPatterns.sqlInjection.test(input) || 
           ValidationPatterns.xssAttempt.test(input);
  }
  
  /**
   * Validate multiple fields at once
   */
  static validateFields(fields: Record<string, any>, validationRules: Record<string, Function>): {
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitized: Record<string, any>;
  } {
    const errors: Record<string, string[]> = {};
    const sanitized: Record<string, any> = {};
    
    for (const [fieldName, value] of Object.entries(fields)) {
      if (validationRules[fieldName]) {
        const result = validationRules[fieldName](value);
        
        if (!result.isValid) {
          errors[fieldName] = result.errors;
        }
        
        if (result.sanitized !== undefined) {
          sanitized[fieldName] = result.sanitized;
        } else {
          sanitized[fieldName] = value;
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitized
    };
  }
}

// ===========================================
// 📚 VALIDATION RULE PRESETS
// ===========================================

export const ValidationRules = {
  // User registration validation
  registration: {
    email: InputValidator.validateEmail,
    username: InputValidator.validateUsername,
    name: InputValidator.validateName,
    password: (password: string) => InputValidator.validatePassword(password, 'strong'),
    phone: InputValidator.validatePhoneIndonesia
  },
  
  // User login validation
  login: {
    email: InputValidator.validateEmail,
    password: (password: string) => InputValidator.validatePassword(password, 'medium')
  },
  
  // Profile update validation
  profileUpdate: {
    name: InputValidator.validateName,
    phone: InputValidator.validatePhoneIndonesia,
    email: InputValidator.validateEmail
  },
  
  // Password change validation
  passwordChange: {
    currentPassword: (password: string) => InputValidator.validatePassword(password, 'medium'),
    newPassword: (password: string) => InputValidator.validatePassword(password, 'strong')
  }
};

// ===========================================
// 🔒 SECURITY VALIDATION HELPERS
// ===========================================

export class SecurityValidator {
  
  /**
   * Check if input contains potential security threats
   */
  static checkSecurityThreats(input: string): {
    hasSQLInjection: boolean;
    hasXSSAttempt: boolean;
    threats: string[];
  } {
    const threats: string[] = [];
    
    const hasSQLInjection = ValidationPatterns.sqlInjection.test(input);
    const hasXSSAttempt = ValidationPatterns.xssAttempt.test(input);
    
    if (hasSQLInjection) {
      threats.push('Potential SQL Injection detected');
    }
    
    if (hasXSSAttempt) {
      threats.push('Potential XSS attempt detected');
    }
    
    return {
      hasSQLInjection,
      hasXSSAttempt,
      threats
    };
  }
  
  /**
   * Validate file upload
   */
  static validateFileUpload(filename: string, allowedTypes: 'image' | 'document' | 'both' = 'both'): ValidationResult {
    const errors: string[] = [];
    
    if (!filename) {
      errors.push("Nama file wajib ada");
      return { isValid: false, errors };
    }
    
    // Check for directory traversal attempts
    if (filename.includes('../') || filename.includes('..\\')) {
      errors.push("Nama file tidak valid - path traversal detected");
    }
    
    // Check file extension
    let validExtension = false;
    
    if (allowedTypes === 'image' || allowedTypes === 'both') {
      validExtension = validExtension || ValidationPatterns.imageExtension.test(filename);
    }
    
    if (allowedTypes === 'document' || allowedTypes === 'both') {
      validExtension = validExtension || ValidationPatterns.documentExtension.test(filename);
    }
    
    if (!validExtension) {
      errors.push(`Ekstensi file tidak diizinkan untuk tipe ${allowedTypes}`);
    }
    
    if (InputValidator.containsMaliciousContent(filename)) {
      errors.push("Nama file mengandung karakter berbahaya");
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: filename.toLowerCase().trim()
    };
  }
}

export default InputValidator;
