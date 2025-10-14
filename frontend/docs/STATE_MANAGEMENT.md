# 🗂️ State Management Guide

## 📋 **Overview**

Panduan komprehensif untuk state management dalam aplikasi KAI Frontend menggunakan React Context API, custom hooks, dan pola state management yang efisien.

## 🏗️ **State Management Architecture**

### **State Layers**
```
┌─────────────────────────────────────┐
│           Global State              │
├─────────────────────────────────────┤
│ • Authentication State              │
│ • User Preferences                  │
│ • App Configuration                 │
│ • Shared UI State                   │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│          Feature State              │
├─────────────────────────────────────┤
│ • Booking State                     │
│ • Search Results                    │
│ • Cart/Order State                  │
│ • Route Data                        │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│         Component State             │
├─────────────────────────────────────┤
│ • Form State                        │
│ • UI Interactions                   │
│ • Local Loading States              │
│ • Component-specific Data           │
└─────────────────────────────────────┘
```

## 🔐 **Authentication State Management**

### **AuthContext Implementation**
```typescript
// src/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  avatar?: string;
  preferences: {
    language: 'id' | 'en';
    currency: 'IDR' | 'USD';
    notifications: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  lastActivity: Date | null;
  sessionExpiry: Date | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; expiresIn: number } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: { token: string; expiresIn: number } }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'UPDATE_ACTIVITY' }
  | { type: 'SESSION_EXPIRED' };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  lastActivity: null,
  sessionExpiry: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };

    case 'LOGIN_SUCCESS':
      const expiryDate = new Date(Date.now() + action.payload.expiresIn * 1000);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
        lastActivity: new Date(),
        sessionExpiry: expiryDate,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    case 'LOGOUT':
    case 'SESSION_EXPIRED':
      return {
        ...initialState,
        isLoading: false,
      };

    case 'REFRESH_TOKEN':
      const newExpiryDate = new Date(Date.now() + action.payload.expiresIn * 1000);
      return {
        ...state,
        token: action.payload.token,
        sessionExpiry: newExpiryDate,
        lastActivity: new Date(),
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        lastActivity: new Date(),
      };

    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  updateActivity: () => void;
  checkSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage utilities
const TOKEN_KEY = 'kai_auth_token';
const USER_KEY = 'kai_user_data';
const EXPIRY_KEY = 'kai_session_expiry';

const storage = {
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: (): User | null => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
  removeUser: () => localStorage.removeItem(USER_KEY),
  setExpiry: (expiry: Date) => localStorage.setItem(EXPIRY_KEY, expiry.toISOString()),
  getExpiry: (): Date | null => {
    const expiry = localStorage.getItem(EXPIRY_KEY);
    return expiry ? new Date(expiry) : null;
  },
  removeExpiry: () => localStorage.removeItem(EXPIRY_KEY),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = storage.getToken();
    const user = storage.getUser();
    const expiry = storage.getExpiry();

    if (token && user && expiry) {
      if (expiry > new Date()) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user,
            token,
            expiresIn: Math.floor((expiry.getTime() - Date.now()) / 1000),
          },
        });
      } else {
        // Session expired
        storage.clear();
        dispatch({ type: 'SESSION_EXPIRED' });
      }
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'No stored session' });
    }
  }, []);

  // Session monitoring
  useEffect(() => {
    if (!state.isAuthenticated || !state.sessionExpiry) return;

    const checkInterval = setInterval(() => {
      if (new Date() >= state.sessionExpiry!) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [state.isAuthenticated, state.sessionExpiry]);

  // Auto token refresh
  useEffect(() => {
    if (!state.isAuthenticated || !state.sessionExpiry) return;

    const refreshTime = state.sessionExpiry.getTime() - Date.now() - 5 * 60 * 1000; // 5 minutes before expiry
    
    if (refreshTime > 0) {
      const refreshTimeout = setTimeout(async () => {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Auto refresh failed:', error);
          logout();
        }
      }, refreshTime);

      return () => clearTimeout(refreshTimeout);
    }
  }, [state.sessionExpiry]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Store in localStorage
      storage.setToken(data.token);
      storage.setUser(data.user);
      storage.setExpiry(new Date(Date.now() + data.expiresIn * 1000));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.user,
          token: data.token,
          expiresIn: data.expiresIn,
        },
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Login failed' });
      throw error;
    }
  };

  const logout = (): void => {
    storage.clear();
    dispatch({ type: 'LOGOUT' });
  };

  const refreshToken = async (): Promise<void> => {
    if (!state.token) throw new Error('No token to refresh');

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      storage.setToken(data.token);
      storage.setExpiry(new Date(Date.now() + data.expiresIn * 1000));

      dispatch({
        type: 'REFRESH_TOKEN',
        payload: {
          token: data.token,
          expiresIn: data.expiresIn,
        },
      });
    } catch (error) {
      logout();
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      storage.setUser(updatedUser);
    }
  };

  const updateActivity = (): void => {
    dispatch({ type: 'UPDATE_ACTIVITY' });
  };

  const checkSession = (): boolean => {
    return state.isAuthenticated && state.sessionExpiry! > new Date();
  };

  const value = {
    state,
    login,
    logout,
    refreshToken,
    updateUser,
    updateActivity,
    checkSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### **Login Credentials Type**
```typescript
// src/types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  captcha: string;
}

