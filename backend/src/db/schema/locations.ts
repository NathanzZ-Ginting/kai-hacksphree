import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const locations = pgTable("locations", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  longitude: varchar("longitude", { length: 100 }),
  latitude: varchar("latitude", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
