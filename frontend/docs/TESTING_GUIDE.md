# 🧪 Testing Guide

## 📋 **Overview**

Panduan komprehensif untuk testing strategy aplikasi KAI Frontend menggunakan Vitest, Testing Library, Playwright, dan best practices untuk unit testing, integration testing, dan end-to-end testing.

## 🏗️ **Testing Architecture**

### **Testing Pyramid**
```
┌─────────────────────────────────────┐
│            E2E Tests                │
│         (End-to-End)                │
├─────────────────────────────────────┤
│        Integration Tests            │
│      (Component Integration)       │
├─────────────────────────────────────┤
│           Unit Tests                │
│    (Functions, Components,          │
│     Hooks, Utilities)               │
└─────────────────────────────────────┘
```

### **Testing Stack**
- **Unit Testing**: Vitest + React Testing Library
- **Integration Testing**: Vitest + MSW (Mock Service Worker)
- **E2E Testing**: Playwright
- **Visual Testing**: Chromatic (Storybook)
- **Performance Testing**: Lighthouse CI

## ⚙️ **Test Configuration**

### **Vitest Configuration**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    reporters: ['verbose', 'html', 'junit'],
    outputFile: {
      html: './coverage/html/index.html',
      junit: './coverage/junit.xml',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/coverage/**',
        '**/dist/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@context': resolve(__dirname, './src/context'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@test': resolve(__dirname, './src/test'),
    },
  },
});
```

### **Test Setup File**
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// MSW Server setup
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch if not using MSW for specific tests
global.fetch = vi.fn();

// Mock environment variables
vi.mock('../config/environment', () => ({
  config: {
    API_BASE_URL: 'http://localhost:5000',
    NODE_ENV: 'test',
    FEATURE_FLAGS: {
      enablePWA: false,
      enableAnalytics: false,
      enableNotifications: false,
      enableOfflineMode: false,
    },
  },
}));
```

### **MSW (Mock Service Worker) Setup**
```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Authentication handlers
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'user',
          },
          token: 'mock-token',
          expiresIn: 3600,
        },
      })
    );
  }),

  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: 'Logged out successfully',
      })
    );
  }),

  // Booking handlers
  rest.get('/api/stations', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          items: [
            {
              id: '1',
              code: 'GMR',
              name: 'Gambir',
              city: 'Jakarta',
              province: 'DKI Jakarta',
            },
            {
              id: '2',
              code: 'BD',
              name: 'Bandung',
              city: 'Bandung',
              province: 'Jawa Barat',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
            totalPages: 1,
          },
        },
      })
    );
  }),

  rest.post('/api/schedules/search', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          outbound: [
            {
              id: '1',
              trainId: 'train-1',
              train: {
                id: 'train-1',
                name: 'Argo Lawu',
                type: 'executive',
              },
              departureStationId: '1',
              arrivalStationId: '2',
              departureTime: '2024-01-15T08:00:00Z',
              arrivalTime: '2024-01-15T11:00:00Z',
              price: {
                executive: 150000,
                business: 100000,
                economy: 75000,
              },
              availability: {
                executive: 20,
                business: 30,
                economy: 50,
              },
            },
          ],
        },
      })
    );
  }),

  // Payment handlers
  rest.get('/api/payment/methods', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          {
            id: '1',
            name: 'Bank Transfer',
            type: 'bank_transfer',
            provider: 'BCA',
            fee: 5000,
            feeType: 'fixed',
          },
          {
            id: '2',
            name: 'Credit Card',
            type: 'credit_card',
            provider: 'Visa',
            fee: 2.5,
            feeType: 'percentage',
          },
        ],
      })
    );
  }),

  // Error handlers
  rest.get('/api/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      })
    );
  }),
];
```

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

## 🧪 **Unit Testing**

### **Testing Utilities**
```typescript
// src/test/utils/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { BookingProvider } from '@/context/BookingContext';
import { NotificationProvider } from '@/context/NotificationContext';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <BookingProvider>
              {children}
            </BookingProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Custom matchers
export const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// Mock factory functions
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  phone: '08123456789',
  role: 'user' as const,
  avatar: null,
  emailVerified: true,
  phoneVerified: true,
  preferences: {
    language: 'id' as const,
    currency: 'IDR' as const,
    notifications: true,
  },
  ...overrides,
});

export const createMockBooking = (overrides = {}) => ({
  id: 'booking-1',
  bookingCode: 'KAI123456',
  status: 'confirmed' as const,
  scheduleId: 'schedule-1',
  passengers: [
    {
      id: 'passenger-1',
      title: 'Mr' as const,
      firstName: 'John',
      lastName: 'Doe',
      identityType: 'ktp' as const,
      identityNumber: '1234567890123456',
      birthDate: '1990-01-01',
      nationality: 'ID',
      type: 'adult' as const,
      seatNumber: 'A1',
      carNumber: '1',
    },
  ],
  totalPrice: 150000,
  paymentStatus: 'paid' as const,
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
});
```

