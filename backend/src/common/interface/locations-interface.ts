// Location interfaces
export interface Location {
  uuid: string;
  city?: string;
  description?: string;
  longitude?: string;
  latitude?: string;
  createdAt: Date;
  updatedAt: Date;
}