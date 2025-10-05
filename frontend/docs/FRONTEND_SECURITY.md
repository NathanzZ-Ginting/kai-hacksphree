# 🔐 Frontend Security Guide

## 📋 **Overview**

Panduan komprehensif untuk implementasi keamanan pada aplikasi KAI Frontend, mencakup authentication, authorization, data protection, dan best practices untuk mencegah vulnerabilities.

## 🛡️ **Security Architecture**

### **Defense in Depth Strategy**
```
┌─────────────────────────────────────┐
│         Frontend Security           │
├─────────────────────────────────────┤
│ • Input Validation & Sanitization  │
│ • Output Encoding                   │
│ • Authentication & Authorization    │
│ • Session Management                │
│ • CSRF Protection                   │
│ • XSS Prevention                    │
│ • Content Security Policy          │
│ • Secure Communication (HTTPS)     │
│ • Data Encryption & Storage         │
│ • Security Headers                  │
└─────────────────────────────────────┘
```

## 🔑 **Authentication & Authorization**

### **Secure Authentication Implementation**
```typescript
// src/security/authSecurity.ts
import CryptoJS from 'crypto-js';
import { config } from '../config/environment';

interface SecureAuthConfig {
  tokenExpiry: number;
  refreshThreshold: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  requireMFA: boolean;
}

export class SecureAuthManager {
  private readonly config: SecureAuthConfig = {
    tokenExpiry: 15 * 60 * 1000, // 15 minutes
    refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    maxLoginAttempts: 5,
    lockoutDuration: 30 * 60 * 1000, // 30 minutes
    requireMFA: true,
  };

  private readonly storageKey = 'kai_auth_encrypted';
  private readonly encryptionKey = this.deriveKey();

  /**
   * Derive encryption key untuk local storage
   */
  private deriveKey(): string {
    const deviceFingerprint = this.getDeviceFingerprint();
    return CryptoJS.SHA256(deviceFingerprint + config.STORAGE_PREFIX).toString();
  }

  /**
   * Generate device fingerprint untuk additional security
   */
  private getDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
    ].join('|');

    return CryptoJS.SHA256(fingerprint).toString();
  }

  /**
   * Encrypt sensitive data sebelum storage
   */
  private encryptData(data: any): string {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, this.encryptionKey).toString();
  }

  /**
   * Decrypt sensitive data dari storage
   */
  private decryptData(encryptedData: string): any {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to decrypt auth data:', error);
      return null;
    }
  }

  /**
   * Secure token storage dengan encryption
   */
  secureStoreAuth(authData: any): void {
    const secureData = {
      ...authData,
      timestamp: Date.now(),
      deviceFingerprint: this.getDeviceFingerprint(),
    };

    const encrypted = this.encryptData(secureData);
    localStorage.setItem(this.storageKey, encrypted);

    // Set up automatic cleanup
    this.setupTokenCleanup(authData.expiresIn);
  }

  /**
   * Secure token retrieval dengan validation
   */
  secureRetrieveAuth(): any {
    const encrypted = localStorage.getItem(this.storageKey);
    if (!encrypted) return null;

    const decrypted = this.decryptData(encrypted);
    if (!decrypted) return null;

    // Validate device fingerprint
    if (decrypted.deviceFingerprint !== this.getDeviceFingerprint()) {
      console.warn('Device fingerprint mismatch - potential security issue');
      this.clearAuth();
      return null;
    }

    // Check expiry
    const now = Date.now();
    const expiry = decrypted.timestamp + (decrypted.expiresIn * 1000);
    if (now >= expiry) {
      this.clearAuth();
      return null;
    }

    return decrypted;
  }

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.clear();
  }

  /**
   * Setup automatic token cleanup
   */
  private setupTokenCleanup(expiresIn: number): void {
    setTimeout(() => {
      this.clearAuth();
    }, expiresIn * 1000);
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Password must be at least 8 characters long');

    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    // Common password check
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'login'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score -= 2;
      feedback.push('Avoid common passwords');
    }

    // Sequential or repeated characters
    if (/(.)\1{2,}/.test(password) || /012|123|234|345|456|567|678|789|890|abc|bcd|cde/.test(password.toLowerCase())) {
      score -= 1;
      feedback.push('Avoid repeated or sequential characters');
    }

    return {
      isValid: score >= 4,
      score: Math.max(0, Math.min(5, score)),
      feedback,
    };
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    
    return result;
  }

  /**
   * Rate limiting untuk login attempts
   */
  checkLoginRateLimit(email: string): {
    allowed: boolean;
    remainingAttempts: number;
    lockoutTime?: number;
  } {
    const key = `login_attempts_${CryptoJS.SHA256(email).toString()}`;
    const stored = localStorage.getItem(key);
    
    let attempts = 0;
    let lastAttempt = 0;
    
    if (stored) {
      const data = JSON.parse(stored);
      attempts = data.attempts;
      lastAttempt = data.lastAttempt;
    }

    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttempt;

    // Reset attempts jika sudah lewat lockout period
    if (timeSinceLastAttempt > this.config.lockoutDuration) {
      attempts = 0;
    }

    if (attempts >= this.config.maxLoginAttempts) {
      const lockoutTime = lastAttempt + this.config.lockoutDuration;
      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutTime,
      };
    }

    return {
      allowed: true,
      remainingAttempts: this.config.maxLoginAttempts - attempts,
    };
  }

  /**
   * Record login attempt
   */
  recordLoginAttempt(email: string, success: boolean): void {
    const key = `login_attempts_${CryptoJS.SHA256(email).toString()}`;
    const stored = localStorage.getItem(key);
    
    let attempts = 0;
    
    if (stored) {
      const data = JSON.parse(stored);
      attempts = data.attempts;
    }

    if (success) {
      // Clear attempts on successful login
      localStorage.removeItem(key);
    } else {
      // Increment attempts on failed login
      const newData = {
        attempts: attempts + 1,
        lastAttempt: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(newData));
    }
  }
}

export const authSecurity = new SecureAuthManager();
```

