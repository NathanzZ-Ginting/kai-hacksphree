# 🧹 Layer 5 Input Validation & Sanitization - Usage Guide

## Quick Start

### Basic Implementation

```typescript
// Import validation service
import { ValidationService } from '../services/validation.service';

// Use in controllers
export const registerController = async (c: Context) => {
  const body = await c.req.json();
  
  // Validate input with automatic sanitization
  const validationResult = await ValidationService.validateRequest('register', body);
  
  if (!validationResult.isValid) {
    return c.json({
      success: false,
      message: 'Invalid input',
      errors: validationResult.errors
    }, 400);
  }
  
  // Use sanitized data
  const { sanitizedData } = validationResult;
  // Process with security guarantees...
};
```

## Validation Schemas

### Predefined Schemas

```typescript
// src/services/validation.service.ts

// Registration validation
static readonly REGISTER_SCHEMA = {
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
  }
};

// Login validation
static readonly LOGIN_SCHEMA = {
  email: {
    required: true,
    type: 'email'
  },
  password: {
    required: true,
    type: 'string',
    minLength: 1
  }
};
```

### Custom Schemas

```typescript
// Create custom validation schemas
const customBookingSchema = {
  trainId: {
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
```

## Controller Implementation

### Registration Controller

```typescript
// src/controllers/register-controller.ts
import { ValidationService } from '../services/validation.service';

export const register = async (c: Context) => {
  try {
    const rawBody = c.get('requestBody') || await c.req.json();
    
    console.log('Registration request received');

    // Layer 5: Validate and sanitize input
    const validationResult = await ValidationService.validateRequest('register', rawBody);

    if (!validationResult.isValid) {
      console.warn('Registration validation failed:', validationResult.errors);
      return c.json({
        success: false,
        message: 'Invalid registration data',
        errors: validationResult.errors,
        threats: validationResult.threats.length > 0 ? ['Security threats detected'] : undefined
      }, 400);
    }

    // Use sanitized data - guaranteed to be safe
    const { name, email, password, phone } = validationResult.sanitizedData;

    // Check if user already exists
    const existingUser = await usersRepository.getUserByEmail(email);
    if (existingUser) {
      return c.json({
        success: false,
        message: 'Email already registered'
      }, 409);
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with sanitized data
    const newUser = await usersRepository.createUser({
      name,
      email,
      password: hashedPassword,
      phone: phone || null
    });

    console.log(`User registered successfully: ${email}`);

    return c.json({
      success: true,
      message: 'Registration successful',
      data: {
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    }, 201);

  } catch (error) {
    console.error('Registration error:', error);
    return c.json({
      success: false,
      message: 'Registration failed'
    }, 500);
  }
};
```

### Booking Controller

```typescript
// src/controllers/booking-controller.ts
export const createBooking = async (c: Context) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();

    // Validate booking data
    const validationResult = await ValidationService.validateRequest('booking', body);

    if (!validationResult.isValid) {
      return c.json({
        success: false,
        message: 'Invalid booking data',
        errors: validationResult.errors
      }, 400);
    }

    // Check for security threats
    if (validationResult.threats.length > 0) {
      console.error('Security threats detected in booking:', validationResult.threats);
      return c.json({
        success: false,
        message: 'Security threats detected in input'
      }, 400);
    }

    // Use sanitized booking data
    const bookingData = validationResult.sanitizedData;
    
    // Process booking with validated data
    const booking = await processBooking(user.userId, bookingData);

    return c.json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    return c.json({
      success: false,
      message: 'Booking creation failed'
    }, 500);
  }
};
```

## Validation Middleware

### Create Validation Middleware

```typescript
// src/middleware/form-validation.middleware.ts
import { MiddlewareHandler } from 'hono';
import { ValidationService } from '../services/validation.service';

export const createValidationMiddleware = (endpoint: string): MiddlewareHandler => {
  return async (c, next) => {
    try {
      const body = c.get('requestBody') || await c.req.json();
      
      console.log(`Validating input for endpoint: ${endpoint}`);
      
      const validationResult = await ValidationService.validateRequest(endpoint, body);

      if (!validationResult.isValid) {
        console.warn(`Validation failed for ${endpoint}:`, validationResult.errors);
        
        return c.json({
          success: false,
          message: 'Input validation failed',
          errors: validationResult.errors,
          code: 'VALIDATION_ERROR'
        }, 400);
      }

      if (validationResult.threats.length > 0) {
        console.error(`Security threats detected for ${endpoint}:`, validationResult.threats);
        
        return c.json({
          success: false,
          message: 'Security threats detected in input',
          code: 'SECURITY_THREAT'
        }, 400);
      }

      // Store sanitized data for controller
      c.set('validatedData', validationResult.sanitizedData);
      c.set('requestBody', validationResult.sanitizedData);

      console.log(`Validation passed for ${endpoint}`);
      await next();

    } catch (error) {
      console.error(`Validation middleware error for ${endpoint}:`, error);
      return c.json({
        success: false,
        message: 'Validation processing error'
      }, 500);
    }
  };
};
```

