import * as SQLite from 'expo-sqlite';

// Table columns
// id
// name, birthday, address, location, celnumber, job, employer, hobbies, goals, wishes, recent_events


async function createDatabase() {
  const db = await SQLite.openDatabaseAsync('contactData');

  // `execAsync()` is useful for bulk queries when you want to execute altogether.
  // Note that `execAsync()` does not escape parameters and may lead to SQL injection.
  await db.execAsync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, birthday TEXT);
  INSERT INTO test (name, birthday) VALUES ('Tom van Rees', '16-11-1999');
  INSERT INTO test (name, birthday) VALUES ('BRUH', '1-1-1111');
  INSERT INTO test (name, birthday) VALUES ('test3', '1-2-3456');
  `);
}


async function addColumnToDatabase(name: string) {
  const db = await SQLite.openDatabaseAsync('contactData');

  const query = `ALTER TABLE test ADD COLUMN ${name};`;

  const result = await db.runAsync(query);
  console.log(result.lastInsertRowId, result.changes)
}