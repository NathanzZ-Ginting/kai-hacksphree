// Order Detail interfaces
export interface OrderDetail {
  uuid: string;
  orderId?: string;
  ticketId?: string;
  passengerType?: "dewasa" | "anak-anak";
  seatNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}