### **Component Testing Examples**

#### **Button Component Test**
```typescript
// src/components/ui/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@test/utils/test-utils';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-kai-primary-500');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with correct size classes', () => {
    render(<Button size="lg">Large Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button with ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

#### **Form Component Test**
```typescript
// src/components/forms/LoginForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@test/utils/test-utils';
import { LoginForm } from './LoginForm';

describe('LoginForm Component', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<LoginForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      });
    });
  });

  it('shows loading state during submission', async () => {
    const slowSubmit = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<LoginForm onSubmit={slowSubmit} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });
});
```

### **Hook Testing Examples**

#### **Custom Hook Test**
```typescript
// src/hooks/useApi.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from './useApi';

describe('useApi Hook', () => {
  const mockApiFunction = vi.fn();

  beforeEach(() => {
    mockApiFunction.mockClear();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useApi(mockApiFunction, [], { immediate: false }));
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('executes API call immediately when immediate is true', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockApiFunction.mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useApi(mockApiFunction));
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });
    
    expect(mockApiFunction).toHaveBeenCalledTimes(1);
  });

  it('handles API errors correctly', async () => {
    const mockError = new Error('API Error');
    mockApiFunction.mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useApi(mockApiFunction));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toEqual(mockError);
    });
  });

  it('executes API call manually', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockApiFunction.mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useApi(mockApiFunction, [], { immediate: false }));
    
    expect(mockApiFunction).not.toHaveBeenCalled();
    
    await result.current.execute();
    
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(mockApiFunction).toHaveBeenCalledTimes(1);
    });
  });

  it('resets state correctly', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockApiFunction.mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useApi(mockApiFunction));
    
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });
    
    result.current.reset();
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
```

### **Context Testing**
```typescript
// src/context/AuthContext.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { createMockUser } from '@test/utils/test-utils';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.state.user).toBeNull();
    expect(result.current.state.token).toBeNull();
    expect(result.current.state.isLoading).toBe(true);
    expect(result.current.state.isAuthenticated).toBe(false);
  });

  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };
    
    await act(async () => {
      await result.current.login(credentials);
    });
    
    await waitFor(() => {
      expect(result.current.state.isAuthenticated).toBe(true);
      expect(result.current.state.user).toBeTruthy();
      expect(result.current.state.token).toBe('mock-token');
    });
  });

  it('logs out user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // First login
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    // Then logout
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.state.user).toBeNull();
    expect(result.current.state.token).toBeNull();
    expect(result.current.state.isAuthenticated).toBe(false);
  });

  it('updates user profile', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Login first
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    // Update profile
    const updateData = { name: 'Updated Name' };
    act(() => {
      result.current.updateUser(updateData);
    });
    
    expect(result.current.state.user?.name).toBe('Updated Name');
  });

  it('handles login failure', async () => {
    // Mock failed login response
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    } as Response);
    
    await expect(
      result.current.login({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow();
    
    expect(result.current.state.isAuthenticated).toBe(false);
  });
});
```

## 🔗 **Integration Testing**

### **Page Integration Test**
```typescript
// src/pages/BookingPage.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@test/utils/test-utils';
import { BookingPage } from './BookingPage';

describe('BookingPage Integration', () => {
  beforeEach(() => {
    // Reset any state or mocks
  });

  it('renders booking flow correctly', async () => {
    render(<BookingPage />);
    
    // Check if search form is rendered
    expect(screen.getByText(/search trains/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/departure station/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/arrival station/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/departure date/i)).toBeInTheDocument();
  });

  it('performs train search and displays results', async () => {
    render(<BookingPage />);
    
    // Fill search form
    const departureSelect = screen.getByLabelText(/departure station/i);
    const arrivalSelect = screen.getByLabelText(/arrival station/i);
    const dateInput = screen.getByLabelText(/departure date/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(departureSelect, { target: { value: '1' } });
    fireEvent.change(arrivalSelect, { target: { value: '2' } });
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
    fireEvent.click(searchButton);
    
    // Wait for search results
    await waitFor(() => {
      expect(screen.getByText(/argo lawu/i)).toBeInTheDocument();
      expect(screen.getByText(/08:00/i)).toBeInTheDocument();
      expect(screen.getByText(/11:00/i)).toBeInTheDocument();
    });
  });

  it('navigates through booking steps', async () => {
    render(<BookingPage />);
    
    // Search for trains
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText(/argo lawu/i)).toBeInTheDocument();
    });
    
    // Select train
    const selectButton = screen.getByRole('button', { name: /select/i });
    fireEvent.click(selectButton);
    
    await waitFor(() => {
      expect(screen.getByText(/passenger information/i)).toBeInTheDocument();
    });
    
    // Fill passenger form
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);
    
    await waitFor(() => {
      expect(screen.getByText(/seat selection/i)).toBeInTheDocument();
    });
  });

  it('handles booking errors gracefully', async () => {
    // Mock error response
    render(<BookingPage />);
    
    // Trigger error scenario
    // ... test error handling
  });
});
```

### **API Integration Test**
```typescript
// src/api/services/bookingService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { bookingService } from './bookingService';
import { server } from '@test/mocks/server';
import { rest } from 'msw';

