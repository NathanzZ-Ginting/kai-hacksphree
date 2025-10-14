# 🌐 Frontend API Reference

## 📋 **Overview**

Dokumentasi komprehensif untuk integasi API pada aplikasi KAI Frontend, termasuk endpoints, authentication, error handling, dan best practices untuk komunikasi dengan backend services.

## 🔧 **API Configuration**

### **Base API Client Setup**
```typescript
// src/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { config } from '../config/environment';
import { useAuth } from '../context/AuthContext';
import { captureException } from '../utils/sentry';

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private client: AxiosInstance;
  private authStore: any;

  constructor() {
    this.client = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor untuk menambahkan auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('kai_auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID untuk tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Add timestamp
        config.headers['X-Request-Time'] = new Date().toISOString();

        return config;
      },
      (error) => {
        captureException(error, { context: 'request_interceptor' });
        return Promise.reject(error);
      }
    );

    // Response interceptor untuk handle common responses
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        return response;
      },
      async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = localStorage.getItem('kai_auth_token');
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            // Redirect to login jika refresh token gagal
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }

        // Handle network errors
        if (!error.response) {
          const networkError: ApiError = {
            message: 'Network error. Please check your connection.',
            status: 0,
            code: 'NETWORK_ERROR',
          };
          return Promise.reject(networkError);
        }

        // Transform error response
        const apiError: ApiError = {
          message: error.response.data?.message || 'An error occurred',
          status: error.response.status,
          code: error.response.data?.code,
          errors: error.response.data?.errors,
        };

        // Log error untuk monitoring
        captureException(error, {
          context: 'api_response_error',
          status: error.response.status,
          url: error.config?.url,
          method: error.config?.method,
        });

        return Promise.reject(apiError);
      }
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('kai_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${config.API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const { token, refreshToken: newRefreshToken } = response.data.data;
    localStorage.setItem('kai_auth_token', token);
    localStorage.setItem('kai_refresh_token', newRefreshToken);
  }

  private handleAuthFailure(): void {
    localStorage.removeItem('kai_auth_token');
    localStorage.removeItem('kai_refresh_token');
    localStorage.removeItem('kai_user_data');
    
    // Redirect ke login page
    window.location.href = '/auth/login';
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // File upload
  async upload<T>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };
```

### **Request/Response Types**
```typescript
// src/types/api.ts

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
}

export interface ApiRequestConfig {
  cache?: boolean;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiMetadata {
  requestId: string;
  timestamp: string;
  version: string;
  server: string;
}

export interface ApiListResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  metadata?: ApiMetadata;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  errors?: ValidationError[];
  details?: Record<string, any>;
  metadata?: ApiMetadata;
}
```

## 🔐 **Authentication API**

### **Auth Service**
```typescript
// src/api/services/authService.ts
import { apiClient, ApiResponse } from '../client';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: 'user' | 'admin';
    avatar?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    preferences: {
      language: 'id' | 'en';
      currency: 'IDR' | 'USD';
      notifications: boolean;
    };
  };
  token: string;
  refreshToken: string;
  expiresIn: number; // seconds
  permissions: string[];
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  captcha: string;
  referralCode?: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  verificationRequired: boolean;
}

export interface PasswordResetRequest {
  email: string;
  captcha: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyPhoneRequest {
  phone: string;
  code: string;
}

class AuthService {
  /**
   * Login user dengan email dan password
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  }

  /**
   * Register user baru
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/refresh', data);
    return response.data;
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/password/reset', data);
    return response.data;
  }

  /**
   * Reset password menggunakan token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/password/reset/confirm', {
      token,
      newPassword,
    });
    return response.data;
  }

  /**
   * Change password (saat user sudah login)
   */
  async changePassword(data: PasswordChangeRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/password/change', data);
    return response.data;
  }

  /**
   * Verify email address
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/email/verify', data);
    return response.data;
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/email/resend');
    return response.data;
  }

  /**
   * Verify phone number
   */
  async verifyPhone(data: VerifyPhoneRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/phone/verify', data);
    return response.data;
  }

  /**
   * Send phone verification code
   */
  async sendPhoneVerification(phone: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/phone/send', { phone });
    return response.data;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<LoginResponse['user']> {
    const response = await apiClient.get<LoginResponse['user']>('/auth/profile');
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<LoginResponse['user']>): Promise<LoginResponse['user']> {
    const response = await apiClient.patch<LoginResponse['user']>('/auth/profile', data);
    return response.data;
  }
}

export const authService = new AuthService();
```

