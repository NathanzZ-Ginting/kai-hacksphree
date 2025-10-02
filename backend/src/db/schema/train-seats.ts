import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { trains } from "./trains.ts";

export const trainSeats = pgTable("train_seats", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  trainId: uuid("train_id")
    .references(() => trains.uuid, {
      onDelete: "cascade",
    })
    .notNull(),
  nameSeat: varchar("name_seat", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
