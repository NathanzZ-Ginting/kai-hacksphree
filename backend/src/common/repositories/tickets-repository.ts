import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { tickets } from "../../db/schema.ts";
import { Ticket } from "../interface/tickets-interface.ts";

// Get all tickets
export const getAllTickets = async (): Promise<Ticket[]> => {
  const collection = await db
    .select()
    .from(tickets)
    .orderBy(asc(tickets.createdAt));
  return collection as Ticket[];
};

// Get ticket by UUID
export const getTicketByUuid = async (uuid: string): Promise<Ticket | null> => {
  const ticket = await db
    .select()
    .from(tickets)
    .where(eq(tickets.uuid, uuid))
    .limit(1);
  return (ticket[0] as Ticket) || null;
};

// Get tickets by schedule ID
export const getTicketsByScheduleId = async (
  scheduleId: string
): Promise<Ticket[]> => {
  const collection = await db
    .select()
    .from(tickets)
    .where(eq(tickets.scheduleId, scheduleId))
    .orderBy(asc(tickets.price));
  return collection as Ticket[];
};

// Get tickets by price range
export const getTicketsByPriceRange = async (
  minPrice: number,
  maxPrice: number
): Promise<Ticket[]> => {
  const collection = await db
    .select()
    .from(tickets)
    .where(and(gte(tickets.price, minPrice), lte(tickets.price, maxPrice)))
    .orderBy(asc(tickets.price));
  return collection as Ticket[];
};

// Get tickets by criteria
export const getTicketsByCriteria = async (criteria: {
  scheduleId?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Ticket[]> => {
  const conditions = [];

  if (criteria.scheduleId) {
    conditions.push(eq(tickets.scheduleId, criteria.scheduleId));
  }

  if (criteria.minPrice !== undefined) {
    conditions.push(gte(tickets.price, criteria.minPrice));
  }

  if (criteria.maxPrice !== undefined) {
    conditions.push(lte(tickets.price, criteria.maxPrice));
  }

  let collection;
  if (conditions.length > 0) {
    collection = await db
      .select()
      .from(tickets)
      .where(and(...conditions))
      .orderBy(asc(tickets.price));
  } else {
    collection = await db.select().from(tickets).orderBy(asc(tickets.price));
  }

  return collection as Ticket[];
};

// Create new ticket
export const createTicket = async (
  newTicket: Omit<Ticket, "uuid" | "createdAt" | "updatedAt">
): Promise<Ticket> => {
  const createdTicket = await db
    .insert(tickets)
    .values(newTicket as any)
    .returning();
  return createdTicket[0] as Ticket;
};

// Update ticket
export const updateTicket = async (
  uuid: string,
  ticketData: Partial<Ticket>
): Promise<Ticket | null> => {
  const updatedTicket = await db
    .update(tickets)
    .set(ticketData)
    .where(eq(tickets.uuid, uuid))
    .returning();
  return (updatedTicket[0] as Ticket) || null;
};

// Delete ticket
export const deleteTicket = async (uuid: string): Promise<boolean> => {
  const deletedTicket = await db
    .delete(tickets)
    .where(eq(tickets.uuid, uuid))
    .returning();
  return deletedTicket.length > 0;
};

// Get tickets with pagination
export const getTicketsWithPagination = async (
  page: number = 1,
  pageSize: number = 10
): Promise<Ticket[]> => {
  const offset = (page - 1) * pageSize;
  const collection = await db
    .select()
    .from(tickets)
    .orderBy(asc(tickets.createdAt))
    .limit(pageSize)
    .offset(offset);
  return collection as Ticket[];
};