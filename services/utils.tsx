import { tagTable } from '@/db/schema';
import DB from '@/services/DatabaseManager';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';


/** Adds info from input to SQL database */
export async function changeEntryDatabase() {

  console.log("Trying to save information...")

  // Establish database connection when not connected
  if ( !DB.connection ) {
    DB.connect()
  }
  const drizzDB = drizzle(DB.connection!)

  // Convert field input data to sql column names
  type Tag = typeof tagTable.$inferInsert;
  const contactInfo: Tag = {
    tag_name : "Familie",
    notify_recently_met: true,
    notify_number_days: 180,
  }
  
  // Insert contact, keep track of status insertion
  try {
    await drizzDB.update(tagTable).set(contactInfo).where(eq(tagTable.id, 4))
    console.log("Saved info")
  } catch {
    console.log("Error adding contact")
  }
}
