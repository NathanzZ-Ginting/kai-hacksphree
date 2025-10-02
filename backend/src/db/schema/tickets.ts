import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { schedules } from "./schedules.js";

export const tickets = pgTable("tickets", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  scheduleId: uuid("schedule_id").references(() => schedules.uuid, {
    onDelete: "cascade",
  }),
  price: integer("price"),
  tax: integer("tax"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