describe('BookingService Integration', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('fetches stations successfully', async () => {
    const stations = await bookingService.getStations();
    
    expect(stations.items).toHaveLength(2);
    expect(stations.items[0]).toMatchObject({
      id: '1',
      code: 'GMR',
      name: 'Gambir',
      city: 'Jakarta',
    });
  });

  it('searches schedules with correct parameters', async () => {
    const searchParams = {
      departureStationId: '1',
      arrivalStationId: '2',
      departureDate: '2024-01-15',
      passengers: { adult: 1, child: 0, infant: 0 },
    };
    
    const results = await bookingService.searchSchedules(searchParams);
    
    expect(results.outbound).toHaveLength(1);
    expect(results.outbound[0]).toMatchObject({
      id: '1',
      train: { name: 'Argo Lawu' },
      departureTime: '2024-01-15T08:00:00Z',
    });
  });

  it('handles API errors correctly', async () => {
    server.use(
      rest.get('/api/stations', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({
          success: false,
          message: 'Internal server error',
        }));
      })
    );
    
    await expect(bookingService.getStations()).rejects.toThrow('Internal server error');
  });

  it('creates booking successfully', async () => {
    const bookingData = {
      scheduleId: '1',
      passengers: [
        {
          title: 'Mr' as const,
          firstName: 'John',
          lastName: 'Doe',
          identityType: 'ktp' as const,
          identityNumber: '1234567890123456',
          birthDate: '1990-01-01',
          nationality: 'ID',
          type: 'adult' as const,
        },
      ],
      seatSelections: [
        {
          passengerId: 'passenger-1',
          scheduleId: '1',
          carId: 'car-1',
          seatId: 'seat-1',
          price: 150000,
        },
      ],
      contactInfo: {
        email: 'test@example.com',
        phone: '08123456789',
      },
      additionalServices: {
        insurance: false,
        meal: false,
        wifi: false,
      },
      paymentMethod: 'bank_transfer',
    };
    
    // Mock successful booking creation
    server.use(
      rest.post('/api/bookings', (req, res, ctx) => {
        return res(ctx.status(201), ctx.json({
          success: true,
          data: {
            id: 'booking-1',
            bookingCode: 'KAI123456',
            status: 'pending',
            ...bookingData,
          },
        }));
      })
    );
    
    const booking = await bookingService.createBooking(bookingData);
    
    expect(booking).toMatchObject({
      id: 'booking-1',
      bookingCode: 'KAI123456',
      status: 'pending',
    });
  });
});
```

## 🎭 **End-to-End Testing**

### **Playwright Configuration**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### **E2E Test Examples**
```typescript
// e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete booking flow', async ({ page }) => {
    // Search for trains
    await page.getByLabel('Departure Station').selectOption('1');
    await page.getByLabel('Arrival Station').selectOption('2');
    await page.getByLabel('Departure Date').fill('2024-01-15');
    await page.getByRole('button', { name: 'Search' }).click();

    // Wait for search results
    await expect(page.getByText('Argo Lawu')).toBeVisible();

    // Select train
    await page.getByRole('button', { name: 'Select' }).first().click();

    // Fill passenger information
    await expect(page.getByText('Passenger Information')).toBeVisible();
    await page.getByLabel('First Name').fill('John');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Identity Number').fill('1234567890123456');
    await page.getByLabel('Birth Date').fill('1990-01-01');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Select seat
    await expect(page.getByText('Seat Selection')).toBeVisible();
    await page.getByTestId('seat-A1').click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Payment
    await expect(page.getByText('Payment')).toBeVisible();
    await page.getByLabel('Bank Transfer').check();
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Phone').fill('08123456789');
    await page.getByRole('button', { name: 'Book Now' }).click();

    // Confirmation
    await expect(page.getByText('Booking Confirmed')).toBeVisible();
    await expect(page.getByText(/KAI\d+/)).toBeVisible(); // Booking code
  });

  test('validates required fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Search' }).click();

    // Check validation messages
    await expect(page.getByText('Departure station is required')).toBeVisible();
    await expect(page.getByText('Arrival station is required')).toBeVisible();
    await expect(page.getByText('Departure date is required')).toBeVisible();
  });

  test('handles no search results', async ({ page }) => {
    // Mock empty search results
    await page.route('/api/schedules/search', route => {
      route.fulfill({
        json: {
          success: true,
          data: { outbound: [] }
        }
      });
    });

    await page.getByLabel('Departure Station').selectOption('1');
    await page.getByLabel('Arrival Station').selectOption('2');
    await page.getByLabel('Departure Date').fill('2024-01-15');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText('No trains found')).toBeVisible();
  });
});
```

### **Authentication E2E Tests**
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login flow', async ({ page }) => {
    await page.goto('/auth/login');

    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Should redirect to home page
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('login with invalid credentials', async ({ page }) => {
    await page.route('/api/auth/login', route => {
      route.fulfill({
        status: 401,
        json: {
          success: false,
          message: 'Invalid email or password'
        }
      });
    });

    await page.goto('/auth/login');

    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('register flow', async ({ page }) => {
    await page.goto('/auth/register');

    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Phone').fill('08123456789');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');
    await page.getByLabel('I agree to terms').check();
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Registration successful')).toBeVisible();
  });

  test('logout', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Logout
    await page.getByRole('button', { name: 'User Menu' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    // Should redirect to home page and show login link
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  });
});
```

