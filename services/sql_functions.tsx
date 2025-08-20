import { BirthdayInfo, Card, LastMetData, QueryInput, RecentEventsData, Tag } from '@/constants/Types';
import { contactTable } from '@/db/schema';
import DB from '@/services/DatabaseManager';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';



/** Converts null and empty strings to null values and adds quotations to string.
 *  Function is required to parse both null values and strings into 1 SQL statement. 
 */
function sqlTypeConverter (value: string | null) {
  const output: string|null = (value === null || value == "") ? null : `'${value}'`  
  return output
}

/** Adds info from input to SQL database */
export async function addToDatabase(input: QueryInput): Promise<boolean> {
  console.log("Trying to save information...")
  
  // Convert every contact property except contactId to either null or string with single quotation marks
  let SQL_input = Object.fromEntries(Object.entries(input).map(([key, value]) => [key, sqlTypeConverter(value)]))

  // Query to add all values into corresponding table
  const query = `INSERT INTO test 
    (name, tag_id, birthday, address, location, celnumber, email, job, employer, know_from, know_from_date, last_met_date, 
    hobbies, goals, wishes, recent_events, notes) 
    VALUES (${SQL_input.name}, ${SQL_input.tag_id}, ${SQL_input.birthday}, ${SQL_input.address}, ${SQL_input.location}, ${SQL_input.celnumber}, 
    ${SQL_input.email}, ${SQL_input.job}, ${SQL_input.employer}, ${SQL_input.knowFrom}, ${SQL_input.knowFromDate}, ${SQL_input.lastMetDate}, 
    ${SQL_input.hobbies}, ${SQL_input.goals}, ${SQL_input.wishes}, ${SQL_input.recentEvents}, ${SQL_input.notes});`;

  // Execute query
  const isPerformed = await DB.executeWriteQuery(query)
  console.log("Saved info")
  return isPerformed
}

/** Change the row corresponding to contactId with all the supplied information (overrides all information) */
export async function editDatabase(contactId: string, input: QueryInput): Promise<boolean> { 
  // Convert every contact property except contactId to either null or string with single quotation marks
  let SQL_input = Object.fromEntries(Object.entries(input).map(([key, value]) => [key, sqlTypeConverter(value)]))
  console.log(SQL_input)

  // Query to add all values into corresponding table
  const query = `UPDATE test 
    SET
    name =          ${SQL_input.name},
    tag_id =        ${SQL_input.tag_id},
    birthday =      ${SQL_input.birthday},
    address =       ${SQL_input.address},
    location =      ${SQL_input.location},
    celnumber =     ${SQL_input.celnumber},
    email =         ${SQL_input.email},
    job =           ${SQL_input.job},
    employer =      ${SQL_input.employer},
    know_from =     ${SQL_input.knowFrom},
    know_from_date= ${SQL_input.knowFromDate},
    last_met_date = ${SQL_input.lastMetDate}, 
    hobbies =       ${SQL_input.hobbies},
    goals =         ${SQL_input.goals},
    wishes =        ${SQL_input.wishes},
    recent_events = ${SQL_input.recentEvents},
    notes =         ${SQL_input.notes}
    WHERE id = ${contactId};`;

  // Execute query and log errors or succes
  const isPerformed = await DB.executeWriteQuery(query)
  console.log("Changed info")
  return isPerformed;
}

/** Change the row corresponding to contactId with all the supplied information (overrides all information) */
export async function editLastMetInDatabase(contactId: string) { 
  // Get current year, month and day
  const currDate = new Date()   // Date format: Mon 30 12 1991 23:55:14 GMT+0200
  const currYear = currDate.getFullYear().toString()
  const currMonth = (currDate.getMonth() + 1).toString()    // months are counted from 0
  const currDay = currDate.getDate().toString() 

  // Convert to single string of format (DD-MM-YYYY)
  const todayDate = currDay + "-" + currMonth + "-" + currYear

  // Convert to SQL compatible format
  const sqlTodayDate = sqlTypeConverter(todayDate) 

  // Query to add all values into corresponding table
  const query = `UPDATE test 
    SET
    last_met_date = ${sqlTodayDate}
    WHERE id = ${contactId};`;

  // Execute query and log errors or succes
  await DB.executeWriteQuery(query)
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
  
  // As contactId is unique there will always be only 1 item
  return allRows[0]
}

/** Function to obtain contact id and name from SQL database  */
export async function getCardsFromDatabase() {
  // Array to store the Card objects retrieved from the query
  let allRows: Array<Card>;

  // Obtain id and ordered name from all contacts 
  const query = `SELECT id, name FROM test ORDER BY name`
  allRows = await DB.executeReadQuery(query)

  return allRows;
}

/** Function to obtain all tag ids and tag names from SQL database  */
export async function getTagsFromDatabase() {
  // Array to store the Card objects retrieved from the query
  let allRows: Array<Tag>;

  // Obtain id and ordered name from all contacts 
  const query = `SELECT id, tag_name FROM tag ORDER BY id`
  allRows = await DB.executeReadQuery(query)

  return allRows;
}

/** Function to obtain all contacts with non empty birthdays with id and name from SQL database  */
export async function getBirthdaysFromDatabase() {
  let allRows: Array<BirthdayInfo>

  // Obtain id and ordered name from all contacts 
  const query = `SELECT id, name, birthday FROM test WHERE birthday IS NOT NULL`
  allRows = await DB.executeReadQuery(query)

  return allRows;
}

/** Gets all ids, names and recent_events with non-empty event values */
export async function getRecentEventsFromDatabase() {
  let allRows: Array<RecentEventsData>
 
  const query = `SELECT id, name, recent_events FROM test WHERE recent_events IS NOT NULL`
  allRows = await DB.executeReadQuery(query)

  return allRows;
}

/** Gets all ids, names and recent_events with non-empty event values */
export async function getLastMetDateFromDatabase() {
  let allRows: Array<LastMetData>

  const query = `SELECT test.id, test.name, test.last_met_date, tag.notify_recently_met, tag.notify_number_days 
  FROM test INNER JOIN tag on tag.id = test.tag_id 
  WHERE test.last_met_date IS NOT NULL;`
  allRows = await DB.executeReadQuery(query)

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

  await DB.executeWriteQuery(createContactQuery);
} 