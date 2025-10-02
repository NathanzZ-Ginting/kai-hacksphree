import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
    return {
        nameCatIdx: index("name_cat_idx").on(table.name)
    }
});
