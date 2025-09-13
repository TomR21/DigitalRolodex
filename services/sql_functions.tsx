import { QueryInput } from '@/constants/Types';
import { contactTable, tagTable } from '@/db/schema';
import DB from '@/services/DatabaseManager';
import { eq, isNotNull } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';


/** Adds info from input to SQL database */
export async function addToDatabase(input: QueryInput): Promise<boolean> {

  console.log("Trying to save information...")

  // Establish database connection when not connected
  if ( !DB.connection ) {
    DB.connect()
  }
  const drizzDB = drizzle(DB.connection!)

  // Convert field input data to sql column names
  type Contact = typeof contactTable.$inferInsert;
  const contactInfo: Contact = {
    name :          input.name,
    tag_id :        input.tag_id,
    birthday :      input.birthday,
    address :       input.address,
    location :      input.location,
    celnumber :     input.celnumber,
    email :         input.email,
    job :           input.job,
    employer :      input.employer,
    know_from :     input.knowFrom,
    know_from_date: input.knowFromDate,
    last_met_date : input.lastMetDate, 
    hobbies :       input.hobbies,
    goals :         input.goals,
    wishes :        input.wishes,
    recent_events : input.recentEvents,
    notes :         input.notes,
  }
  
  // Insert contact, keep track of status insertion
  let isPerformed: boolean = false
  try {
    await drizzDB.insert(contactTable).values(contactInfo)
    isPerformed = true
    console.log("Saved info")
  } catch {
    console.log("Error adding contact")
  }

  return isPerformed
}

/** Change the row corresponding to contactId with all the supplied information (overrides all information) */
export async function editDatabase(contactId: number, input: QueryInput): Promise<boolean> { 
  
  console.log("Trying to save information...")

  // Establish database connection when not connected
  if ( !DB.connection ) {
    DB.connect()
  }
  const drizzDB = drizzle(DB.connection!)

  // Convert field input data to sql column names
  type Contact = typeof contactTable.$inferInsert;
  const contactInfo: Contact = {
    name :          input.name,
    tag_id :        input.tag_id,
    birthday :      input.birthday,
    address :       input.address,
    location :      input.location,
    celnumber :     input.celnumber,
    email :         input.email,
    job :           input.job,
    employer :      input.employer,
    know_from :     input.knowFrom,
    know_from_date: input.knowFromDate,
    last_met_date : input.lastMetDate, 
    hobbies :       input.hobbies,
    goals :         input.goals,
    wishes :        input.wishes,
    recent_events : input.recentEvents,
    notes :         input.notes,
  }
  
  // Insert contact, keep track of status insertion
  let isPerformed: boolean = false
  try {
    await drizzDB.update(contactTable).set(contactInfo).where(eq(contactTable.id, contactId))
    isPerformed = true
    console.log("Saved info")
  } catch {
    console.log("Error adding contact")
  }

  return isPerformed
}

/** Change the row corresponding to contactId with all the supplied information (overrides all information) */
export async function editLastMetInDatabase(contactId: number) { 
  // Get current year, month and day
  const currDate = new Date()   // Date format: Mon 30 12 1991 23:55:14 GMT+0200
  const currYear = currDate.getFullYear().toString()
  const currMonth = (currDate.getMonth() + 1).toString()    // months are counted from 0
  const currDay = currDate.getDate().toString() 

  // Convert to single string of format (DD-MM-YYYY)
  const todayDate = currDay + "-" + currMonth + "-" + currYear

  // Establish database connection when not connected
  if ( !DB.connection ) {
    DB.connect()
  }
  const drizzDB = drizzle(DB.connection!)

  // Update last met date for specific contact
  await drizzDB.update(contactTable).set({last_met_date: todayDate}).where(eq(contactTable.id, contactId))

  console.log("Changed Last Met Date to " + todayDate)
}

/** Function to obtain all contact info from specific contact from SQL database */
export async function getFromDatabase(contactId: string): Promise<typeof contactTable.$inferSelect> {
  // Array to store the data_row objects retrieved from the query
  var allRows: typeof contactTable.$inferSelect[]
  
  // Establish database connection when not connected
  if ( !DB.connection ) {
    DB.connect()
  }

  // Retrieve all user info from contactId
  const drizzDB = drizzle(DB.connection!)
  allRows = await drizzDB.select().from(contactTable).where(eq(contactTable.id, Number(contactId)))
  
  console.log(allRows[0])

  // As contactId is unique there will always be only 1 item
  return allRows[0]
}

