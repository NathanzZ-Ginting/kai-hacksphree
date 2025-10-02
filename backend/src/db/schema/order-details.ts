import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orderTickets } from "./order-tickets.ts";
import { tickets } from "./tickets.ts";

export const orderDetails = pgTable("order_details", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orderTickets.uuid, {
    onDelete: "cascade",
  }),
  ticketId: uuid("ticket_id").references(() => tickets.uuid, {
    onDelete: "cascade",
  }),
  passengerName: varchar("passenger_name", { length: 255 }),
  passengerType: varchar("passenger_type", { length: 50 }),
  seatNumber: varchar("seat_number", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
