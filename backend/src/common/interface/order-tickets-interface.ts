// Order Ticket interfaces
export interface OrderTicket {
  uuid: string;
  userId?: string;
  invoiceNumber: string;
  status?: string;
  orderDate: Date;
  totalPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}
