// Payment interfaces
export interface Payment {
  uuid: string;
  orderId?: string;
  invoicePayment?: string;
  amount?: number;
  status?: string;
  method?: string;
  createdAt: Date;
  updatedAt: Date;
}