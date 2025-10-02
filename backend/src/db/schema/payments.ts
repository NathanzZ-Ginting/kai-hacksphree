import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { orderTickets } from "./order-tickets.ts";

export const payments = pgTable("payments", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orderTickets.uuid, {
    onDelete: "cascade",
  }),
  invoicePayment: varchar("invoice_payment", { length: 100 }),
  amount: integer("amount"),
  status: varchar("status", { length: 50 }),
  method: varchar("method", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