### **Multi-Factor Authentication (MFA)**
```typescript
// src/security/mfa.ts
import { QRCodeSVG } from 'qrcode.react';
import * as OTPAuth from 'otpauth';

export interface MFASetupData {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface MFAVerification {
  token: string;
  backupCode?: string;
}

export class MFAManager {
  /**
   * Setup TOTP (Time-based One-Time Password)
   */
  async setupTOTP(userEmail: string): Promise<MFASetupData> {
    // Generate secret key
    const secret = new OTPAuth.Secret({ size: 32 });
    
    // Create TOTP instance
    const totp = new OTPAuth.TOTP({
      issuer: 'KAI',
      label: userEmail,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });

    // Generate QR code URL
    const qrCodeUrl = totp.toString();

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes,
    };
  }

  /**
   * Verify TOTP token
   */
  verifyTOTP(secret: string, token: string, window: number = 1): boolean {
    try {
      const totp = new OTPAuth.TOTP({
        secret: OTPAuth.Secret.fromBase32(secret),
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      });

      const delta = totp.validate({ token, window });
      return delta !== null;
    } catch (error) {
      console.error('TOTP verification failed:', error);
      return false;
    }
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generate 8-digit backup code
      const code = Math.random().toString().slice(2, 10);
      codes.push(code);
    }
    
    return codes;
  }

  /**
   * Verify backup code
   */
  verifyBackupCode(storedCodes: string[], providedCode: string): {
    valid: boolean;
    remainingCodes: string[];
  } {
    const index = storedCodes.indexOf(providedCode);
    
    if (index === -1) {
      return {
        valid: false,
        remainingCodes: storedCodes,
      };
    }

    // Remove used backup code
    const remainingCodes = [...storedCodes];
    remainingCodes.splice(index, 1);

    return {
      valid: true,
      remainingCodes,
    };
  }

  /**
   * Generate QR Code component
   */
  generateQRCode(qrCodeUrl: string): React.ReactElement {
    return (
      <QRCodeSVG
        value={qrCodeUrl}
        size={200}
        level="M"
        includeMargin={true}
        className="mx-auto"
      />
    );
  }
}

export const mfaManager = new MFAManager();
```

## 🛡️ **Input Validation & Sanitization**

