import { eq, like, and, desc, asc, gte, lte, between } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { orderTickets } from "../../db/schema.ts";
import { OrderTicket } from "../interface/order-tickets-interface.ts";

// Get all order tickets
export const getAllOrderTickets = async (): Promise<OrderTicket[]> => {
  const collection = await db
    .select()
    .from(orderTickets)
    .orderBy(desc(orderTickets.orderDate));
  return collection as OrderTicket[];
};

// Get order ticket by UUID
export const getOrderTicketByUuid = async (
  uuid: string
): Promise<OrderTicket | null> => {
  const orderTicket = await db
    .select()
    .from(orderTickets)
    .where(eq(orderTickets.uuid, uuid))
    .limit(1);
  return (orderTicket[0] as OrderTicket) || null;
};

// Get order ticket by invoice number
export const getOrderTicketByInvoiceNumber = async (
  invoiceNumber: string
): Promise<OrderTicket | null> => {
  const orderTicket = await db
    .select()
    .from(orderTickets)
    .where(eq(orderTickets.invoiceNumber, invoiceNumber))
    .limit(1);
  return (orderTicket[0] as OrderTicket) || null;
};

// Get order tickets by user ID
export const getOrderTicketsByUserId = async (
  userId: string
): Promise<OrderTicket[]> => {
  const collection = await db
    .select()
    .from(orderTickets)
    .where(eq(orderTickets.userId, userId))
    .orderBy(desc(orderTickets.orderDate));
  return collection as OrderTicket[];
};

// Get order tickets by status
export const getOrderTicketsByStatus = async (
  status: string
): Promise<OrderTicket[]> => {
  const collection = await db
    .select()
    .from(orderTickets)
    .where(eq(orderTickets.status, status))
    .orderBy(desc(orderTickets.orderDate));
  return collection as OrderTicket[];
};

// Search order tickets by invoice number
export const searchOrderTicketsByInvoiceNumber = async (
  invoiceNumber: string
): Promise<OrderTicket[]> => {
  const collection = await db
    .select()
    .from(orderTickets)
    .where(like(orderTickets.invoiceNumber, `%${invoiceNumber}%`))
    .orderBy(desc(orderTickets.orderDate));
  return collection as OrderTicket[];
};

// Get order tickets by price range
export const getOrderTicketsByPriceRange = async (
  minPrice: number,
  maxPrice: number
): Promise<OrderTicket[]> => {
  const collection = await db
    .select()
    .from(orderTickets)
    .where(
      and(
        gte(orderTickets.totalPrice, minPrice),
        lte(orderTickets.totalPrice, maxPrice)
      )
    )
    .orderBy(desc(orderTickets.orderDate));
  return collection as OrderTicket[];
};

// Create new order ticket
export const createOrderTicket = async (
  newOrderTicket: Omit<OrderTicket, "uuid" | "createdAt" | "updatedAt">
): Promise<OrderTicket> => {
  const createdOrderTicket = await db
    .insert(orderTickets)
    .values(newOrderTicket as any)
    .returning();
  return createdOrderTicket[0] as OrderTicket;
};

// Update order ticket
export const updateOrderTicket = async (
  uuid: string,
  orderTicketData: Partial<OrderTicket>
): Promise<OrderTicket | null> => {
  const updatedOrderTicket = await db
    .update(orderTickets)
    .set({
      ...orderTicketData,
      updatedAt: new Date(),
    })
    .where(eq(orderTickets.uuid, uuid))
    .returning();
  return (updatedOrderTicket[0] as OrderTicket) || null;
};

// Update order ticket status
export const updateOrderTicketStatus = async (
  uuid: string,
  status: string
): Promise<OrderTicket | null> => {
  const updatedOrderTicket = await db
    .update(orderTickets)
    .set({
      status: status,
      updatedAt: new Date(),
    })
    .where(eq(orderTickets.uuid, uuid))
    .returning();
  return (updatedOrderTicket[0] as OrderTicket) || null;
};

// Delete order ticket
export const deleteOrderTicket = async (uuid: string): Promise<boolean> => {
  const deletedOrderTicket = await db
    .delete(orderTickets)
    .where(eq(orderTickets.uuid, uuid))
    .returning();
  return deletedOrderTicket.length > 0;
};

// Get order tickets with pagination
export const getOrderTicketsWithPagination = async (
  page: number = 1,
  pageSize: number = 10,
  orderBy: "date_asc" | "date_desc" | "price_asc" | "price_desc" = "date_desc"
): Promise<OrderTicket[]> => {
  const offset = (page - 1) * pageSize;

  let orderByClause;
  switch (orderBy) {
    case "date_asc":
      orderByClause = asc(orderTickets.orderDate);
      break;
    case "date_desc":
      orderByClause = desc(orderTickets.orderDate);
      break;
    case "price_asc":
      orderByClause = asc(orderTickets.totalPrice);
      break;
    case "price_desc":
      orderByClause = desc(orderTickets.totalPrice);
      break;
    default:
      orderByClause = desc(orderTickets.orderDate);
  }

  const collection = await db
    .select()
    .from(orderTickets)
    .orderBy(orderByClause)
    .limit(pageSize)
    .offset(offset);
  return collection as OrderTicket[];
};

// Count total order tickets
export const countOrderTickets = async (): Promise<number> => {
  const result = await db.select().from(orderTickets);
  return result.length;
};

// Count order tickets by status
export const countOrderTicketsByStatus = async (
  status: string
): Promise<number> => {
  const result = await db
    .select()
    .from(orderTickets)
    .where(eq(orderTickets.status, status));
  return result.length;
};

// Get total revenue
export const getTotalRevenue = async (): Promise<number> => {
  const result = await db
    .select()
    .from(orderTickets)
    .where(eq(orderTickets.status, "paid"));

  return result.reduce((total, order) => total + (order.totalPrice || 0), 0);
};

// Get revenue by date range
export const getRevenueByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<number> => {
  const result = await db
    .select()
    .from(orderTickets)
    .where(
      and(
        eq(orderTickets.status, "paid"),
        between(orderTickets.orderDate, startDate, endDate)
      )
    );

  return result.reduce((total, order) => total + (order.totalPrice || 0), 0);
};
