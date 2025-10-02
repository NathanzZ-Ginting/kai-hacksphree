import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const locations = pgTable("locations", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  city: varchar("city", { length: 255 }),
  description: text("description"),
  longitude: varchar("longitude", { length: 100 }),
  latitude: varchar("latitude", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
    return {
        cityIdx: index("city_idx").on(table.city),
        longIdx: index("long_idx").on(table.longitude),
        latIdx: index("lat_idx").on(table.latitude)
    }
});