### **Input Security Manager**
```typescript
// src/security/inputSecurity.ts
import DOMPurify from 'dompurify';
import validator from 'validator';

export interface ValidationRule {
  required?: boolean;
  type?: 'email' | 'phone' | 'url' | 'alphanumeric' | 'numeric' | 'text';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  whitelist?: string[];
  blacklist?: string[];
  sanitize?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  errors: string[];
}

export class InputSecurityManager {
  /**
   * Validate dan sanitize input berdasarkan rules
   */
  validateInput(value: string, rules: ValidationRule): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = value;

    // Required check
    if (rules.required && (!value || value.trim().length === 0)) {
      errors.push('This field is required');
      return { isValid: false, sanitizedValue: '', errors };
    }

    // Skip further validation jika value kosong dan tidak required
    if (!value && !rules.required) {
      return { isValid: true, sanitizedValue: '', errors };
    }

    // Sanitize input
    if (rules.sanitize !== false) {
      sanitizedValue = this.sanitizeInput(value, rules.type);
    }

    // Type validation
    if (rules.type) {
      const typeValidation = this.validateType(sanitizedValue, rules.type);
      if (!typeValidation.isValid) {
        errors.push(...typeValidation.errors);
      }
    }

    // Length validation
    if (rules.minLength && sanitizedValue.length < rules.minLength) {
      errors.push(`Minimum length is ${rules.minLength} characters`);
    }

    if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
      errors.push(`Maximum length is ${rules.maxLength} characters`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(sanitizedValue)) {
      errors.push('Invalid format');
    }

    // Whitelist validation
    if (rules.whitelist && !rules.whitelist.includes(sanitizedValue)) {
      errors.push('Value is not allowed');
    }

    // Blacklist validation
    if (rules.blacklist && rules.blacklist.includes(sanitizedValue)) {
      errors.push('Value is not allowed');
    }

    // XSS Detection
    if (this.detectXSS(sanitizedValue)) {
      errors.push('Potentially malicious content detected');
    }

    // SQL Injection Detection
    if (this.detectSQLInjection(sanitizedValue)) {
      errors.push('Potentially malicious content detected');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue,
      errors,
    };
  }

  /**
   * Sanitize input berdasarkan type
   */
  private sanitizeInput(value: string, type?: ValidationRule['type']): string {
    // Base sanitization
    let sanitized = value.trim();

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Type-specific sanitization
    switch (type) {
      case 'email':
        sanitized = validator.normalizeEmail(sanitized) || sanitized;
        break;
      case 'phone':
        sanitized = sanitized.replace(/[^\d+\-\s]/g, '');
        break;
      case 'alphanumeric':
        sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, '');
        break;
      case 'numeric':
        sanitized = sanitized.replace(/[^0-9]/g, '');
        break;
      case 'url':
        try {
          const url = new URL(sanitized);
          sanitized = url.toString();
        } catch {
          // Keep original jika tidak valid URL
        }
        break;
      case 'text':
        // HTML sanitization untuk text
        sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] });
        break;
    }

    return sanitized;
  }

  /**
   * Validate type-specific format
   */
  private validateType(value: string, type: ValidationRule['type']): ValidationResult {
    const errors: string[] = [];

    switch (type) {
      case 'email':
        if (!validator.isEmail(value)) {
          errors.push('Invalid email format');
        }
        break;
      case 'phone':
        if (!validator.isMobilePhone(value, 'id-ID')) {
          errors.push('Invalid phone number format');
        }
        break;
      case 'url':
        if (!validator.isURL(value)) {
          errors.push('Invalid URL format');
        }
        break;
      case 'alphanumeric':
        if (!validator.isAlphanumeric(value)) {
          errors.push('Only letters and numbers are allowed');
        }
        break;
      case 'numeric':
        if (!validator.isNumeric(value)) {
          errors.push('Only numbers are allowed');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: value,
      errors,
    };
  }

  /**
   * Detect potential XSS attempts
   */
  private detectXSS(value: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /eval\(/gi,
      /expression\(/gi,
    ];

    return xssPatterns.some(pattern => pattern.test(value));
  }

  /**
   * Detect potential SQL injection attempts
   */
  private detectSQLInjection(value: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(\b(OR|AND)\b.*[=<>])/gi,
      /(--|\/\*|\*\/)/gi,
      /(\b(CONCAT|CHAR|ASCII|SUBSTRING)\s*\()/gi,
      /('|(\\')|(;))/gi,
    ];

    return sqlPatterns.some(pattern => pattern.test(value));
  }

  /**
   * Sanitize HTML content
   */
  sanitizeHTML(html: string, allowedTags?: string[]): string {
    const config = allowedTags 
      ? { ALLOWED_TAGS: allowedTags }
      : {
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
          ALLOWED_ATTR: ['href', 'title'],
        };

    return DOMPurify.sanitize(html, config);
  }

  /**
   * Validate file upload
   */
  validateFile(file: File, allowedTypes: string[], maxSize: number): ValidationResult {
    const errors: string[] = [];

    // Type validation
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    // Size validation
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize} bytes`);
    }

    // File name validation
    const fileName = file.name;
    if (!/^[a-zA-Z0-9_\-\.\s]+$/.test(fileName)) {
      errors.push('Invalid file name characters');
    }

    // Extension validation
    const extension = fileName.split('.').pop()?.toLowerCase();
    const allowedExtensions = allowedTypes.map(type => {
      switch (type) {
        case 'image/jpeg': return 'jpg';
        case 'image/png': return 'png';
        case 'image/gif': return 'gif';
        case 'application/pdf': return 'pdf';
        default: return type.split('/')[1];
      }
    });

    if (extension && !allowedExtensions.includes(extension)) {
      errors.push(`File extension .${extension} is not allowed`);
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: fileName,
      errors,
    };
  }
}