## 🚂 **Booking API**

### **Booking Service**
```typescript
// src/api/services/bookingService.ts
import { apiClient, ApiResponse } from '../client';
import { PaginationParams, ApiListResponse } from '../../types/api';

export interface Station {
  id: string;
  code: string;
  name: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  facilities: string[];
  active: boolean;
}

export interface Train {
  id: string;
  code: string;
  name: string;
  type: 'executive' | 'business' | 'economy';
  facilities: string[];
  cars: TrainCar[];
  active: boolean;
}

export interface TrainCar {
  id: string;
  number: string;
  class: 'executive' | 'business' | 'economy';
  seatCount: number;
  layout: string; // e.g., "2-2" untuk business class
  facilities: string[];
}

export interface Seat {
  id: string;
  number: string;
  row: number;
  column: string;
  type: 'window' | 'aisle' | 'middle';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  price: number;
  carId: string;
}

export interface Schedule {
  id: string;
  trainId: string;
  train: Train;
  departureStationId: string;
  departureStation: Station;
  arrivalStationId: string;
  arrivalStation: Station;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  duration: number; // minutes
  distance: number; // kilometers
  price: {
    executive: number;
    business: number;
    economy: number;
  };
  availability: {
    executive: number;
    business: number;
    economy: number;
  };
  status: 'active' | 'cancelled' | 'delayed';
  delay?: number; // minutes
}

export interface SearchRequest {
  departureStationId: string;
  arrivalStationId: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD untuk round trip
  passengers: {
    adult: number;
    child: number;
    infant: number;
  };
  class?: 'executive' | 'business' | 'economy';
  timePreference?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface SearchResponse {
  outbound: Schedule[];
  inbound?: Schedule[]; // untuk round trip
  filters: {
    classes: string[];
    priceRange: {
      min: number;
      max: number;
    };
    stations: Station[];
  };
}

export interface Passenger {
  id?: string;
  title: 'Mr' | 'Mrs' | 'Ms';
  firstName: string;
  lastName: string;
  identityType: 'ktp' | 'passport' | 'sim';
  identityNumber: string;
  birthDate: string; // YYYY-MM-DD
  nationality: string;
  email?: string;
  phone?: string;
  type: 'adult' | 'child' | 'infant';
}

export interface SeatSelection {
  passengerId: string;
  scheduleId: string;
  carId: string;
  seatId: string;
  price: number;
}

export interface BookingRequest {
  scheduleId: string;
  returnScheduleId?: string; // untuk round trip
  passengers: Passenger[];
  seatSelections: SeatSelection[];
  contactInfo: {
    email: string;
    phone: string;
  };
  additionalServices: {
    insurance: boolean;
    meal: boolean;
    wifi: boolean;
  };
  paymentMethod: string;
  promoCode?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  scheduleId: string;
  schedule: Schedule;
  returnScheduleId?: string;
  returnSchedule?: Schedule;
  passengers: (Passenger & { seatNumber: string; carNumber: string })[];
  totalPrice: number;
  discount: number;
  tax: number;
  finalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  paymentUrl?: string;
  expiresAt: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  contactInfo: {
    email: string;
    phone: string;
  };
  additionalServices: {
    insurance: boolean;
    meal: boolean;
    wifi: boolean;
  };
  tickets: Ticket[];
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  passengerId: string;
  passenger: Passenger;
  scheduleId: string;
  schedule: Schedule;
  seatNumber: string;
  carNumber: string;
  price: number;
  status: 'active' | 'used' | 'cancelled';
  qrCode: string;
  checkedIn: boolean;
  checkedInAt?: string; // ISO string
}

class BookingService {
  /**
   * Get all stations
   */
  async getStations(params?: PaginationParams & { search?: string; active?: boolean }): Promise<ApiListResponse<Station>> {
    const response = await apiClient.get<ApiListResponse<Station>>('/stations', { params });
    return response.data;
  }

  /**
   * Get station by ID
   */
  async getStation(id: string): Promise<Station> {
    const response = await apiClient.get<Station>(`/stations/${id}`);
    return response.data;
  }

  /**
   * Search trains/schedules
   */
  async searchSchedules(searchParams: SearchRequest): Promise<SearchResponse> {
    const response = await apiClient.post<SearchResponse>('/schedules/search', searchParams);
    return response.data;
  }

  /**
   * Get schedule details
   */
  async getSchedule(id: string): Promise<Schedule> {
    const response = await apiClient.get<Schedule>(`/schedules/${id}`);
    return response.data;
  }

  /**
   * Get available seats for a schedule
   */
  async getAvailableSeats(scheduleId: string, carId?: string): Promise<Seat[]> {
    const params = carId ? { carId } : undefined;
    const response = await apiClient.get<Seat[]>(`/schedules/${scheduleId}/seats`, { params });
    return response.data;
  }

  /**
   * Create booking
   */
  async createBooking(bookingData: BookingRequest): Promise<Booking> {
    const response = await apiClient.post<Booking>('/bookings', bookingData);
    return response.data;
  }

  /**
   * Get booking by ID
   */
  async getBooking(id: string): Promise<Booking> {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  }

  /**
   * Get booking by booking code
   */
  async getBookingByCode(bookingCode: string): Promise<Booking> {
    const response = await apiClient.get<Booking>(`/bookings/code/${bookingCode}`);
    return response.data;
  }

  /**
   * Get user's booking history
   */
  async getBookingHistory(params?: PaginationParams & { status?: string; dateFrom?: string; dateTo?: string }): Promise<ApiListResponse<Booking>> {
    const response = await apiClient.get<ApiListResponse<Booking>>('/bookings/history', { params });
    return response.data;
  }

  /**
   * Cancel booking
   */
  async cancelBooking(id: string, reason?: string): Promise<{ message: string; refundAmount?: number }> {
    const response = await apiClient.post<{ message: string; refundAmount?: number }>(`/bookings/${id}/cancel`, { reason });
    return response.data;
  }

  /**
   * Update booking (before payment)
   */
  async updateBooking(id: string, updateData: Partial<BookingRequest>): Promise<Booking> {
    const response = await apiClient.patch<Booking>(`/bookings/${id}`, updateData);
    return response.data;
  }

  /**
   * Get ticket by ID
   */
  async getTicket(id: string): Promise<Ticket> {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`);
    return response.data;
  }

  /**
   * Check in passenger
   */
  async checkInPassenger(ticketId: string): Promise<{ message: string; checkedInAt: string }> {
    const response = await apiClient.post<{ message: string; checkedInAt: string }>(`/tickets/${ticketId}/checkin`);
    return response.data;
  }

  /**
   * Get schedule status (for real-time updates)
   */
  async getScheduleStatus(scheduleId: string): Promise<{ status: string; delay?: number; platform?: string }> {
    const response = await apiClient.get<{ status: string; delay?: number; platform?: string }>(`/schedules/${scheduleId}/status`);
    return response.data;
  }

  /**
   * Validate promo code
   */
  async validatePromoCode(code: string, totalAmount: number): Promise<{ valid: boolean; discount: number; message: string }> {
    const response = await apiClient.post<{ valid: boolean; discount: number; message: string }>('/promo/validate', {
      code,
      totalAmount,
    });
    return response.data;
  }
}