export interface PasswordResetData {
  email: string;
  captcha: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

## 🎫 **Booking State Management**

### **Booking Context**
```typescript
// src/context/BookingContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Passenger {
  id: string;
  title: 'Mr' | 'Mrs' | 'Ms';
  firstName: string;
  lastName: string;
  identityType: 'ktp' | 'passport' | 'sim';
  identityNumber: string;
  birthDate: Date;
  email?: string;
  phone?: string;
}

interface SeatSelection {
  trainId: string;
  carId: string;
  seatNumber: string;
  passengerId: string;
  price: number;
  class: 'executive' | 'business' | 'economy';
}

interface BookingDetails {
  id: string;
  routeId: string;
  departureStationId: string;
  arrivalStationId: string;
  departureDate: Date;
  departureTime: string;
  arrivalTime: string;
  trainId: string;
  trainName: string;
  passengers: Passenger[];
  seatSelections: SeatSelection[];
  totalPrice: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
  bookingStatus: 'draft' | 'confirmed' | 'cancelled';
  contactInfo: {
    email: string;
    phone: string;
  };
  additionalServices: {
    insurance: boolean;
    meal: boolean;
    wifi: boolean;
  };
}

interface BookingState {
  currentBooking: BookingDetails | null;
  searchResults: any[];
  selectedRoute: any | null;
  isLoading: boolean;
  error: string | null;
  step: 'search' | 'select' | 'passenger' | 'payment' | 'confirmation';
  bookingHistory: BookingDetails[];
}

type BookingAction =
  | { type: 'SET_SEARCH_RESULTS'; payload: any[] }
  | { type: 'SELECT_ROUTE'; payload: any }
  | { type: 'START_BOOKING'; payload: Partial<BookingDetails> }
  | { type: 'ADD_PASSENGER'; payload: Passenger }
  | { type: 'UPDATE_PASSENGER'; payload: { id: string; data: Partial<Passenger> } }
  | { type: 'REMOVE_PASSENGER'; payload: string }
  | { type: 'SELECT_SEAT'; payload: SeatSelection }
  | { type: 'DESELECT_SEAT'; payload: string }
  | { type: 'UPDATE_CONTACT_INFO'; payload: { email: string; phone: string } }
  | { type: 'UPDATE_ADDITIONAL_SERVICES'; payload: Partial<BookingDetails['additionalServices']> }
  | { type: 'SET_PAYMENT_METHOD'; payload: string }
  | { type: 'CONFIRM_BOOKING' }
  | { type: 'CANCEL_BOOKING' }
  | { type: 'SET_STEP'; payload: BookingState['step'] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_BOOKING' }
  | { type: 'LOAD_BOOKING_HISTORY'; payload: BookingDetails[] };

const initialState: BookingState = {
  currentBooking: null,
  searchResults: [],
  selectedRoute: null,
  isLoading: false,
  error: null,
  step: 'search',
  bookingHistory: [],
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
        error: null,
      };

    case 'SELECT_ROUTE':
      return {
        ...state,
        selectedRoute: action.payload,
        step: 'select',
      };

    case 'START_BOOKING':
      return {
        ...state,
        currentBooking: {
          id: generateBookingId(),
          routeId: action.payload.routeId || '',
          departureStationId: action.payload.departureStationId || '',
          arrivalStationId: action.payload.arrivalStationId || '',
          departureDate: action.payload.departureDate || new Date(),
          departureTime: action.payload.departureTime || '',
          arrivalTime: action.payload.arrivalTime || '',
          trainId: action.payload.trainId || '',
          trainName: action.payload.trainName || '',
          passengers: [],
          seatSelections: [],
          totalPrice: 0,
          paymentStatus: 'pending',
          bookingStatus: 'draft',
          contactInfo: { email: '', phone: '' },
          additionalServices: { insurance: false, meal: false, wifi: false },
          ...action.payload,
        },
        step: 'passenger',
      };

    case 'ADD_PASSENGER':
      if (!state.currentBooking) return state;
      return {
        ...state,
        currentBooking: {
          ...state.currentBooking,
          passengers: [...state.currentBooking.passengers, action.payload],
        },
      };

    case 'UPDATE_PASSENGER':
      if (!state.currentBooking) return state;
      return {
        ...state,
        currentBooking: {
          ...state.currentBooking,
          passengers: state.currentBooking.passengers.map(passenger =>
            passenger.id === action.payload.id
              ? { ...passenger, ...action.payload.data }
              : passenger
          ),
        },
      };

    case 'REMOVE_PASSENGER':
      if (!state.currentBooking) return state;
      return {
        ...state,
        currentBooking: {
          ...state.currentBooking,
          passengers: state.currentBooking.passengers.filter(
            passenger => passenger.id !== action.payload
          ),
          seatSelections: state.currentBooking.seatSelections.filter(
            seat => seat.passengerId !== action.payload
          ),
        },
      };

    case 'SELECT_SEAT':
      if (!state.currentBooking) return state;
      const updatedSelections = [
        ...state.currentBooking.seatSelections.filter(
          seat => seat.passengerId !== action.payload.passengerId
        ),
        action.payload,
      ];
      
      return {
        ...state,
        currentBooking: {
          ...state.currentBooking,
          seatSelections: updatedSelections,
          totalPrice: calculateTotalPrice(updatedSelections, state.currentBooking.additionalServices),
        },
      };

    case 'DESELECT_SEAT':
      if (!state.currentBooking) return state;
      const filteredSelections = state.currentBooking.seatSelections.filter(
        seat => seat.passengerId !== action.payload
      );
      
      return {
        ...state,
        currentBooking: {
          ...state.currentBooking,
          seatSelections: filteredSelections,
          totalPrice: calculateTotalPrice(filteredSelections, state.currentBooking.additionalServices),
        },
      };

    case 'UPDATE_CONTACT_INFO':
      if (!state.currentBooking) return state;
      return {
        ...state,
        currentBooking: {
          ...state.currentBooking,
          contactInfo: action.payload,
        },
      };

    case 'UPDATE_ADDITIONAL_SERVICES':
      if (!state.currentBooking) return state;
      const updatedServices = { ...state.currentBooking.additionalServices, ...action.payload };
      return {
        ...state,
        currentBooking: {
          ...state.currentBooking,
          additionalServices: updatedServices,
          totalPrice: calculateTotalPrice(state.currentBooking.seatSelections, updatedServices),
        },
      };

    case 'SET_PAYMENT_METHOD':
      if (!state.currentBooking) return state;
      return {
        ...state,
        currentBooking: {
          ...state.currentBooking,
          paymentMethod: action.payload,
        },
      };

    case 'CONFIRM_BOOKING':
      if (!state.currentBooking) return state;
      const confirmedBooking = {
        ...state.currentBooking,
        bookingStatus: 'confirmed' as const,
      };
      
      return {
        ...state,
        currentBooking: confirmedBooking,
        bookingHistory: [confirmedBooking, ...state.bookingHistory],
        step: 'confirmation',
      };

    case 'CANCEL_BOOKING':
      return {
        ...state,
        currentBooking: null,
        step: 'search',
      };

    case 'SET_STEP':
      return {
        ...state,
        step: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_BOOKING':
      return {
        ...initialState,
        bookingHistory: state.bookingHistory,
      };

    case 'LOAD_BOOKING_HISTORY':
      return {
        ...state,
        bookingHistory: action.payload,
      };

    default:
      return state;
  }
}

// Helper functions
function generateBookingId(): string {
  return `KAI${Date.now().toString(36).toUpperCase()}`;
}

function calculateTotalPrice(
  seatSelections: SeatSelection[],
  additionalServices: BookingDetails['additionalServices']
): number {
  const basePrice = seatSelections.reduce((total, seat) => total + seat.price, 0);
  
  let additionalPrice = 0;
  if (additionalServices.insurance) additionalPrice += 25000; // 25k for insurance
  if (additionalServices.meal) additionalPrice += 50000; // 50k for meal
  if (additionalServices.wifi) additionalPrice += 15000; // 15k for wifi
  
  return basePrice + (additionalPrice * seatSelections.length);
}

interface BookingContextType {
  state: BookingState;
  setSearchResults: (results: any[]) => void;
  selectRoute: (route: any) => void;
  startBooking: (bookingData: Partial<BookingDetails>) => void;
  addPassenger: (passenger: Passenger) => void;
  updatePassenger: (id: string, data: Partial<Passenger>) => void;
  removePassenger: (id: string) => void;
  selectSeat: (seatSelection: SeatSelection) => void;
  deselectSeat: (passengerId: string) => void;
  updateContactInfo: (contactInfo: { email: string; phone: string }) => void;
  updateAdditionalServices: (services: Partial<BookingDetails['additionalServices']>) => void;
  setPaymentMethod: (method: string) => void;
  confirmBooking: () => void;
  cancelBooking: () => void;
  setStep: (step: BookingState['step']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearBooking: () => void;
  loadBookingHistory: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const setSearchResults = (results: any[]) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  };

  const selectRoute = (route: any) => {
    dispatch({ type: 'SELECT_ROUTE', payload: route });
  };

  const startBooking = (bookingData: Partial<BookingDetails>) => {
    dispatch({ type: 'START_BOOKING', payload: bookingData });
  };

  const addPassenger = (passenger: Passenger) => {
    dispatch({ type: 'ADD_PASSENGER', payload: passenger });
  };

  const updatePassenger = (id: string, data: Partial<Passenger>) => {
    dispatch({ type: 'UPDATE_PASSENGER', payload: { id, data } });
  };

  const removePassenger = (id: string) => {
    dispatch({ type: 'REMOVE_PASSENGER', payload: id });
  };

  const selectSeat = (seatSelection: SeatSelection) => {
    dispatch({ type: 'SELECT_SEAT', payload: seatSelection });
  };

  const deselectSeat = (passengerId: string) => {
    dispatch({ type: 'DESELECT_SEAT', payload: passengerId });
  };

  const updateContactInfo = (contactInfo: { email: string; phone: string }) => {
    dispatch({ type: 'UPDATE_CONTACT_INFO', payload: contactInfo });
  };

  const updateAdditionalServices = (services: Partial<BookingDetails['additionalServices']>) => {
    dispatch({ type: 'UPDATE_ADDITIONAL_SERVICES', payload: services });
  };

  const setPaymentMethod = (method: string) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const confirmBooking = () => {
    dispatch({ type: 'CONFIRM_BOOKING' });
  };

  const cancelBooking = () => {
    dispatch({ type: 'CANCEL_BOOKING' });
  };

  const setStep = (step: BookingState['step']) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearBooking = () => {
    dispatch({ type: 'CLEAR_BOOKING' });
  };

  const loadBookingHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookings/history');
      const bookings = await response.json();
      dispatch({ type: 'LOAD_BOOKING_HISTORY', payload: bookings });
    } catch (error) {
      setError('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    state,
    setSearchResults,
    selectRoute,
    startBooking,
    addPassenger,
    updatePassenger,
    removePassenger,
    selectSeat,
    deselectSeat,
    updateContactInfo,
    updateAdditionalServices,
    setPaymentMethod,
    confirmBooking,
    cancelBooking,
    setStep,
    setLoading,
    setError,
    clearBooking,
    loadBookingHistory,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
```

## 🎯 **Custom Hooks**

### **useLocalStorage Hook**
```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Set value in state and localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove value from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
```

### **useAsyncState Hook**
```typescript
// src/hooks/useAsyncState.ts
import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncStateReturn<T> {
  state: AsyncState<T>;
  execute: (asyncFunction: () => Promise<T>) => Promise<T>;
  reset: () => void;
  setData: (data: T) => void;
  setError: (error: string) => void;
}

function useAsyncState<T>(initialData: T | null = null): UseAsyncStateReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  return { state, execute, reset, setData, setError };
}

export default useAsyncState;
```

### **useApi Hook**
```typescript
// src/hooks/useApi.ts
import { useEffect } from 'react';
import useAsyncState from './useAsyncState';
import { useAuth } from '../context/AuthContext';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  skip?: boolean;
  dependencies?: any[];
}

function useApi<T>(url: string, options: ApiOptions = {}) {
  const { state, execute, reset, setError } = useAsyncState<T>();
  const { state: authState } = useAuth();
  
  const {
    method = 'GET',
    headers = {},
    body,
    skip = false,
    dependencies = []
  } = options;

  const fetchData = async (): Promise<T> => {
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (authState.token) {
      requestHeaders.Authorization = `Bearer ${authState.token}`;
    }

    const config: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - token might be expired
        throw new Error('Unauthorized access');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const refetch = () => execute(fetchData);

  useEffect(() => {
    if (!skip) {
      execute(fetchData).catch(error => {
        console.error('API request failed:', error);
      });
    }
  }, [url, method, skip, authState.token, ...dependencies]);

  return {
    ...state,
    refetch,
    reset,
    setError,
  };
}

export default useApi;
```

### **useForm Hook**
```typescript
// src/hooks/useForm.ts
import { useState, useCallback } from 'react';

interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

interface FormField<T> {
  value: T;
  error: string | null;
  touched: boolean;
  rules?: ValidationRule<T>;
}

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule<T[keyof T]>>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>) {
  const [fields, setFields] = useState<Record<keyof T, FormField<T[keyof T]>>>(() => {
    const initialFields = {} as Record<keyof T, FormField<T[keyof T]>>;
    
    Object.keys(initialValues).forEach(key => {
      const fieldKey = key as keyof T;
      initialFields[fieldKey] = {
        value: initialValues[fieldKey],
        error: null,
        touched: false,
        rules: validationRules[fieldKey],
      };
    });
    
    return initialFields;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (fieldName: keyof T, value: T[keyof T]): string | null => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    if (rules.required && (!value || value === '')) {
      return 'This field is required';
    }

    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`;
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`;
    }

    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  };

  const setFieldValue = useCallback((fieldName: keyof T, value: T[keyof T]) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        error: validateField(fieldName, value),
      },
    }));
  }, [validationRules]);

  const setFieldTouched = useCallback((fieldName: keyof T, touched = true) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched,
      },
    }));
  }, []);

  const setFieldError = useCallback((fieldName: keyof T, error: string | null) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error,
      },
    }));
  }, []);

  const validateAllFields = (): boolean => {
    let isValid = true;
    const updatedFields = { ...fields };

    Object.keys(fields).forEach(key => {
      const fieldKey = key as keyof T;
      const field = fields[fieldKey];
      const error = validateField(fieldKey, field.value);
      
      updatedFields[fieldKey] = {
        ...field,
        error,
        touched: true,
      };

      if (error) {
        isValid = false;
      }
    });

    setFields(updatedFields);
    return isValid;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateAllFields() || !onSubmit) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const values = {} as T;
      Object.keys(fields).forEach(key => {
        const fieldKey = key as keyof T;
        values[fieldKey] = fields[fieldKey].value;
      });

      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = useCallback(() => {
    setFields(prev => {
      const resetFields = {} as Record<keyof T, FormField<T[keyof T]>>;
      
      Object.keys(prev).forEach(key => {
        const fieldKey = key as keyof T;
        resetFields[fieldKey] = {
          value: initialValues[fieldKey],
          error: null,
          touched: false,
          rules: validationRules[fieldKey],
        };
      });
      
      return resetFields;
    });
    setIsSubmitting(false);
  }, [initialValues, validationRules]);

  const getFieldProps = (fieldName: keyof T) => ({
    value: fields[fieldName].value,
    onChange: (value: T[keyof T]) => setFieldValue(fieldName, value),
    onBlur: () => setFieldTouched(fieldName),
    error: fields[fieldName].touched ? fields[fieldName].error : null,
  });

  const values = Object.keys(fields).reduce((acc, key) => {
    const fieldKey = key as keyof T;
    acc[fieldKey] = fields[fieldKey].value;
    return acc;
  }, {} as T);

  const errors = Object.keys(fields).reduce((acc, key) => {
    const fieldKey = key as keyof T;
    acc[fieldKey] = fields[fieldKey].error;
    return acc;
  }, {} as Record<keyof T, string | null>);

  const touched = Object.keys(fields).reduce((acc, key) => {
    const fieldKey = key as keyof T;
    acc[fieldKey] = fields[fieldKey].touched;
    return acc;
  }, {} as Record<keyof T, boolean>);

  const isValid = Object.values(errors).every(error => !error);
  const isDirty = Object.keys(fields).some(key => {
    const fieldKey = key as keyof T;
    return fields[fieldKey].value !== initialValues[fieldKey];
  });

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    getFieldProps,
    handleSubmit,
    reset,
    validateAllFields,
  };
}

export default useForm;
```

### **usePagination Hook**
```typescript
// src/hooks/usePagination.ts
import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  getPageItems: <T>(items: T[]) => T[];
  getVisiblePages: (visibleCount?: number) => number[];
}

function usePagination({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => {
    if (!isLastPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (!isFirstPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const getPageItems = <T>(items: T[]): T[] => {
    return items.slice(startIndex, endIndex);
  };

  const getVisiblePages = (visibleCount = 5): number[] => {
    const half = Math.floor(visibleCount / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + visibleCount - 1, totalPages);

    if (end - start + 1 < visibleCount) {
      start = Math.max(end - visibleCount + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    isFirstPage,
    isLastPage,
    goToPage,
    nextPage,
    prevPage,
    getPageItems,
    getVisiblePages,
  };
}

export default usePagination;
```

## 🌐 **Global State Providers**

### **App Providers Setup**
```typescript
// src/providers/AppProviders.tsx
import React, { ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { BookingProvider } from '../context/BookingContext';
import { ThemeProvider } from '../context/ThemeContext';
import { NotificationProvider } from '../context/NotificationContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

### **Notification Context**
```typescript
// src/context/NotificationContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationState {
  notifications: Notification[];
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' };

const initialState: NotificationState = {
  notifications: [],
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  const success = (title: string, message?: string) => {
    showNotification({ type: 'success', title, message });
  };

  const error = (title: string, message?: string) => {
    showNotification({ type: 'error', title, message, persistent: true });
  };

  const warning = (title: string, message?: string) => {
    showNotification({ type: 'warning', title, message });
  };

  const info = (title: string, message?: string) => {
    showNotification({ type: 'info', title, message });
  };

  const value = {
    notifications: state.notifications,
    showNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
```

## 📊 **State Performance Optimization**

### **State Normalization**
```typescript
// src/utils/stateNormalization.ts

// Normalized state structure untuk complex data
interface NormalizedState<T> {
  byId: Record<string, T>;
  allIds: string[];
}

function normalize<T extends { id: string }>(items: T[]): NormalizedState<T> {
  return {
    byId: items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
    allIds: items.map(item => item.id),
  };
}

function denormalize<T>(normalizedState: NormalizedState<T>): T[] {
  return normalizedState.allIds.map(id => normalizedState.byId[id]);
}

// Example: Train search results normalization
interface Train {
  id: string;
  name: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availability: number;
}

interface SearchState {
  trains: NormalizedState<Train>;
  loading: boolean;
  filters: {
    departureTime: string;
    class: string;
    priceRange: [number, number];
  };
}

function searchReducer(state: SearchState, action: any): SearchState {
  switch (action.type) {
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        trains: normalize(action.payload),
      };

    case 'UPDATE_TRAIN':
      return {
        ...state,
        trains: {
          ...state.trains,
          byId: {
            ...state.trains.byId,
            [action.payload.id]: {
              ...state.trains.byId[action.payload.id],
              ...action.payload.updates,
            },
          },
        },
      };

    default:
      return state;
  }
}
```

### **Memoization Strategies**
```typescript
// src/hooks/useMemoizedSelector.ts
import { useMemo } from 'react';

// Custom selector hook with memoization
function useMemoizedSelector<TState, TSelected>(
  state: TState,
  selector: (state: TState) => TSelected,
  dependencies: any[] = []
): TSelected {
  return useMemo(() => selector(state), [state, ...dependencies]);
}

// Usage example
function BookingComponent() {
  const { state } = useBooking();
  
  // Memoized complex calculation
  const bookingSummary = useMemoizedSelector(
    state,
    (state) => ({
      totalPassengers: state.currentBooking?.passengers.length || 0,
      totalPrice: state.currentBooking?.totalPrice || 0,
      hasAllSeatsSelected: state.currentBooking?.passengers.length === state.currentBooking?.seatSelections.length,
      canProceedToPayment: state.currentBooking?.passengers.length > 0 && 
                          state.currentBooking?.seatSelections.length > 0 &&
                          state.currentBooking?.contactInfo.email !== '',
    }),
    [state.currentBooking]
  );

  return (
    <div>
      <p>Passengers: {bookingSummary.totalPassengers}</p>
      <p>Total: {bookingSummary.totalPrice}</p>
      <button disabled={!bookingSummary.canProceedToPayment}>
        Proceed to Payment
      </button>
    </div>
  );
}
```

## 🔄 **State Persistence**

### **Persisted State Hook**
```typescript
// src/hooks/usePersistedState.ts
import { useState, useEffect } from 'react';

interface PersistedStateOptions {
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
  storage?: Storage;
}

function usePersistedState<T>(
  key: string,
  defaultValue: T,
  options: PersistedStateOptions = {}
): [T, (value: T | ((prev: T) => T)) => void] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    storage = localStorage,
  } = options;