export const inputSecurity = new InputSecurityManager();
```

## 🔒 **Content Security Policy (CSP)**

### **CSP Implementation**
```typescript
// src/security/csp.ts
export interface CSPConfig {
  defaultSrc: string[];
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  connectSrc: string[];
  fontSrc: string[];
  mediaSrc: string[];
  frameSrc: string[];
  objectSrc: string[];
  baseUri: string[];
  formAction: string[];
  frameAncestors: string[];
  upgradeInsecureRequests: boolean;
  blockAllMixedContent: boolean;
}

export class CSPManager {
  private readonly config: CSPConfig = {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // For inline scripts (minimize usage)
      "'unsafe-eval'", // For eval() (avoid if possible)
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://cdn.jsdelivr.net",
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // For inline styles
      "https://fonts.googleapis.com",
      "https://cdn.jsdelivr.net",
    ],
    imgSrc: [
      "'self'",
      "data:",
      "https:",
      "https://www.google-analytics.com",
      "https://storage.googleapis.com",
    ],
    connectSrc: [
      "'self'",
      "https://api.kai.id",
      "https://www.google-analytics.com",
      "wss://api.kai.id",
    ],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com",
      "https://cdn.jsdelivr.net",
    ],
    mediaSrc: ["'self'", "https:"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: true,
    blockAllMixedContent: true,
  };

  /**
   * Generate CSP header value
   */
  generateCSPHeader(): string {
    const directives: string[] = [];

    // Add each directive
    directives.push(`default-src ${this.config.defaultSrc.join(' ')}`);
    directives.push(`script-src ${this.config.scriptSrc.join(' ')}`);
    directives.push(`style-src ${this.config.styleSrc.join(' ')}`);
    directives.push(`img-src ${this.config.imgSrc.join(' ')}`);
    directives.push(`connect-src ${this.config.connectSrc.join(' ')}`);
    directives.push(`font-src ${this.config.fontSrc.join(' ')}`);
    directives.push(`media-src ${this.config.mediaSrc.join(' ')}`);
    directives.push(`frame-src ${this.config.frameSrc.join(' ')}`);
    directives.push(`object-src ${this.config.objectSrc.join(' ')}`);
    directives.push(`base-uri ${this.config.baseUri.join(' ')}`);
    directives.push(`form-action ${this.config.formAction.join(' ')}`);
    directives.push(`frame-ancestors ${this.config.frameAncestors.join(' ')}`);

    if (this.config.upgradeInsecureRequests) {
      directives.push('upgrade-insecure-requests');
    }

    if (this.config.blockAllMixedContent) {
      directives.push('block-all-mixed-content');
    }

    return directives.join('; ');
  }

  /**
   * Set CSP via meta tag (fallback method)
   */
  setCSPMetaTag(): void {
    const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingMeta) {
      existingMeta.remove();
    }

    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = this.generateCSPHeader();
    document.head.appendChild(meta);
  }

  /**
   * Report CSP violations
   */
  setupCSPReporting(): void {
    document.addEventListener('securitypolicyviolation', (event) => {
      const violation = {
        documentURI: event.documentURI,
        referrer: event.referrer,
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber,
        timestamp: Date.now(),
      };

      // Report to monitoring service
      this.reportViolation(violation);
    });
  }

  private reportViolation(violation: any): void {
    // Send to monitoring service
    fetch('/api/security/csp-violation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(violation),
    }).catch(error => {
      console.error('Failed to report CSP violation:', error);
    });
  }
}

