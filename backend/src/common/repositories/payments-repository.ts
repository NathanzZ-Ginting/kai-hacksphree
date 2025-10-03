import { eq, like, and, desc, asc, sql } from "drizzle-orm";
import { db } from "../../db/index";
import { payments } from "../../db/schema";
import { Payment } from "../interface/payments-interface";

// Get all payments
export const getAllPayments = async (): Promise<Payment[]> => {
  const collection = await db
    .select()
    .from(payments)
    .orderBy(desc(payments.createdAt));
  return collection as unknown as Payment[];
};

// Get payment by UUID
export const getPaymentByUuid = async (
  uuid: string
): Promise<Payment | null> => {
  const payment = await db
    .select()
    .from(payments)
    .where(eq(payments.uuid, uuid))
    .limit(1);
  return (payment[0] as unknown as Payment) || null;
};

// Get payment by order ID
export const getPaymentByOrderId = async (
  orderId: string
): Promise<Payment | null> => {
  const payment = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, orderId))
    .limit(1);
  return (payment[0] as unknown as Payment) || null;
};

// Get payment by invoice payment
export const getPaymentByInvoicePayment = async (
  invoicePayment: string
): Promise<Payment | null> => {
  const payment = await db
    .select()
    .from(payments)
    .where(eq(payments.invoicePayment, invoicePayment))
    .limit(1);
  return (payment[0] as unknown as Payment) || null;
};

// Get payments by status
export const getPaymentsByStatus = async (
  status: string
): Promise<Payment[]> => {
  const collection = await db
    .select()
    .from(payments)
    .where(eq(payments.status, status))
    .orderBy(desc(payments.createdAt));
  return collection as unknown as Payment[];
};

// Get payments by payment method
export const getPaymentsByMethod = async (
  method: string
): Promise<Payment[]> => {
  const collection = await db
    .select()
    .from(payments)
    .where(eq(payments.method, method))
    .orderBy(desc(payments.createdAt));
  return collection as unknown as Payment[];
};

// Create new payment
export const createPayment = async (
  newPayment: Omit<Payment, "uuid" | "createdAt" | "updatedAt">
): Promise<Payment> => {
  const createdPayment = await db
    .insert(payments)
    .values(newPayment as any)
    .returning();
  return createdPayment[0] as unknown as Payment;
};

// Update payment
export const updatePayment = async (
  uuid: string,
  paymentData: Partial<Payment>
): Promise<Payment | null> => {
  const updatedPayment = await db
    .update(payments)
    .set({
      ...paymentData,
      updatedAt: new Date(),
    } as any)
    .where(eq(payments.uuid, uuid))
    .returning();
  return (updatedPayment[0] as unknown as Payment) || null;
};

// Update payment status
export const updatePaymentStatus = async (
  uuid: string,
  status: string
): Promise<Payment | null> => {
  const updatedPayment = await db
    .update(payments)
    .set({
      status: status,
      updatedAt: new Date(),
    })
    .where(eq(payments.uuid, uuid))
    .returning();
  return (updatedPayment[0] as unknown as Payment) || null;
};

// Delete payment
export const deletePayment = async (uuid: string): Promise<boolean> => {
  const deletedPayment = await db
    .delete(payments)
    .where(eq(payments.uuid, uuid))
    .returning();
  return deletedPayment.length > 0;
};

// Get payments with pagination
export const getPaymentsWithPagination = async (
  page: number = 1,
  pageSize: number = 10,
  orderBy: "date_asc" | "date_desc" | "amount_asc" | "amount_desc" = "date_desc"
): Promise<Payment[]> => {
  const offset = (page - 1) * pageSize;

  let orderByClause;
  switch (orderBy) {
    case "date_asc":
      orderByClause = asc(payments.createdAt);
      break;
    case "date_desc":
      orderByClause = desc(payments.createdAt);
      break;
    case "amount_asc":
      orderByClause = asc(payments.amount);
      break;
    case "amount_desc":
      orderByClause = desc(payments.amount);
      break;
    default:
      orderByClause = desc(payments.createdAt);
  }

  const collection = await db
    .select()
    .from(payments)
    .orderBy(orderByClause)
    .limit(pageSize)
    .offset(offset);
  return collection as unknown as Payment[];
};
