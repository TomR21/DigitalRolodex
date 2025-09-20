import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// To apply schema changes to underlying SQLite DB do:
// npx drizzle-kit-generate
// 

export const contactTable = sqliteTable("test", {
  id: int("id").primaryKey().notNull(),
  tag_id: int("tag_id").references(() => tagTable.id),
  name: text("name").notNull().unique(),
  birthday: text("birthday"),
  location: text("location"),
  address: text("address"),
  celnumber: text("celnumber"),
  job: text("job"),
  employer: text("employer"),
  hobbies: text("hobbies"),
  wishes: text("wishes"),
  goals: text("goals"),
  recent_events: text("recent_events"),
  linkedin: text("linkedin"),
  email: text("email"),
  notes: text("notes"),
  know_from: text("know_from"),
  know_from_date: text("know_from_date"),
  last_met_date: text("last_met_date"),
});

export const tagTable = sqliteTable("tag", {
  id: int("id").primaryKey().notNull(),
  tag_name: text("tag_name").notNull(),  
  notify_recently_met: int("notify_recently_met", { mode: 'boolean' }),
  notify_number_days: int("notify_number_days"),
});

/** 
export const contactTable = sqliteTable("test", {
  id: int('id').primaryKey().notNull(),
  tag_id: int('tag_id').notNull().references(() => tagTable.id),
  name: text().notNull().unique(),
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
  email: text(),
  notes: text(),
  know_from: text(),
  know_from_date: text(),
  last_met_date: text(),
});

export const tagTable = sqliteTable("tag", {
  id: int().primaryKey(),
  tag_name: text().notNull(),  
  notify_recently_met: int({ mode: 'boolean' }).notNull(),
  notify_number_days: int().notNull(),
});




// ORIGINAL DB SCHEMA BEFORE DRIZZLE
export const contactTable = sqliteTable("test", {
  id: int("id").primaryKey().notNull(),
  tag_id: int("tag_id").references(() => tagTable.id),
  name: text("name").notNull(),
  birthday: text("birthday"),
  location: text("location"),
  address: text("address"),
  celnumber: text("celnumber"),
  job: text("job"),
  employer: text("employer"),
  hobbies: text("hobbies"),
  wishes: text("wishes"),
  goals: text("goals"),
  recent_events: text("recent_events"),
  linkedin: text("linkedin"),
  email: text("email"),
  notes: text("notes"),
  know_from: text("know_from"),
  know_from_date: text("know_from_date"),
  last_met_date: text("last_met_date"),
});

export const tagTable = sqliteTable("tag", {
  id: int("id").primaryKey().notNull(),
  tag_name: text("tag_name").notNull(),  
  notify_recently_met: int("notify_recently_met", { mode: 'boolean' }),
  notify_number_days: int("notify_number_days"),
});


*/