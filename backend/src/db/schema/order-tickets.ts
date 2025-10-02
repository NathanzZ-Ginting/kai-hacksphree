import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const orderTickets = pgTable("order_tickets", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.uuid, { onDelete: "cascade" }),
  invoiceNumber: varchar("invoice_number", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }),
  orderDate: timestamp("order_date").notNull(),
  totalPrice: integer("total_price"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
