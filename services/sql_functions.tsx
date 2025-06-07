import * as SQLite from 'expo-sqlite';

import { Card, QueryInput, data_row } from '@/constants/Types';


export async function addToDatabase(input: QueryInput) {
  console.log("Trying to save information...")

  // Create connection with SQL database
  const db = await SQLite.openDatabaseAsync('contactData');
  
  // Set var to null if text is empty, otherwise keep text and enclose within quotation marks for query
  // Does not work without quotation marks, SQL will read it like its a column name
  var SQL_birthday = (input.birthday === null) ? null :  `'${input.birthday}'`
  var SQL_address = (input.address === null) ? null :  `'${input.address}'`
  var SQL_location = (input.location === null) ? null :  `'${input.location}'`
  var SQL_celnumber = (input.celnumber === null) ? null :  `'${input.celnumber}'`
  var SQL_job = (input.job === null) ? null :  `'${input.job}'`
  var SQL_employer = (input.employer === null) ? null :  `'${input.employer}'`
  var SQL_hobbies = (input.hobbies === null) ? null :  `'${input.hobbies}'`
  var SQL_goals = (input.goals === null) ? null :  `'${input.goals}'`
  var SQL_wishes = (input.wishes === null) ? null :  `'${input.wishes}'`
  var SQL_recentEvents = (input.recentEvents === null) ? null :  `'${input.recentEvents}'`

  // Query to add all values into corresponding table
  const query = `INSERT INTO test 
    (name, birthday, address, location, celnumber, job, employer, hobbies, goals, wishes, recent_events) 
    VALUES ('${input.name}', ${SQL_birthday}, ${SQL_address}, ${SQL_location}, ${SQL_celnumber}, ${SQL_job}, 
    ${SQL_employer}, ${SQL_hobbies}, ${SQL_goals}, ${SQL_wishes}, ${SQL_recentEvents});`;

  // Execute query and log errors or succes
  await db.runAsync(query).catch((err) => console.log(err));
  console.log("Saved info")
}


/** Change the row corresponding to contactId with all the supplied information (overrides all information) */
export async function editDatabase(contactId: string, input: QueryInput) {
  // Create connection with SQL database
  const db = await SQLite.openDatabaseAsync('contactData');

  // Set var to null if text is empty, otherwise keep text and enclose within quotation marks for query
  // Does not work without quotation marks, SQL will read it like its a column name
  var SQL_birthday = (input.birthday === null) ? null :  `'${input.birthday}'`
  var SQL_address = (input.address === null) ? null :  `'${input.address}'`
  var SQL_location = (input.location === null) ? null :  `'${input.location}'`
  var SQL_celnumber = (input.celnumber === null) ? null :  `'${input.celnumber}'`
  var SQL_job = (input.job === null) ? null :  `'${input.job}'`
  var SQL_employer = (input.employer === null) ? null :  `'${input.employer}'`
  var SQL_hobbies = (input.hobbies === null) ? null :  `'${input.hobbies}'`
  var SQL_goals = (input.goals === null) ? null :  `'${input.goals}'`
  var SQL_wishes = (input.wishes === null) ? null :  `'${input.wishes}'`
  var SQL_recentEvents = (input.recentEvents === null) ? null :  `'${input.recentEvents}'`

  // Query to add all values into corresponding table
  const query = `UPDATE test 
    SET
    name = '${input.name}',
    birthday = ${SQL_birthday},
    address = ${SQL_address},
    location = ${SQL_location},
    celnumber = ${SQL_celnumber},
    job = ${SQL_job},
    employer = ${SQL_employer},
    hobbies = ${SQL_hobbies},
    goals = ${SQL_goals},
    wishes = ${SQL_wishes},
    recent_events = ${SQL_recentEvents}
    WHERE id=${contactId};`;

  // Execute query and log errors or succes
  await db.runAsync(query).catch((err) => console.log(err));
  console.log("Changed info")
}


/** Function to obtain contact id and name from SQL database  */
export async function getFromDatabase(contactId: string) {
  const db = await SQLite.openDatabaseAsync('contactData');

  let allRows: Array<data_row>;

  console.log(contactId)

  // `getAllAsync()` is useful when you want to get all results as an array of objects.
  const query = `SELECT * FROM test WHERE id=${contactId}`
  allRows = await db.getAllAsync(query)
  console.log("Got from query: ", allRows)

  return allRows;
}

/** Function to obtain contact id and name from SQL database  */
export async function getCardsFromDatabase() {
  const db = await SQLite.openDatabaseAsync('contactData');

  let allRows: Array<Card>;

  // `getAllAsync()` is useful when you want to get all results as an array of objects.
  allRows = await db.getAllAsync('SELECT id, name FROM test')
  console.log(allRows)

  return allRows;
}

/** Function to obtain contact id and name from SQL database  */
export async function removeFromDatabase(contactId: string) {
  const db = await SQLite.openDatabaseAsync('contactData');

  console.log("About to delete: ", contactId)

  // `getAllAsync()` is useful when you want to get all results as an array of objects.
  const query = `DELETE FROM test WHERE id=${contactId}`
  const result = await db.getAllAsync(query).catch((err) => console.log(err))
  console.log("Deletion completed")
}