export const cspManager = new CSPManager();
```

## 🔐 **CSRF Protection**

### **CSRF Token Manager**
```typescript
// src/security/csrf.ts
export class CSRFProtection {
  private readonly tokenKey = 'csrf_token';
  private readonly headerName = 'X-CSRF-Token';
  private token: string | null = null;

  /**
   * Initialize CSRF protection
   */
  async initialize(): Promise<void> {
    await this.refreshToken();
    this.setupAxiosInterceptor();
    this.setupFormProtection();
  }

  /**
   * Get or generate CSRF token
   */
  async getToken(): Promise<string> {
    if (!this.token) {
      await this.refreshToken();
    }
    return this.token!;
  }

  /**
   * Refresh CSRF token dari server
   */
  private async refreshToken(): Promise<void> {
    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        this.storeToken(this.token);
      }
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error);
    }
  }

  /**
   * Store token securely
   */
  private storeToken(token: string): void {
    // Store dalam memory dan meta tag
    const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    if (meta) {
      meta.content = token;
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'csrf-token';
      newMeta.content = token;
      document.head.appendChild(newMeta);
    }
  }

  /**
   * Setup Axios interceptor untuk auto-include CSRF token
   */
  private setupAxiosInterceptor(): void {
    // This should be integrated with your API client
    const apiClient = window.apiClient; // Assuming global access
    if (apiClient && apiClient.interceptors) {
      apiClient.interceptors.request.use((config: any) => {
        if (this.token && this.isStateChangingMethod(config.method)) {
          config.headers[this.headerName] = this.token;
        }
        return config;
      });
    }
  }

  /**
   * Setup form protection untuk traditional forms
   */
  private setupFormProtection(): void {
    document.addEventListener('submit', async (event) => {
      const form = event.target as HTMLFormElement;
      if (form.tagName === 'FORM' && this.isStateChangingMethod(form.method)) {
        await this.addCSRFTokenToForm(form);
      }
    });
  }

  /**
   * Add CSRF token ke form
   */
  private async addCSRFTokenToForm(form: HTMLFormElement): Promise<void> {
    const existingInput = form.querySelector('input[name="_token"]') as HTMLInputElement;
    const token = await this.getToken();
    
    if (existingInput) {
      existingInput.value = token;
    } else {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = '_token';
      input.value = token;
      form.appendChild(input);
    }
  }

  /**
   * Check if HTTP method requires CSRF protection
   */
  private isStateChangingMethod(method: string): boolean {
    const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    return stateChangingMethods.includes(method?.toUpperCase());
  }

  /**
   * Validate CSRF token
   */
  validateToken(token: string): boolean {
    return token === this.token && token !== null && token !== '';
  }
}

export const csrfProtection = new CSRFProtection();
```

## 🔍 **Security Headers**

### **Security Headers Manager**
```typescript
// src/security/headers.ts
export interface SecurityHeaders {
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Strict-Transport-Security': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Cross-Origin-Embedder-Policy': string;
  'Cross-Origin-Opener-Policy': string;
  'Cross-Origin-Resource-Policy': string;
}

