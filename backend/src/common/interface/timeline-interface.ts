// Timeline interfaces
export interface Timeline {
  uuid: string;
  name?: string;
  orderId?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}