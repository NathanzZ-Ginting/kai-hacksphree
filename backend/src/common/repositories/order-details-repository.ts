import { eq, like, and, desc, asc } from "drizzle-orm";
import { db } from "../../db/index";
import { orderDetails } from "../../db/schema";
import { OrderDetail } from "../interface/order-details-interface";

// Get all order details
export const getAllOrderDetails = async (): Promise<OrderDetail[]> => {
  const collection = await db
    .select()
    .from(orderDetails)
    .orderBy(desc(orderDetails.createdAt));
  return collection as unknown as OrderDetail[];
};

// Get order detail by UUID
export const getDetailOrderByUuid = async (
  uuid: string
): Promise<OrderDetail | null> => {
  const orderDetail = await db
    .select()
    .from(orderDetails)
    .where(eq(orderDetails.uuid, uuid))
    .limit(1);
  return (orderDetail[0] as unknown as OrderDetail) || null;
};

// Get order details by order ID
export const getOrderDetailsByOrderId = async (
  orderId: string
): Promise<OrderDetail[]> => {
  const collection = await db
    .select()
    .from(orderDetails)
    .where(eq(orderDetails.orderId, orderId))
    .orderBy(desc(orderDetails.createdAt));
  return collection as unknown as OrderDetail[];
};

// Get order details by ticket ID
export const getOrderDetailsByTicketId = async (
  ticketId: string
): Promise<OrderDetail[]> => {
  const collection = await db
    .select()
    .from(orderDetails)
    .where(eq(orderDetails.ticketId, ticketId))
    .orderBy(desc(orderDetails.createdAt));
  return collection as unknown as OrderDetail[];
};

// Get order details by seat number
export const getOrderDetailsBySeatNumber = async (
  seatNumber: string
): Promise<OrderDetail[]> => {
  const collection = await db
    .select()
    .from(orderDetails)
    .where(eq(orderDetails.seatNumber, seatNumber))
    .orderBy(desc(orderDetails.createdAt));
  return collection as unknown as OrderDetail[];
};

// Create new order detail
export const createOrderDetail = async (
  newOrderDetail: Omit<OrderDetail, "uuid" | "createdAt" | "updatedAt">
): Promise<OrderDetail> => {
  const createdOrderDetail = await db
    .insert(orderDetails)
    .values(newOrderDetail as any)
    .returning();
  return createdOrderDetail[0] as unknown as OrderDetail;
};

// Update order detail
export const updateOrderDetail = async (
  uuid: string,
  orderDetailData: Partial<OrderDetail>
): Promise<OrderDetail | null> => {
  const updatedOrderDetail = await db
    .update(orderDetails)
    .set({
      ...orderDetailData,
      updatedAt: new Date(),
    } as any)
    .where(eq(orderDetails.uuid, uuid))
    .returning();
  return (updatedOrderDetail[0] as unknown as OrderDetail) || null;
};

// Note: passengerName field doesn't exist in the database schema
// This function has been removed

// Update order detail seat number
export const updateOrderDetailSeatNumber = async (
  uuid: string,
  seatNumber: string
): Promise<OrderDetail | null> => {
  const updatedOrderDetail = await db
    .update(orderDetails)
    .set({
      seatNumber: seatNumber,
      updatedAt: new Date(),
    })
    .where(eq(orderDetails.uuid, uuid))
    .returning();
  return (updatedOrderDetail[0] as unknown as OrderDetail) || null;
};

// Delete order detail
export const deleteOrderDetail = async (uuid: string): Promise<boolean> => {
  const deletedOrderDetail = await db
    .delete(orderDetails)
    .where(eq(orderDetails.uuid, uuid))
    .returning();
  return deletedOrderDetail.length > 0;
};

// Delete order details by order ID
export const deleteOrderDetailsByOrderId = async (
  orderId: string
): Promise<number> => {
  const deletedOrderDetails = await db
    .delete(orderDetails)
    .where(eq(orderDetails.orderId, orderId))
    .returning();
  return deletedOrderDetails.length;
};

// Get order details with pagination
export const getOrderDetailsWithPagination = async (
  page: number = 1,
  pageSize: number = 10,
  orderBy: "date_asc" | "date_desc" = "date_desc"
): Promise<OrderDetail[]> => {
  const offset = (page - 1) * pageSize;

  let orderByClause;
  switch (orderBy) {
    case "date_asc":
      orderByClause = asc(orderDetails.createdAt);
      break;
    case "date_desc":
      orderByClause = desc(orderDetails.createdAt);
      break;
    default:
      orderByClause = desc(orderDetails.createdAt);
  }

  const collection = await db
    .select()
    .from(orderDetails)
    .orderBy(orderByClause)
    .limit(pageSize)
    .offset(offset);
  return collection as unknown as OrderDetail[];
};

// Count total order details
export const countOrderDetails = async (): Promise<number> => {
  const result = await db.select().from(orderDetails);
  return result.length;
};

// Count order details by order ID
export const countOrderDetailsByOrderId = async (
  orderId: string
): Promise<number> => {
  const result = await db
    .select()
    .from(orderDetails)
    .where(eq(orderDetails.orderId, orderId));
  return result.length;
};

// Count order details by passenger type
export const countOrderDetailsByPassengerType = async (
  passengerType: "dewasa" | "anak-anak"
): Promise<number> => {
  const result = await db
    .select()
    .from(orderDetails)
    .where(eq(orderDetails.passengerType, passengerType));
  return result.length;
};

// Get order details by multiple order IDs
export const getOrderDetailsByMultipleOrderIds = async (
  orderIds: string[]
): Promise<OrderDetail[]> => {
  const collection = await db
    .select()
    .from(orderDetails)
    .where(and(...orderIds.map((id) => eq(orderDetails.orderId, id))))
    .orderBy(desc(orderDetails.createdAt));
  return collection as unknown as OrderDetail[];
};

// Check if seat number is available for a specific ticket
export const isSeatNumberAvailable = async (
  ticketId: string,
  seatNumber: string
): Promise<boolean> => {
  const result = await db
    .select()
    .from(orderDetails)
    .where(
      and(
        eq(orderDetails.ticketId, ticketId),
        eq(orderDetails.seatNumber, seatNumber)
      )
    )
    .limit(1);
  return result.length === 0;
};
