import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contactTable = sqliteTable("test", {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email'),
});

export const tagTable = sqliteTable("test", {
  id: int().primaryKey({ autoIncrement: true }),
  tag_name: text().notNull(),  
  notify_recently_met: int({ mode: 'boolean' }),
  notify_number_days: int(),
});