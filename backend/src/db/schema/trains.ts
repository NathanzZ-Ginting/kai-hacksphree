import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { categories } from "./categories.js";

export const trains = pgTable("trains", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => categories.uuid, {
    onDelete: "cascade",
  }),
  trainCode: varchar("train_code", { length: 50 }),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
