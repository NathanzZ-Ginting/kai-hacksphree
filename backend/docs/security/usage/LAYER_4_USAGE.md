# 🛡️ Layer 4 CSRF Protection - Usage Guide

## Quick Start

### Basic Implementation

```typescript
// Import CSRF middleware
import { 
  validateCSRFToken, 
  provideCSRFToken,
  generateCSRFToken 
} from '../middleware/csrf-middleware';
import { sessionAuth } from '../middleware/session-middleware';

// Apply CSRF protection to routes
const csrfProtectedRoutes = new Hono();
csrfProtectedRoutes.use("*", sessionAuth);           // Require session
csrfProtectedRoutes.use("*", validateCSRFToken);    // Validate CSRF token
csrfProtectedRoutes.use("*", provideCSRFToken);     // Provide new token

authRoute.route("/protected", csrfProtectedRoutes);
```

## CSRF Token Generation

### Token Endpoint

```typescript
// src/routes/auth-route.ts
import { generateCSRFToken, getCSRFToken } from '../controllers/csrf-controller';

// CSRF token generation endpoint (requires session)
authRoute.get("/csrf/token", sessionAuth, generateCSRFToken, getCSRFToken);
```

### Get Token in Frontend

```typescript
// Frontend: CSRF token service
class CSRFService {
  private static token: string | null = null;

  static async getToken(): Promise<string | null> {
    try {
      if (this.token) {
        return this.token;
      }

      const response = await fetch('/api/v1/auth/csrf/token', {
        headers: {
          'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.data.csrfToken;
        return this.token;
      }
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }

    return null;
  }

  static updateToken(newToken: string) {
    this.token = newToken;
  }

  static clearToken() {
    this.token = null;
  }
}
```

## Protected Routes Setup

### Apply CSRF Protection

```typescript
// src/routes/auth-route.ts
const csrfProtectedRoutes = new Hono();

// Layer 3: Session Security
csrfProtectedRoutes.use("*", sessionAuth);

// Layer 4: CSRF Protection
csrfProtectedRoutes.use("*", validateCSRFToken);
csrfProtectedRoutes.use("*", provideCSRFToken);

// Define CSRF-protected endpoints
csrfProtectedRoutes.post("/profile/update", updateProfile);
csrfProtectedRoutes.post("/refund/request", requestRefund);
csrfProtectedRoutes.post("/password/change", changePassword);

// Apply CSRF protection
authRoute.route("/protected", csrfProtectedRoutes);
```

### Controller Implementation

```typescript
// src/controllers/csrf-protected-controller.ts
export const updateProfile = async (c: Context) => {
  try {
    const user = c.get('user');
    const body = c.get('requestBody') || await c.req.json();

    // CSRF token already validated by middleware
    console.log(`Profile update request for user: ${user.email}`);

    // Process the request with validated data
    const result = await processProfileUpdate(user.userId, body);

    return c.json({
      success: true,
      message: 'Profile updated successfully',
      data: result
    });

  } catch (error) {
    return c.json({
      success: false,
      message: 'Profile update error'
    }, 500);
  }
};
```

## Frontend Integration

### Protected Form Component

```typescript
// components/ProtectedForm.tsx
interface ProtectedFormProps {
  onSubmit: (data: any) => Promise<void>;
  children: React.ReactNode;
}

export const ProtectedForm: React.FC<ProtectedFormProps> = ({ 
  onSubmit, 
  children 
}) => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get CSRF token on component mount
    CSRFService.getToken().then(setCsrfToken);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!csrfToken) {
      toast.error('Security token not available. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      // Add CSRF token to data
      const requestData = { ...data, csrfToken };
      
      await onSubmit(requestData);
      
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!csrfToken) {
    return <div>Loading security token...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {children}
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Submit'}
      </button>
    </form>
  );
};
```

### API Client with CSRF

```typescript
// utils/ProtectedApiClient.ts
class ProtectedApiClient {
  static async post(url: string, data: any): Promise<Response> {
    const csrfToken = await CSRFService.getToken();
    
    if (!csrfToken) {
      throw new Error('CSRF token not available');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TokenManager.getAccessToken()}`,
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ ...data, csrfToken })
    });

    // Update CSRF token from response header
    const newToken = response.headers.get('X-CSRF-Token');
    if (newToken) {
      CSRFService.updateToken(newToken);
    }

    return response;
  }

  static async put(url: string, data: any): Promise<Response> {
    return this.post(url, data);
  }

  static async delete(url: string): Promise<Response> {
    const csrfToken = await CSRFService.getToken();
    
    if (!csrfToken) {
      throw new Error('CSRF token not available');
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${TokenManager.getAccessToken()}`,
        'X-CSRF-Token': csrfToken
      }
    });

    // Update CSRF token from response header
    const newToken = response.headers.get('X-CSRF-Token');
    if (newToken) {
      CSRFService.updateToken(newToken);
    }

    return response;
  }
}
```

## Usage Examples

### Profile Update Form

```typescript
// components/ProfileUpdateForm.tsx
const ProfileUpdateForm: React.FC = () => {
  const [profile, setProfile] = useState({ name: '', phone: '' });

  const handleProfileUpdate = async (data: any) => {
    try {
      const response = await ProtectedApiClient.post('/api/v1/auth/protected/profile/update', {
        name: data.name,
        phone: data.phone
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  return (
    <ProtectedForm onSubmit={handleProfileUpdate}>
      <div>
        <label htmlFor="name">Name:</label>
        <input 
          type="text" 
          name="name" 
          value={profile.name}
          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
          required 
        />
      </div>
      <div>
        <label htmlFor="phone">Phone:</label>
        <input 
          type="text" 
          name="phone" 
          value={profile.phone}
          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>
    </ProtectedForm>
  );
};
```

### Password Change Form

```typescript
// components/PasswordChangeForm.tsx
const PasswordChangeForm: React.FC = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (data: any) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error('Password confirmation does not match');
        return;
      }

      const response = await ProtectedApiClient.post('/api/v1/auth/protected/password/change', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Password changed successfully');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error changing password');
    }
  };

  return (
    <ProtectedForm onSubmit={handlePasswordChange}>
      <div>
        <label htmlFor="currentPassword">Current Password:</label>
        <input 
          type="password" 
          name="currentPassword" 
          value={passwords.currentPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
          required 
        />
      </div>
      <div>
        <label htmlFor="newPassword">New Password:</label>
        <input 
          type="password" 
          name="newPassword" 
          value={passwords.newPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
          required 
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input 
          type="password" 
          name="confirmPassword" 
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
          required 
        />
      </div>
    </ProtectedForm>
  );
};
```

## Error Handling

### CSRF Error Responses

```typescript
// Handle CSRF errors in API responses
const handleCSRFError = (response: Response) => {
  if (response.status === 403) {
    const errorData = response.json();
    
    switch (errorData.code) {
      case 'CSRF_TOKEN_REQUIRED':
        toast.error('Security token required. Please refresh the page.');
        break;
      case 'CSRF_TOKEN_INVALID':
        toast.error('Invalid security token. Please try again.');
        // Clear and refresh CSRF token
        CSRFService.clearToken();
        break;
      default:
        toast.error('Security error. Please refresh the page.');
    }
  }
};
```

---

**Related**: [Layer 4 Overview](../LAYER_4_CSRF_PROTECTION.md) | [Layer 4 Testing](../testing/LAYER_4_TESTING.md)
