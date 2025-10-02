import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orderTickets } from "./order-tickets.ts";
import { tickets } from "./tickets.ts";

export const pasanggerType = pgEnum("passenger_type", ['dewasa','anak-anak'])

export const orderDetails = pgTable("order_details", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orderTickets.uuid, {
    onDelete: "cascade",
  }),
  ticketId: uuid("ticket_id").references(() => tickets.uuid, {
    onDelete: "cascade",
  }),
  passengerType: pasanggerType("passenger_type"),
  seatNumber: varchar("seat_number", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
