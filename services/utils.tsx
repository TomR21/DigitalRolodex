import * as SQLite from 'expo-sqlite';

// Table columns
// id
// name, birthday, address, location, celnumber, job, employer, hobbies, goals, wishes, recent_events

export async function addColumnToDatabase(name: string) {
  const db = await SQLite.openDatabaseAsync('contactData');

  const query = `ALTER TABLE test ADD COLUMN ${name};`;
  //const query = `ALTER TABLE test DROP COLUMN tag_id;`
  //const query = `ALTER TABLE test ADD COLUMN tag_id INTEGER REFERENCES tag(id);`
  //const query = `UPDATE test SET tag_id = 1 WHERE name='A';`
  const result = await db.execAsync(query).catch(err => console.log(err));
  //const result = await db.getAllAsync(query).catch(err => console.log(err));
  //console.log(result.lastInsertRowId, result.changes)
  console.log(result)
}