export const bookingService = new BookingService();
```

## 💳 **Payment API**

### **Payment Service**
```typescript
// src/api/services/paymentService.ts
import { apiClient, ApiResponse } from '../client';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank_transfer' | 'credit_card' | 'debit_card' | 'e_wallet' | 'virtual_account';
  provider: string;
  logo: string;
  fee: number;
  feeType: 'fixed' | 'percentage';
  minAmount?: number;
  maxAmount?: number;
  active: boolean;
  processingTime: string; // e.g., "Instant", "1-2 hours"
}

export interface PaymentRequest {
  bookingId: string;
  paymentMethodId: string;
  amount: number;
  currency: 'IDR';
  callbackUrl?: string;
}

export interface PaymentResponse {
  id: string;
  paymentUrl?: string;
  paymentCode?: string;
  virtualAccountNumber?: string;
  qrCode?: string;
  instructions: string[];
  expiresAt: string; // ISO string
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'expired';
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'expired';
  amount: number;
  paidAmount?: number;
  paidAt?: string; // ISO string
  fee: number;
  transactionId?: string;
  receipt?: {
    url: string;
    number: string;
  };
}

export interface RefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
}

export interface RefundResponse {
  id: string;
  status: 'pending' | 'processed' | 'failed';
  amount: number;
  fee: number;
  netAmount: number;
  processedAt?: string; // ISO string
  estimatedArrival: string;
}