/** Function to obtain contact id and name from SQL database  */
export async function getCardsFromDatabase() {
  
  // Establish database connection when not connected
  if ( !DB.connection ) {
    DB.connect()
  }

  // Retrieve all user info from contactId
  const drizzDB = drizzle(DB.connection!)
  const allRows = await drizzDB.select({id: contactTable.id, name: contactTable.name}).from(contactTable).orderBy(contactTable.name)

  return allRows;
}

/** Function to obtain all tag ids and tag names from SQL database  */
export async function getTagsFromDatabase() {

  // Establish database connection when not connected
  if ( !DB.connection ) {
    DB.connect()
  }

  // Retrieve all tag ids and names from via Drizzle 
  const drizzDB = drizzle(DB.connection!)
  const allRows = await drizzDB.select({id: tagTable.id, tag_name: tagTable.tag_name}).from(tagTable).orderBy(tagTable.id)

  return allRows;
}

/** Function to obtain all contacts with non empty birthdays with id and name from SQL database  */
export async function getBirthdaysFromDatabase() {

  // Establish database connection when not connected
  if ( !DB.connection ) {
    DB.connect()
  }

  // Retrieve all tag ids and names from via Drizzle 
  const drizzDB = drizzle(DB.connection!)
  const allRows = await drizzDB.select({id: contactTable.id, name: contactTable.name, birthday: contactTable.birthday})
                    .from(contactTable).where(isNotNull(contactTable.birthday))

  return allRows;
}

/** Gets all ids, names and recent_events with non-empty event values */
export async function getRecentEventsFromDatabase() {

  // Establish database connection when not connected
  if ( !DB.connection ) {
    DB.connect()
  }

  // Retrieve all tag ids and names from via Drizzle 
  const drizzDB = drizzle(DB.connection!)
  const allRows = await drizzDB.select({id: contactTable.id, name: contactTable.name, recent_events: contactTable.recent_events})
                    .from(contactTable).where(isNotNull(contactTable.recent_events))

  return allRows;
}

/** Gets all ids, names and recent_events with non-empty event values */
export async function getLastMetDateFromDatabase() {

   // Establish database connection when not connected
  if ( !DB.connection ) {
    DB.connect()
  }

  // All columns to be requested from the query
  const columns = {
    id: contactTable.id, 
    name: contactTable.name, 
    last_met_date: contactTable.last_met_date,
    notify_recently_met: tagTable.notify_recently_met,
    notify_number_days: tagTable.notify_number_days
  }

  // Retrieve all tag ids and names from via Drizzle 
  const drizzDB = drizzle(DB.connection!)
  const allRows = await drizzDB.select(columns).from(contactTable).innerJoin(tagTable, eq(contactTable.tag_id, tagTable.id))
                    .where(isNotNull(contactTable.last_met_date))

  return allRows;
}

/** Function to obtain contact id and name from SQL database  */
export async function removeFromDatabase(contactId: string) {
  
  console.log("About to delete: ", contactId)

  // Establish database connection when not connected
  if ( !DB.connection ) {
    DB.connect()
  }

  // Delete contact info from specific contactId
  const drizzDB = drizzle(DB.connection!)
  await drizzDB.delete(contactTable).where(eq(contactTable.id, Number(contactId)))
}


// Table columns
// id
// name, birthday, address, location, celnumber, job, employer, hobbies, goals, wishes, recent_events

/** Creates the sqlite databases used to store all contact data  */ 
export async function createDatabase() {
  const createContactQuery = 
  `PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS contact 
    (id INTEGER PRIMARY KEY NOT NULL,
    tag_id INTEGER,
    name TEXT NOT NULL, 
    birthday TEXT,
    location TEXT,
    address TEXT,
    celnumber TEXT,
    email TEXT,
    linkedin TEXT
    job TEXT
    employer TEXT
    know_from TEXT
    know_from_date TEXT
    last_met_date TEXT
    hobbies TEXT
    wishes TEXT
    goals TEXT
    recent-events TEXT
    notes TEXT
    FOREIGN KEY (tag_id) REFERENCES tag(id));
  INSERT INTO contact (name, birthday) VALUES ('Tom van Rees', '16-11-1999');`
  
  const createTagQuery = 
  `PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS tag (
    id INTEGER PRIMARY KEY NOT NULL, 
    tag_name TEXT NOT NULL, 
    notify_recently_met BOOL);
  INSERT INTO tag (tag_name, notify_recently_met) VALUES ('Familie', 0);
  INSERT INTO tag (tag_name, notify_recently_met) VALUES ('Vriend', 1);
  INSERT INTO tag (tag_name, notify_recently_met) VALUES ('Collega', 0);`

  //await DB.executeWriteQuery(createContactQuery);
} 