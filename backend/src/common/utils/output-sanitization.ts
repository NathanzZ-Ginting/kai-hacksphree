/**
 * 🧹 OUTPUT SANITIZATION UTILITIES
 * Layer 5 Security: Output Sanitization untuk mencegah XSS attacks
 * 
 * Features:
 * - HTML escaping untuk prevent XSS
 * - SQL sanitization untuk prevent injection
 * - JSON sanitization untuk safe output
 * - URL encoding untuk safe redirects
 * - Content filtering untuk malicious content
 */

// ===========================================
// 🔒 HTML ESCAPING & XSS PREVENTION
// ===========================================

export class OutputSanitizer {
  
  /**
   * Escape HTML characters to prevent XSS attacks
   */
  static escapeHTML(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
      '\\': '&#x5C;',
      '`': '&#96;'
    };
    
    return input.replace(/[&<>"'\/\\`]/g, (match) => htmlEntities[match] || match);
  }
  
  /**
   * Unescape HTML entities (use with caution)
   */
  static unescapeHTML(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    const htmlEntities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#x5C;': '\\',
      '&#96;': '`'
    };
    
    return input.replace(/&(amp|lt|gt|quot|#x27|#x2F|#x5C|#96);/g, (match) => htmlEntities[match] || match);
  }
  
  /**
   * Remove all HTML tags (aggressive sanitization)
   */
  static stripHTML(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    // Remove HTML tags
    return input.replace(/<[^>]*>/g, '');
  }
  
  /**
   * Sanitize for safe HTML display (escape + remove dangerous tags)
   */
  static sanitizeHTML(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    // First remove dangerous tags and scripts
    let sanitized = input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<object[^>]*>.*?<\/object>/gi, '')
      .replace(/<embed[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
    
    // Then escape remaining HTML
    return OutputSanitizer.escapeHTML(sanitized);
  }
}

// ===========================================
// 🔐 JSON & API RESPONSE SANITIZATION
// ===========================================

export class JSONSanitizer {
  
  /**
   * Sanitize object for safe JSON output
   */
  static sanitizeObject(obj: any, escapeHTML = true): any {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (typeof obj === 'string') {
      return escapeHTML ? OutputSanitizer.escapeHTML(obj) : obj;
    }
    
    if (typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => JSONSanitizer.sanitizeObject(item, escapeHTML));
    }
    
    if (typeof obj === 'object') {
      const sanitized: any = {};
      
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize both key and value
        const sanitizedKey = escapeHTML ? OutputSanitizer.escapeHTML(key) : key;
        sanitized[sanitizedKey] = JSONSanitizer.sanitizeObject(value, escapeHTML);
      }
      
      return sanitized;
    }
    
    return obj;
  }
  
  /**
   * Sanitize API response data
   */
  static sanitizeAPIResponse(data: any): any {
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'hash'];
    
    function removeSensitiveFields(obj: any): any {
      if (Array.isArray(obj)) {
        return obj.map(removeSensitiveFields);
      }
      
      if (obj && typeof obj === 'object') {
        const cleaned: any = {};
        
        for (const [key, value] of Object.entries(obj)) {
          if (!sensitiveFields.some(field => key.toLowerCase().includes(field))) {
            cleaned[key] = removeSensitiveFields(value);
          }
        }
        
        return cleaned;
      }
      
      return obj;
    }
    
    // First remove sensitive fields, then sanitize
    const cleaned = removeSensitiveFields(data);
    return JSONSanitizer.sanitizeObject(cleaned, true);
  }
}

// ===========================================
// 🌐 URL & QUERY SANITIZATION
// ===========================================

export class URLSanitizer {
  
  /**
   * Sanitize URL parameters
   */
  static sanitizeQueryParams(params: Record<string, any>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        const stringValue = String(value);
        const sanitizedKey = OutputSanitizer.escapeHTML(key);
        const sanitizedValue = OutputSanitizer.escapeHTML(stringValue);
        
        sanitized[sanitizedKey] = sanitizedValue;
      }
    }
    
    return sanitized;
  }
  
  /**
   * Validate and sanitize redirect URLs
   */
  static sanitizeRedirectURL(url: string, allowedDomains: string[] = []): string | null {
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    try {
      const parsedURL = new URL(url);
      
      // Block javascript: and data: schemes
      if (['javascript:', 'data:', 'vbscript:'].includes(parsedURL.protocol)) {
        return null;
      }
      
      // If allowedDomains specified, check domain
      if (allowedDomains.length > 0) {
        const isAllowed = allowedDomains.some(domain => 
          parsedURL.hostname === domain || 
          parsedURL.hostname.endsWith('.' + domain)
        );
        
        if (!isAllowed) {
          return null;
        }
      }
      
      return parsedURL.toString();
    } catch {
      // Invalid URL
      return null;
    }
  }
  
  /**
   * Encode URL components safely
   */
  static encodeURLComponent(component: string): string {
    if (!component || typeof component !== 'string') {
      return '';
    }
    
    return encodeURIComponent(component);
  }
}

// ===========================================
// 📝 TEXT & CONTENT SANITIZATION
// ===========================================

export class ContentSanitizer {
  
