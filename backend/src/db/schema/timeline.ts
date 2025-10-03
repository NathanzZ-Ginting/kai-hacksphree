import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orderTickets } from "./order-tickets";

export const timeline = pgTable("timeline", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  orderId: uuid("order_id").references(() => orderTickets.uuid, {
    onDelete: "cascade",
  }),
  status: varchar("status", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
