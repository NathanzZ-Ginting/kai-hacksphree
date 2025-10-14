import { index, integer, pgTable, timestamp, uuid, varchar, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  age: integer("age"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  token: varchar("token"),
  phoneNumber: varchar("phone_number", { length: 20 }),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
    return {
        nameUserIdx: index("name_user_idx").on(table.name),
        emailIdx: index("email_idx").on(table.email),
        passIdx: index("pass_idx").on(table.password)
    }
});
