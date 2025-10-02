import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { locations } from "./locations.ts";

export const stations = pgTable("stations", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  stationCode: varchar("station_code", { length: 50 }),
  locationId: uuid("location_id").references(() => locations.uuid, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
