// frontend/src/types/kai.ts
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

// News type definition
export interface News {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

// Train route type definition
export interface TrainRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  duration: string;
  type: string[];
}

// FAQ type definition
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Station type definition
export interface Station {
  uuid: string;
  name: string;
  stationCode: string;
  locationId: string;
  createdAt: string;
  updatedAt: string;
  lat?: number;
  lng?: number;
  city?: string;
}

// User type definition
export interface User {
  uuid: string;
  name: string;
  age: number;
  email: string;
  password: string;
  token: string | null;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

// Register data and response types
export interface RegisterData {
  user: User;
  token: string;
}

// Response type for registration
export interface RegisterResponse {
  success: boolean;
  message: string;
  data: RegisterData;
}

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}
