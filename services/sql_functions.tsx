import * as SQLite from 'expo-sqlite';

import { Card, QueryInput, data_row } from '@/constants/Types';


// Create a database connection at the opening of the application. 
const db = SQLite.openDatabaseSync('contactData');


/** Converts null and empty strings to null values and adds quotations to string.
 *  Function is required to parse both null values and strings into 1 SQL statement. 
 */
function sqlTypeConverter (value: string | null) {
  const output: string|null = (value === null || value == "") ? null : `'${value}'`  
  return output
}

/** Adds info from input to SQL database */
export async function addToDatabase(input: QueryInput) {
  console.log("Trying to save information...")
  
  // Convert every contact property except contactId to either null or string with single quotation marks
  let SQL_input = Object.fromEntries(Object.entries(input).map(([key, value]) => [key, sqlTypeConverter(value)]))

  // Query to add all values into corresponding table
  const query = `INSERT INTO test 
    (name, birthday, address, location, celnumber, job, employer, hobbies, goals, wishes, recent_events) 
    VALUES (${SQL_input.name}, ${SQL_input.birthday}, ${SQL_input.address}, ${SQL_input.location}, ${SQL_input.celnumber}, 
    ${SQL_input.job}, ${SQL_input.employer}, ${SQL_input.hobbies}, ${SQL_input.goals}, ${SQL_input.wishes}, ${SQL_input.recentEvents});`;

  // Execute query and log errors or succes
  await db.runAsync(query).catch((err) => console.log(err));
  console.log("Saved info")
}

/** Change the row corresponding to contactId with all the supplied information (overrides all information) */
export async function editDatabase(contactId: string, input: QueryInput) { 
  // Convert every contact property except contactId to either null or string with single quotation marks
  let SQL_input = Object.fromEntries(Object.entries(input).map(([key, value]) => [key, sqlTypeConverter(value)]))
  console.log(SQL_input)

  // Query to add all values into corresponding table
  const query = `UPDATE test 
    SET
    name =          ${SQL_input.name},
    birthday =      ${SQL_input.birthday},
    address =       ${SQL_input.address},
    location =      ${SQL_input.location},
    celnumber =     ${SQL_input.celnumber},
    job =           ${SQL_input.job},
    employer =      ${SQL_input.employer},
    hobbies =       ${SQL_input.hobbies},
    goals =         ${SQL_input.goals},
    wishes =        ${SQL_input.wishes},
    recent_events = ${SQL_input.recentEvents}
    WHERE id = ${contactId};`;

  // Execute query and log errors or succes
  await db.runAsync(query).catch((err) => console.log(err));
  console.log("Changed info")
}

/** Function to obtain contact id and name from SQL database  */
export async function getFromDatabase(contactId: string) {
  // Array to store the data_row objects retrieved from the query
  let allRows: Array<data_row>;

  // `getAllAsync()` is useful when you want to get all results as an array of objects.
  const query = `SELECT * FROM test WHERE id=${contactId}`
  allRows = await db.getAllAsync(query)
  console.log("Got from query: ", allRows)

  return allRows;
}

/** Function to obtain contact id and name from SQL database  */
export async function getCardsFromDatabase() {
  // Array to store the Card objects retrieved from the query
  let allRows: Array<Card>;

  // `getAllAsync()` is useful when you want to get all results as an array of objects.
  allRows = await  db.getAllAsync('SELECT id, name FROM test ORDER BY name')
  console.log(allRows)

  return allRows;
}

/** Function to obtain contact id and name from SQL database  */
export async function removeFromDatabase(contactId: string) {
  
  console.log("About to delete: ", contactId)

  // `getAllAsync()` is useful when you want to get all results as an array of objects.
  const query = `DELETE FROM test WHERE id=${contactId}`
  const result = await db.getAllAsync(query).catch((err) => console.log(err))
  console.log("Deletion completed")
}