class PaymentService {
  /**
   * Get available payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get<PaymentMethod[]>('/payment/methods');
    return response.data;
  }

  /**
   * Create payment
   */
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    const response = await apiClient.post<PaymentResponse>('/payment/create', paymentData);
    return response.data;
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const response = await apiClient.get<PaymentStatus>(`/payment/${paymentId}/status`);
    return response.data;
  }

  /**
   * Cancel payment
   */
  async cancelPayment(paymentId: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(`/payment/${paymentId}/cancel`);
    return response.data;
  }

  /**
   * Request refund
   */
  async requestRefund(refundData: RefundRequest): Promise<RefundResponse> {
    const response = await apiClient.post<RefundResponse>('/payment/refund', refundData);
    return response.data;
  }

  /**
   * Get refund status
   */
  async getRefundStatus(refundId: string): Promise<RefundResponse> {
    const response = await apiClient.get<RefundResponse>(`/payment/refund/${refundId}`);
    return response.data;
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(params?: { page?: number; limit?: number; status?: string }): Promise<{
    payments: PaymentStatus[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await apiClient.get('/payment/history', { params });
    return response.data;
  }
}

export const paymentService = new PaymentService();
```

## 🔧 **Utility Services**

### **File Upload Service**
```typescript
// src/api/services/uploadService.ts
import { apiClient } from '../client';

export interface UploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
}

export interface UploadOptions {
  onProgress?: (progress: number) => void;
  maxSize?: number; // bytes
  allowedTypes?: string[];
  folder?: string;
}

class UploadService {
  /**
   * Upload single file
   */
  async uploadFile(file: File, options: UploadOptions = {}): Promise<UploadResponse> {
    const { onProgress, maxSize, allowedTypes, folder } = options;

    // Validate file size
    if (maxSize && file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize} bytes`);
    }

    // Validate file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await apiClient.upload<UploadResponse>('/upload', formData, onProgress);
    return response.data;
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(files: File[], options: UploadOptions = {}): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete uploaded file
   */
  async deleteFile(fileId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/upload/${fileId}`);
    return response.data;
  }

  /**
   * Get file info
   */
  async getFileInfo(fileId: string): Promise<UploadResponse> {
    const response = await apiClient.get<UploadResponse>(`/upload/${fileId}`);
    return response.data;
  }
}

export const uploadService = new UploadService();
```

### **Notification Service**
```typescript
// src/api/services/notificationService.ts
import { apiClient } from '../client';
import { PaginationParams, ApiListResponse } from '../../types/api';

