// User interfaces
export interface User {
  uuid: string;
  name?: string;
  age?: number;
  email: string;
  password: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}