  const [state, setState] = useState<T>(() => {
    try {
      const item = storage.getItem(key);
      return item ? deserialize(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading ${key} from storage:`, error);
      return defaultValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      storage.setItem(key, serialize(valueToStore));
    } catch (error) {
      console.warn(`Error setting ${key} in storage:`, error);
    }
  };

  return [state, setValue];
}

export default usePersistedState;
```

### **State Hydration**
```typescript
// src/utils/stateHydration.ts

// State hydration untuk SSR/preloading
interface HydrationOptions {
  version?: string;
  migrations?: Record<string, (state: any) => any>;
}

function hydrateState<T>(
  key: string,
  defaultState: T,
  options: HydrationOptions = {}
): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultState;

    const parsed = JSON.parse(stored);
    
    // Version checking
    if (options.version && parsed.version !== options.version) {
      const migration = options.migrations?.[parsed.version];
      if (migration) {
        const migrated = migration(parsed.data);
        const newState = { version: options.version, data: migrated };
        localStorage.setItem(key, JSON.stringify(newState));
        return migrated;
      } else {
        // No migration available, use default
        return defaultState;
      }
    }

    return parsed.data || defaultState;
  } catch (error) {
    console.warn(`Failed to hydrate state for ${key}:`, error);
    return defaultState;
  }
}

function persistState<T>(key: string, state: T, version?: string): void {
  try {
    const payload = { version, data: state };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (error) {
    console.warn(`Failed to persist state for ${key}:`, error);
  }
}
```

## 🧪 **Testing State Management**

### **Context Testing Utilities**
```typescript
// src/test-utils/contextTestUtils.tsx
import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppProviders } from '../providers/AppProviders';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withProviders?: boolean;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { withProviders = true, ...renderOptions } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => {
    return withProviders ? (
      <AppProviders>{children}</AppProviders>
    ) : (
      <>{children}</>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock context values untuk testing
export const mockAuthState = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    phone: '08123456789',
    role: 'user' as const,
    preferences: {
      language: 'id' as const,
      currency: 'IDR' as const,
      notifications: true,
    },
  },
  token: 'mock-token',
  isLoading: false,
  isAuthenticated: true,
  lastActivity: new Date(),
  sessionExpiry: new Date(Date.now() + 3600000),
};

export const mockBookingState = {
  currentBooking: null,
  searchResults: [],
  selectedRoute: null,
  isLoading: false,
  error: null,
  step: 'search' as const,
  bookingHistory: [],
};
```

---

**🗂️ Efficient State Management - Scalable, Predictable, Maintainable** ✨