## 📊 **Visual Testing**

### **Storybook Test Runner**
```typescript
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  setup() {
    // Global setup
  },
  async preRender(page, context) {
    // Pre-render setup
    await page.setViewportSize({ width: 1200, height: 800 });
  },
  async postRender(page, context) {
    // Post-render checks
    const elementHandler = await page.$('[data-testid="error-boundary"]');
    if (elementHandler) {
      const innerHTML = await elementHandler.innerHTML();
      if (innerHTML) {
        throw new Error(`Error boundary triggered: ${innerHTML}`);
      }
    }

    // Accessibility testing
    await page.waitForLoadState('networkidle');
    const accessibilityReport = await page.accessibility.snapshot();
    if (!accessibilityReport) {
      throw new Error('Accessibility snapshot failed');
    }
  },
};

export default config;
```

### **Chromatic Configuration**
```javascript
// chromatic.config.json
{
  "projectToken": "your-chromatic-project-token",
  "buildScriptName": "build-storybook",
  "exitZeroOnChanges": true,
  "exitOnceUploaded": true,
  "ignoreLastBuildOnBranch": "main",
  "skip": "dependabot/**"
}
```

## 🚀 **Performance Testing**

### **Lighthouse CI Configuration**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/booking',
        'http://localhost:3000/auth/login',
      ],
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'categories:pwa': ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://your-lhci-server.com',
      token: 'your-lhci-token',
    },
  },
};
```

### **Web Vitals Testing**
```typescript
// src/test/performance/webVitals.test.ts
import { describe, it, expect } from 'vitest';
import { getLCP, getFID, getCLS, getFCP, getTTFB } from 'web-vitals';

describe('Web Vitals Performance', () => {
  it('measures Core Web Vitals', async () => {
    const vitals: Record<string, number> = {};

    await new Promise<void>((resolve) => {
      let metricsCollected = 0;
      const totalMetrics = 5;

      const onMetric = (metric: any) => {
        vitals[metric.name] = metric.value;
        metricsCollected++;
        if (metricsCollected === totalMetrics) {
          resolve();
        }
      };

      getLCP(onMetric);
      getFID(onMetric);
      getCLS(onMetric);
      getFCP(onMetric);
      getTTFB(onMetric);

      // Timeout after 10 seconds
      setTimeout(() => resolve(), 10000);
    });

    // Assert performance thresholds
    if (vitals.LCP) expect(vitals.LCP).toBeLessThan(2500); // 2.5s
    if (vitals.FID) expect(vitals.FID).toBeLessThan(100); // 100ms
    if (vitals.CLS) expect(vitals.CLS).toBeLessThan(0.1); // 0.1
    if (vitals.FCP) expect(vitals.FCP).toBeLessThan(1800); // 1.8s
    if (vitals.TTFB) expect(vitals.TTFB).toBeLessThan(800); // 800ms
  });
});
```

## 📋 **Test Scripts**

### **Package.json Scripts**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:visual": "test-storybook",
    "test:performance": "lhci autorun",
    "test:all": "npm run test:run && npm run test:e2e && npm run test:visual",
    "test:ci": "npm run test:coverage && npm run test:e2e && npm run test:performance"
  }
}
```

### **GitHub Actions Test Workflow**
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run visual tests
        run: npm run chromatic
        env:
          CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

---

**🧪 Comprehensive Testing Strategy - Reliable, Maintainable, Scalable** ✨
