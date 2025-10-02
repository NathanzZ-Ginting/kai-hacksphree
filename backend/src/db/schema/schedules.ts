import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { trains } from "./trains.js";
import { locations } from "./locations.js";

export const schedules = pgTable("schedules", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  trainId: uuid("train_id").references(() => trains.uuid, {
    onDelete: "cascade",
  }),
  originStationId: uuid("origin_station_id").references(() => locations.uuid, {
    onDelete: "cascade",
  }),
  destinationStationId: uuid("destination_station_id").references(
    () => locations.uuid,
    { onDelete: "cascade" }
  ),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