export interface Notification {
  id: string;
  type: 'booking' | 'payment' | 'schedule' | 'promotion' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: string; // ISO string
  createdAt: string; // ISO string
  priority: 'low' | 'normal' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationPreferences {
  email: {
    booking: boolean;
    payment: boolean;
    schedule: boolean;
    promotion: boolean;
    system: boolean;
  };
  push: {
    booking: boolean;
    payment: boolean;
    schedule: boolean;
    promotion: boolean;
    system: boolean;
  };
  sms: {
    booking: boolean;
    payment: boolean;
    schedule: boolean;
  };
}

class NotificationService {
  /**
   * Get user notifications
   */
  async getNotifications(params?: PaginationParams & { read?: boolean; type?: string }): Promise<ApiListResponse<Notification>> {
    const response = await apiClient.get<ApiListResponse<Notification>>('/notifications', { params });
    return response.data;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(`/notifications/${notificationId}/read`);
    return response.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ message: string; count: number }> {
    const response = await apiClient.patch<{ message: string; count: number }>('/notifications/read-all');
    return response.data;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/notifications/${notificationId}`);
    return response.data;
  }

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get<NotificationPreferences>('/notifications/preferences');
    return response.data;
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await apiClient.patch<NotificationPreferences>('/notifications/preferences', preferences);
    return response.data;
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribePush(subscription: PushSubscription): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/notifications/push/subscribe', {
      subscription: subscription.toJSON(),
    });
    return response.data;
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribePush(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/notifications/push/unsubscribe');
    return response.data;
  }
}

export const notificationService = new NotificationService();
```

## 🎯 **Custom Hooks for API Integration**

### **useApi Hook**
```typescript
// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../api/client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseApiOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      onSuccess?.(result);
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({ ...prev, loading: false, error: apiError }));
      onError?.(apiError);
      throw error;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return {
    ...state,
    execute,
    reset,
  };
}
```

### **useInfiniteQuery Hook**
```typescript
// src/hooks/useInfiniteQuery.ts
import { useState, useCallback } from 'react';
import { ApiListResponse } from '../types/api';

interface UseInfiniteQueryOptions<T> {
  initialPage?: number;
  pageSize?: number;
  onSuccess?: (data: T[]) => void;
  onError?: (error: any) => void;
}

export function useInfiniteQuery<T>(
  queryFunction: (page: number, limit: number) => Promise<ApiListResponse<T>>,
  options: UseInfiniteQueryOptions<T> = {}
) {
  const { initialPage = 1, pageSize = 20, onSuccess, onError } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(initialPage);

  const fetchNextPage = useCallback(async () => {
    if (loading || !hasNextPage) return;

    setLoading(true);
    setError(null);

    try {
      const result = await queryFunction(page, pageSize);
      const newData = page === initialPage ? result.items : [...data, ...result.items];
      
      setData(newData);
      setHasNextPage(result.pagination.hasNext);
      setPage(prev => prev + 1);
      onSuccess?.(newData);
    } catch (err) {
      setError(err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, loading, hasNextPage, data, queryFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasNextPage(true);
    setError(null);
  }, [initialPage]);

  const refresh = useCallback(async () => {
    reset();
    await fetchNextPage();
  }, [reset, fetchNextPage]);

  return {
    data,
    loading,
    error,
    hasNextPage,
    fetchNextPage,
    reset,
    refresh,
  };
}
```

## ❌ **Error Handling**

### **Error Handling Best Practices**
```typescript
// src/utils/errorHandling.ts
import { ApiError } from '../api/client';
import { useNotifications } from '../context/NotificationContext';

export class ApiErrorHandler {
  private notifications = useNotifications();

  handleError(error: ApiError, context?: string) {
    // Log error untuk debugging
    console.error(`API Error in ${context}:`, error);

    // Handle specific error cases
    switch (error.status) {
      case 400:
        this.handleBadRequest(error);
        break;
      case 401:
        this.handleUnauthorized(error);
        break;
      case 403:
        this.handleForbidden(error);
        break;
      case 404:
        this.handleNotFound(error);
        break;
      case 429:
        this.handleRateLimit(error);
        break;
      case 500:
        this.handleServerError(error);
        break;
      default:
        this.handleGenericError(error);
    }
  }

  private handleBadRequest(error: ApiError) {
    if (error.errors) {
      // Validation errors
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach(message => {
          this.notifications.error(`${field}: ${message}`);
        });
      });
    } else {
      this.notifications.error(error.message);
    }
  }

  private handleUnauthorized(error: ApiError) {
    this.notifications.error('Your session has expired. Please log in again.');
    // Redirect to login
    window.location.href = '/auth/login';
  }

  private handleForbidden(error: ApiError) {
    this.notifications.error('You do not have permission to perform this action.');
  }

  private handleNotFound(error: ApiError) {
    this.notifications.error('The requested resource was not found.');
  }

  private handleRateLimit(error: ApiError) {
    this.notifications.warning('Too many requests. Please try again later.');
  }

  private handleServerError(error: ApiError) {
    this.notifications.error('Server error occurred. Please try again later.');
  }

  private handleGenericError(error: ApiError) {
    this.notifications.error(error.message || 'An unexpected error occurred.');
  }
}

export const apiErrorHandler = new ApiErrorHandler();
```

## 🔄 **WebSocket Integration**

### **WebSocket Service**
```typescript
// src/api/services/websocketService.ts
import { config } from '../../config/environment';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface WebSocketOptions {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private heartbeatInterval = 30000;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(options: WebSocketOptions = {}) {
    this.maxReconnectAttempts = options.reconnectAttempts ?? 5;
    this.reconnectInterval = options.reconnectInterval ?? 5000;
    this.heartbeatInterval = options.heartbeatInterval ?? 30000;
  }

  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = new URL(config.WS_URL);
        if (token) {
          wsUrl.searchParams.set('token', token);
        }

        this.ws = new WebSocket(wsUrl.toString());

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.stopHeartbeat();
          
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect(token);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Disconnected by client');
      this.ws = null;
    }
  }

  send(type: string, data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  subscribe(type: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(type);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    const callbacks = this.listeners.get(message.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(message.data);
        } catch (error) {
          console.error('Error in WebSocket message handler:', error);
        }
      });
    }
  }

  private attemptReconnect(token?: string): void {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(token).catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, this.reconnectInterval);
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.send('ping', { timestamp: Date.now() });
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();
```

---

**🌐 Comprehensive API Integration - Robust, Scalable, Type-Safe** ✨
