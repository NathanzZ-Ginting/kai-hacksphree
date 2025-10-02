// Order Detail interfaces
export interface OrderDetail {
  uuid: string;
  orderId?: string;
  ticketId?: string;
  passengerName?: string;
  passengerType?: string;
  seatNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}