  /**
   * Sanitize user input text for display
   */
  static sanitizeText(text: string, options: {
    escapeHTML?: boolean;
    removeNewlines?: boolean;
    maxLength?: number;
    allowedCharacters?: RegExp;
  } = {}): string {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    const {
      escapeHTML = true,
      removeNewlines = false,
      maxLength = 1000,
      allowedCharacters
    } = options;
    
    let sanitized = text.trim();
    
    // Remove newlines if requested
    if (removeNewlines) {
      sanitized = sanitized.replace(/[\r\n]/g, ' ');
    }
    
    // Filter allowed characters
    if (allowedCharacters) {
      sanitized = sanitized.replace(new RegExp(`[^${allowedCharacters.source}]`, 'g'), '');
    }
    
    // Truncate to max length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength) + '...';
    }
    
    // Escape HTML if requested
    if (escapeHTML) {
      sanitized = OutputSanitizer.escapeHTML(sanitized);
    }
    
    return sanitized;
  }
  
  /**
   * Sanitize email for display (hide part of email for privacy)
   */
  static sanitizeEmailForDisplay(email: string): string {
    if (!email || typeof email !== 'string') {
      return '';
    }
    
    const [localPart, domain] = email.split('@');
    
    if (!localPart || !domain) {
      return OutputSanitizer.escapeHTML(email);
    }
    
    // Show first and last character of local part
    let maskedLocal = localPart;
    if (localPart.length > 2) {
      maskedLocal = localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1];
    } else if (localPart.length === 2) {
      maskedLocal = localPart[0] + '*';
    }
    
    return OutputSanitizer.escapeHTML(`${maskedLocal}@${domain}`);
  }
  
  /**
   * Sanitize phone number for display
   */
  static sanitizePhoneForDisplay(phone: string): string {
    if (!phone || typeof phone !== 'string') {
      return '';
    }
    
    // Show only first 3 and last 3 digits
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    if (cleanPhone.length <= 6) {
      return OutputSanitizer.escapeHTML(phone);
    }
    
    const start = cleanPhone.substring(0, 3);
    const end = cleanPhone.substring(cleanPhone.length - 3);
    const middle = '*'.repeat(cleanPhone.length - 6);
    
    return OutputSanitizer.escapeHTML(`${start}${middle}${end}`);
  }
}

// ===========================================
// 🛡️ SQL SANITIZATION (additional layer)
// ===========================================

export class SQLSanitizer {
  
  /**
   * Escape SQL string literals (basic protection)
   * Note: Always use parameterized queries as primary protection
   */
  static escapeSQLString(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    return input
      .replace(/'/g, "''")  // Escape single quotes
      .replace(/\\/g, '\\\\')  // Escape backslashes
      .replace(/\x00/g, '\\0')  // Escape null bytes
      .replace(/\n/g, '\\n')  // Escape newlines
      .replace(/\r/g, '\\r')  // Escape carriage returns
      .replace(/\x1a/g, '\\Z');  // Escape ctrl+Z
  }
  
  /**
   * Remove potentially dangerous SQL keywords
   */
  static removeSQLKeywords(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    const dangerousKeywords = [
      'DROP', 'DELETE', 'INSERT', 'UPDATE', 'CREATE', 'ALTER', 
      'TRUNCATE', 'EXEC', 'EXECUTE', 'UNION', 'SCRIPT', 'DECLARE'
    ];
    
    let sanitized = input;
    
    dangerousKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });
    
    return sanitized.trim();
  }
}

// ===========================================
// 🏭 SANITIZATION FACTORY
// ===========================================

export class SanitizationFactory {
  
  /**
   * Comprehensive sanitization for different contexts
   */
  static sanitizeForContext(input: any, context: 'html' | 'json' | 'url' | 'text' | 'email' | 'phone' | 'sql'): any {
    if (!input) return input;
    
    switch (context) {
      case 'html':
        return OutputSanitizer.sanitizeHTML(String(input));
        
      case 'json':
        return JSONSanitizer.sanitizeObject(input);
        
      case 'url':
        return URLSanitizer.encodeURLComponent(String(input));
        
      case 'text':
        return ContentSanitizer.sanitizeText(String(input));
        
      case 'email':
        return ContentSanitizer.sanitizeEmailForDisplay(String(input));
        
      case 'phone':
        return ContentSanitizer.sanitizePhoneForDisplay(String(input));
        
      case 'sql':
        return SQLSanitizer.escapeSQLString(String(input));
        
      default:
        return OutputSanitizer.escapeHTML(String(input));
    }
  }
  
  /**
   * Sanitize user object for safe API response
   */
  static sanitizeUserForAPI(user: any): any {
    if (!user || typeof user !== 'object') {
      return null;
    }
    
    return {
      uuid: user.uuid,
      name: OutputSanitizer.escapeHTML(user.name || ''),
      username: OutputSanitizer.escapeHTML(user.username || ''),
      email: ContentSanitizer.sanitizeEmailForDisplay(user.email || ''),
      phone: user.phone ? ContentSanitizer.sanitizePhoneForDisplay(user.phone) : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: Boolean(user.isActive)
    };
  }
}

// Export all sanitizers
export default SanitizationFactory;