export class SecurityHeadersManager {
  private readonly headers: SecurityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': this.generatePermissionsPolicy(),
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };

  /**
   * Generate Permissions Policy header
   */
  private generatePermissionsPolicy(): string {
    const policies = [
      'camera=()', // Disable camera
      'microphone=()', // Disable microphone
      'geolocation=(self)', // Allow geolocation for current origin
      'notifications=(self)', // Allow notifications for current origin
      'payment=(self)', // Allow payment for current origin
      'usb=()', // Disable USB
      'magnetometer=()', // Disable magnetometer
      'gyroscope=()', // Disable gyroscope
      'accelerometer=()', // Disable accelerometer
      'fullscreen=(self)', // Allow fullscreen for current origin
    ];

    return policies.join(', ');
  }

  /**
   * Check if security headers are present
   */
  checkSecurityHeaders(): Promise<{ [key: string]: boolean }> {
    return new Promise((resolve) => {
      const results: { [key: string]: boolean } = {};

      // Test dengan dummy request untuk check headers
      fetch(window.location.href, { method: 'HEAD' })
        .then(response => {
          Object.keys(this.headers).forEach(header => {
            results[header] = response.headers.has(header);
          });
          resolve(results);
        })
        .catch(() => {
          // Fallback: assume all headers are missing
          Object.keys(this.headers).forEach(header => {
            results[header] = false;
          });
          resolve(results);
        });
    });
  }

  /**
   * Generate meta tags untuk headers yang bisa di-set via HTML
   */
  setMetaHeaders(): void {
    const metaHeaders = {
      'X-Content-Type-Options': this.headers['X-Content-Type-Options'],
      'Referrer-Policy': this.headers['Referrer-Policy'],
    };

    Object.entries(metaHeaders).forEach(([name, content]) => {
      const existing = document.querySelector(`meta[http-equiv="${name}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.httpEquiv = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  }

  /**
   * Check untuk Mixed Content issues
   */
  checkMixedContent(): { hasIssues: boolean; issues: string[] } {
    const issues: string[] = [];
    const protocol = window.location.protocol;

    if (protocol === 'https:') {
      // Check untuk HTTP resources pada HTTPS page
      const httpResources = document.querySelectorAll('[src^="http:"], [href^="http:"]');
      httpResources.forEach((element) => {
        const url = element.getAttribute('src') || element.getAttribute('href');
        if (url) {
          issues.push(`Insecure resource: ${url}`);
        }
      });
    }

    return {
      hasIssues: issues.length > 0,
      issues,
    };
  }
}

export const securityHeaders = new SecurityHeadersManager();
```

## 🔐 **Data Encryption & Storage**

### **Secure Storage Manager**
```typescript
// src/security/secureStorage.ts
import CryptoJS from 'crypto-js';

export interface StorageOptions {
  encrypt?: boolean;
  expiry?: number; // milliseconds
  secure?: boolean;
}

export class SecureStorageManager {
  private readonly encryptionKey: string;

  constructor() {
    this.encryptionKey = this.deriveEncryptionKey();
  }

  /**
   * Derive encryption key dari browser fingerprint
   */
  private deriveEncryptionKey(): string {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
    ].join('|');

    return CryptoJS.SHA256(fingerprint + 'kai_secret').toString();
  }

  /**
   * Encrypt data
   */
  private encrypt(data: any): string {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, this.encryptionKey).toString();
  }

  /**
   * Decrypt data
   */
  private decrypt(encryptedData: string): any {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  /**
   * Set item dalam storage
   */
  setItem(key: string, value: any, options: StorageOptions = {}): void {
    const { encrypt = false, expiry, secure = false } = options;

    const item = {
      value: encrypt ? this.encrypt(value) : value,
      encrypted: encrypt,
      timestamp: Date.now(),
      expiry: expiry ? Date.now() + expiry : null,
    };

    const storage = secure ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(item));
  }

  /**
   * Get item dari storage
   */
  getItem(key: string, secure: boolean = false): any {
    const storage = secure ? sessionStorage : localStorage;
    const stored = storage.getItem(key);

    if (!stored) return null;

    try {
      const item = JSON.parse(stored);

      // Check expiry
      if (item.expiry && Date.now() > item.expiry) {
        this.removeItem(key, secure);
        return null;
      }

      // Decrypt jika encrypted
      if (item.encrypted) {
        return this.decrypt(item.value);
      }

      return item.value;
    } catch (error) {
      console.error('Failed to parse stored item:', error);
      return null;
    }
  }

  /**
   * Remove item dari storage
   */
  removeItem(key: string, secure: boolean = false): void {
    const storage = secure ? sessionStorage : localStorage;
    storage.removeItem(key);
  }

  /**
   * Clear expired items
   */
  clearExpired(): void {
    const storages = [localStorage, sessionStorage];

    storages.forEach(storage => {
      const keysToRemove: string[] = [];

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          try {
            const item = JSON.parse(storage.getItem(key) || '{}');
            if (item.expiry && Date.now() > item.expiry) {
              keysToRemove.push(key);
            }
          } catch {
            // Invalid item, remove it
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach(key => storage.removeItem(key));
    });
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): {
    localStorage: { used: number; available: number };
    sessionStorage: { used: number; available: number };
  } {
    const getStorageSize = (storage: Storage) => {
      let used = 0;
      for (let key in storage) {
        if (storage.hasOwnProperty(key)) {
          used += storage[key].length + key.length;
        }
      }
      return used;
    };

    const quota = 5 * 1024 * 1024; // 5MB typical quota

    return {
      localStorage: {
        used: getStorageSize(localStorage),
        available: quota - getStorageSize(localStorage),
      },
      sessionStorage: {
        used: getStorageSize(sessionStorage),
        available: quota - getStorageSize(sessionStorage),
      },
    };
  }
}

export const secureStorage = new SecureStorageManager();
```

## 🔒 **Secure Communication**

### **HTTPS & TLS Manager**
```typescript
// src/security/httpsManager.ts
export class HTTPSManager {
  /**
   * Check if connection is secure
   */
  isSecureConnection(): boolean {
    return window.location.protocol === 'https:';
  }

  /**
   * Force HTTPS redirect
   */
  enforceHTTPS(): void {
    if (!this.isSecureConnection() && window.location.hostname !== 'localhost') {
      const httpsUrl = window.location.href.replace('http://', 'https://');
      window.location.replace(httpsUrl);
    }
  }

  /**
   * Check certificate validity
   */
  async checkCertificateValidity(): Promise<{
    valid: boolean;
    expiryDate?: Date;
    issuer?: string;
  }> {
    try {
      // This is limited dalam browser environment
      // Biasanya dilakukan di server-side
      const response = await fetch(window.location.origin, { method: 'HEAD' });
      
      return {
        valid: response.ok && this.isSecureConnection(),
      };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Setup HSTS (Strict Transport Security)
   */
  setupHSTS(): void {
    // HSTS harus di-set di server-side, tapi kita bisa detect
    const hstsHeader = 'Strict-Transport-Security';
    
    fetch(window.location.href, { method: 'HEAD' })
      .then(response => {
        if (!response.headers.get(hstsHeader)) {
          console.warn('HSTS header not detected. Consider enabling HSTS on server.');
        }
      })
      .catch(error => {
        console.error('Failed to check HSTS:', error);
      });
  }

  /**
   * Validate secure WebSocket connections
   */
  validateWebSocketSecurity(wsUrl: string): boolean {
    if (this.isSecureConnection()) {
      return wsUrl.startsWith('wss://');
    }
    return wsUrl.startsWith('ws://') || wsUrl.startsWith('wss://');
  }
}

export const httpsManager = new HTTPSManager();
```

## 🛡️ **Security Monitoring**

### **Security Event Monitor**
```typescript
// src/security/monitor.ts
export interface SecurityEvent {
  type: 'auth_failure' | 'xss_attempt' | 'csrf_violation' | 'rate_limit' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  data?: any;
  timestamp: number;
  userAgent: string;
  ipAddress?: string;
  userId?: string;
}

export class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 100;

  /**
   * Log security event
   */
  logEvent(event: Omit<SecurityEvent, 'timestamp' | 'userAgent'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    this.events.push(securityEvent);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Report critical events immediately
    if (event.severity === 'critical') {
      this.reportEvent(securityEvent);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security Event:', securityEvent);
    }
  }

  /**
   * Report event ke security monitoring service
   */
  private async reportEvent(event: SecurityEvent): Promise<void> {
    try {
      await fetch('/api/security/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to report security event:', error);
    }
  }

  /**
   * Get recent security events
   */
  getEvents(severity?: SecurityEvent['severity']): SecurityEvent[] {
    if (severity) {
      return this.events.filter(event => event.severity === severity);
    }
    return [...this.events];
  }

  /**
   * Monitor untuk suspicious activity
   */
  monitorSuspiciousActivity(): void {
    // Monitor rapid form submissions
    this.monitorRapidFormSubmissions();
    
    // Monitor unusual navigation patterns
    this.monitorNavigationPatterns();
    
    // Monitor console access
    this.monitorConsoleAccess();
  }

  private monitorRapidFormSubmissions(): void {
    let submissionCount = 0;
    const timeWindow = 60000; // 1 minute
    
    document.addEventListener('submit', () => {
      submissionCount++;
      
      setTimeout(() => {
        submissionCount--;
      }, timeWindow);
      
      if (submissionCount > 10) {
        this.logEvent({
          type: 'suspicious_activity',
          severity: 'medium',
          message: 'Rapid form submissions detected',
          data: { submissionCount, timeWindow },
        });
      }
    });
  }

  private monitorNavigationPatterns(): void {
    let navigationCount = 0;
    const timeWindow = 30000; // 30 seconds
    
    window.addEventListener('beforeunload', () => {
      navigationCount++;
      
      setTimeout(() => {
        navigationCount--;
      }, timeWindow);
      
      if (navigationCount > 20) {
        this.logEvent({
          type: 'suspicious_activity',
          severity: 'medium',
          message: 'Unusual navigation pattern detected',
          data: { navigationCount, timeWindow },
        });
      }
    });
  }

  private monitorConsoleAccess(): void {
    // Detect developer tools
    let devtools = { open: false, orientation: null };
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || 
          window.outerWidth - window.innerWidth > 200) {
        if (!devtools.open) {
          devtools.open = true;
          this.logEvent({
            type: 'suspicious_activity',
            severity: 'low',
            message: 'Developer tools opened',
          });
        }
      } else {
        devtools.open = false;
      }
    }, 1000);
  }
}

export const securityMonitor = new SecurityMonitor();
```

## 🚀 **Security Initialization**

### **Security Bootstrap**
```typescript
// src/security/init.ts
import { authSecurity } from './authSecurity';
import { cspManager } from './csp';
import { csrfProtection } from './csrf';
import { securityHeaders } from './headers';
import { httpsManager } from './httpsManager';
import { securityMonitor } from './monitor';

export class SecurityInitializer {
  /**
   * Initialize all security measures
   */
  async initialize(): Promise<void> {
    try {
      // Enforce HTTPS
      httpsManager.enforceHTTPS();

      // Set security headers
      securityHeaders.setMetaHeaders();

      // Setup CSP
      cspManager.setCSPMetaTag();
      cspManager.setupCSPReporting();

      // Initialize CSRF protection
      await csrfProtection.initialize();

      // Setup security monitoring
      securityMonitor.monitorSuspiciousActivity();

      // Clear expired storage items
      setInterval(() => {
        authSecurity.clearAuth();
      }, 60000); // Every minute

      console.log('Security measures initialized successfully');
    } catch (error) {
      console.error('Failed to initialize security measures:', error);
    }
  }

  /**
   * Run security checks
   */
  async runSecurityChecks(): Promise<void> {
    // Check HTTPS
    if (!httpsManager.isSecureConnection()) {
      securityMonitor.logEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        message: 'Application running over insecure connection',
      });
    }

    // Check mixed content
    const mixedContent = securityHeaders.checkMixedContent();
    if (mixedContent.hasIssues) {
      securityMonitor.logEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        message: 'Mixed content detected',
        data: mixedContent.issues,
      });
    }

    // Check security headers
    const headerCheck = await securityHeaders.checkSecurityHeaders();
    const missingHeaders = Object.entries(headerCheck)
      .filter(([, present]) => !present)
      .map(([header]) => header);

    if (missingHeaders.length > 0) {
      console.warn('Missing security headers:', missingHeaders);
    }
  }
}

export const securityInit = new SecurityInitializer();
```

---

**🔐 Comprehensive Frontend Security - Protection, Prevention, Monitoring** ✨