### Apply Validation Middleware

```typescript
// src/routes/auth-route.ts
import { createValidationMiddleware } from '../middleware/form-validation.middleware';

// Apply validation middleware to specific endpoints
authRoute.post("/register", 
  captchaMiddleware,
  createValidationMiddleware('register'),
  RegisterController.register
);

authRoute.post("/login",
  captchaMiddleware,
  createValidationMiddleware('login'),
  LoginController.login
);
```

## Custom Validation Rules

### Advanced Validation

```typescript
// Custom validation with business logic
const advancedUserSchema = {
  age: {
    required: true,
    type: 'number',
    min: 18,
    max: 100,
    custom: (value: number) => {
      if (value < 21) {
        return 'Must be at least 21 years old for certain services';
      }
      return true;
    }
  },
  indonesianID: {
    required: true,
    type: 'string',
    pattern: /^\d{16}$/,
    custom: (value: string) => {
      // Custom NIK validation logic
      return validateNIK(value) || 'Invalid Indonesian ID number';
    }
  },
  address: {
    required: true,
    type: 'object',
    custom: (value: any) => {
      const requiredFields = ['street', 'city', 'province', 'postalCode'];
      for (const field of requiredFields) {
        if (!value[field]) {
          return `Address must include ${field}`;
        }
      }
      return true;
    }
  }
};
```

### File Upload Validation

```typescript
// File upload validation schema
const fileUploadSchema = {
  file: {
    required: true,
    type: 'object',
    custom: (file: any) => {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return 'Only JPEG, PNG, and GIF files are allowed';
      }
      
      // Check file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return 'File size must be less than 5MB';
      }
      
      // Check filename for security
      if (/[<>:"/\\|?*]/.test(file.name)) {
        return 'Filename contains invalid characters';
      }
      
      return true;
    }
  },
  description: {
    required: false,
    type: 'string',
    maxLength: 500
  }
};
```

## Frontend Integration

### Form Validation Hook

```typescript
// hooks/useValidatedForm.ts
import { useState } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

export const useValidatedForm = (schema: ValidationSchema) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (data: { [key: string]: any }) => {
    const newErrors: { [key: string]: string } = {};

    for (const [field, rule] of Object.entries(schema)) {
      const value = data[field];

      if (rule.required && (!value || value === '')) {
        newErrors[field] = `${field} is required`;
        continue;
      }

      if (value && rule.minLength && value.length < rule.minLength) {
        newErrors[field] = `${field} must be at least ${rule.minLength} characters`;
        continue;
      }

      if (value && rule.maxLength && value.length > rule.maxLength) {
        newErrors[field] = `${field} must be no more than ${rule.maxLength} characters`;
        continue;
      }

      if (value && rule.pattern && !rule.pattern.test(value)) {
        newErrors[field] = `${field} format is invalid`;
        continue;
      }

      if (value && rule.custom) {
        const customResult = rule.custom(value);
        if (customResult !== true) {
          newErrors[field] = typeof customResult === 'string' ? customResult : `${field} is invalid`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validate, setErrors };
};
```

### Validated Form Component

```typescript
// components/ValidatedForm.tsx
const ValidatedRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validationSchema = {
    name: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
    },
    confirmPassword: {
      required: true,
      custom: (value: string) => value === formData.password || 'Passwords do not match'
    }
  };

  const { errors, validate } = useValidatedForm(validationSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate(formData)) {
      return;
    }

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Registration successful');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
      </div>

      <button type="submit">Register</button>
    </form>
  );
};
```

## Monitoring & Analytics

### Validation Metrics

```typescript
// Track validation statistics
interface ValidationMetrics {
  totalValidations: number;
  successfulValidations: number;
  failedValidations: number;
  threatsDetected: number;
  mostCommonErrors: { [error: string]: number };
}

const validationMetrics: ValidationMetrics = {
  totalValidations: 0,
  successfulValidations: 0,
  failedValidations: 0,
  threatsDetected: 0,
  mostCommonErrors: {}
};

// Update metrics in validation service
const updateValidationMetrics = (result: ValidationResult) => {
  validationMetrics.totalValidations++;
  
  if (result.isValid) {
    validationMetrics.successfulValidations++;
  } else {
    validationMetrics.failedValidations++;
    
    // Track common errors
    result.errors.forEach(error => {
      validationMetrics.mostCommonErrors[error] = 
        (validationMetrics.mostCommonErrors[error] || 0) + 1;
    });
  }
  
  if (result.threats.length > 0) {
    validationMetrics.threatsDetected++;
  }
};
```

---

**Related**: [Layer 5 Overview](../LAYER_5_INPUT_VALIDATION.md) | [Layer 5 Testing](../testing/LAYER_5_TESTING.md)
