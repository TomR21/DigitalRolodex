import DB from '@/services/DatabaseManager';

export async function addColumnToDatabase(name: string) {

  //const query = `ALTER TABLE tag ADD COLUMN ${name} INTEGER;`;
  //const query = `ALTER TABLE test DROP COLUMN tag_id;`
  //const query = `ALTER TABLE test ADD COLUMN tag_id INTEGER REFERENCES tag(id);`
  const query = `UPDATE tag SET notify_number_days = 90;`
  const result = await DB.executeWriteQuery(query)

  console.log(result)
}

// Replaces part of a string of a column for all entries of the database
export async function updateDatabase() {
  const query = `UPDATE test SET notes = replace(notes, '.', '\n');`  //column, old, new
  await DB.executeWriteQuery(query)
  console.log("Done")
}
