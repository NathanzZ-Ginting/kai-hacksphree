import { Schedule } from "./schedules-interface";

// Ticket interfaces
export interface Ticket {
  uuid: string;
  scheduleId?: string;
  price?: number;
  tax?: number;
  createdAt: Date;
  updatedAt: Date;
  schedule?: Schedule;
}
