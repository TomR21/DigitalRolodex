import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contactTable = sqliteTable("test", {
  id: int('id').primaryKey(),
  tag_id: int('tag_id').notNull().references(() => tagTable.id),
  name: text('name').notNull(),
  birthday: text(),
  location: text(),
  address: text(),
  celnumber: text(),
  job: text(),
  employer: text(),
  hobbies: text(),
  wishes: text(),
  goals: text(),
  recent_events: text(),
  linkedin: text(),
  email: text('email'),
  notes: text(),
  know_from: text(),
  know_from_date: text(),
  last_met_date: text(),
});

export const tagTable = sqliteTable("tag", {
  id: int().primaryKey(),
  tag_name: text().notNull(),  
  notify_recently_met: int({ mode: 'boolean' }),
  notify_number_days: int(),
});