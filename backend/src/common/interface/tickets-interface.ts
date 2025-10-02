// Ticket interfaces
export interface Ticket {
  uuid: string;
  scheduleId?: string;
  price?: number;
  tax?: number;
  createdAt: Date;
  updatedAt: Date;
}