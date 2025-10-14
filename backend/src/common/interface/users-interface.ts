// User interfaces
export interface User {
  uuid: string;
  name?: string;
  age?: number;
  email: string;
  token?: string;
  password: string;
  phoneNumber?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}