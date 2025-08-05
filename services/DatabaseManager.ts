import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

// Filename of the SQL database
const databaseFilename = 'contactData'


/** Singleton design to create a single connection with the SQLite database */
class DatabaseManager {
  private static instance: DatabaseManager | null = null
  public connection: SQLite.SQLiteDatabase | null = null
  private isConnected: boolean = false

  // Private constructor to prevent creating a direct instance
  private constructor() {
  }

  /** Gets the singleton instance of the DatabaseManager */
  public static getInstance(): DatabaseManager {
      if (!DatabaseManager.instance) {
          // Create new instance 
          DatabaseManager.instance = new DatabaseManager();
      }
      return DatabaseManager.instance
  }

  /** Tries connecting to the SQL database when not already connected */
  public connect(): SQLite.SQLiteDatabase {
    // Keep connection if already connected
    if ( this.isConnected && this.connection ) {
      return this.connection
    }

    // Try to connect to database and else throw error 
    try {
      this.connection = SQLite.openDatabaseSync(databaseFilename);
      this.isConnected = true;
      console.log('Database connected successfully');
      return this.connection;
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }  
  }

  /** Tries connecting to the SQLite database when not already connected */
  public disconnect(): null {
    // End function if there is no connection
    if ( !this.connection ) {
      return this.connection
    }

    // Try to disconnect from database and else throw error 
    try {
      this.connection.closeSync();
      console.log(this.connection)
      console.log(typeof(this.connection))
      this.isConnected = false;
      this.connection = null
      console.log('Database connected successfully');
      return this.connection;
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }  
  }


  /** Executes read-only queries */
  public async executeReadQuery(query: string): Promise<any[]> {
    // Throw error when there is no connection
    if ( !this.connection ) {
      throw new Error('Database not connected. Call connect() first.');
    }

    // Log all errors created for unsuccessful query
    try {
      const results = await this.connection.getAllAsync(query)
      return results
    } catch (error) {
      
      // Show error message in console and app
      console.log(error)
      Alert.alert('Execution Failed', 'Was not able to execute query:\n' + query + '\n\n' + error, [
        {
          text: 'Cancel',
          style: 'cancel',
      }]);
      return []
    }
  }

  /** Executes write queries like INSERT, UPDATE and DELETE */
  public async executeWriteQuery(query: string): Promise<boolean> {
    // Throw error when there is no connection
    if ( !this.connection ) {
      throw new Error('Database not connected. Call connect() first.');
    }

    // Return variable to let function know if query has been performed 
    var isPerformed;

    // Log all errors created for unsuccessful query
    try {
      await this.connection.runAsync(query)
      isPerformed = true;
      console.log("Performed query: ", query)
    } catch (error) {
      
      // Show error message in console and app
      isPerformed = false;
      console.log(error)
      Alert.alert('Execution Failed', 'Was not able to execute query:\n' + query + '\n\n' + error, [
        {
          text: 'Cancel',
          style: 'cancel',
      }]);
    }
    return isPerformed
  }

  
  /** Creates a new database to export  */
  public async createExportDatabase() {
    try {
      // Create a new database file for export
      const exportDb = SQLite.openDatabaseSync('export_database.db')
      
      // Get all table schemas from original database
      const tables = await this.executeReadQuery('SELECT name, sql FROM sqlite_master WHERE type="table"')
      
      // For each table check existence and delete it when present
      for (const table of tables) {

        const foundTable = exportDb.getAllSync(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table.name}'`)
        
        if ( foundTable ) {
          try {
            exportDb.execSync(`DROP TABLE IF EXISTS ${table.name}`)
            console.log('Table ', table.name, ' has been dropped')
          } catch (dropError) {
            console.warn(`Could not drop table ${table.name}:`, dropError)
          }
        }
      }

      // Copy data from each table and put into new database
      for (const table of tables) {
        const tableName = table.name;

        // Rereate table structure from copied database
        if (table.sql) {
          exportDb.execSync(table.sql);
        }

        // Create new tables
        if (tableName !== 'sqlite_sequence') { // Skip system tables
          const rows = await this.executeReadQuery(`SELECT * FROM ${tableName}`);
          
          if (rows.length > 0) {
            // Get column names
            const columns = Object.keys(rows[0]);
            const placeholders = columns.map(() => '?').join(', ');
            const columnNames = columns.join(', ');
            
            const insertSQL = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
            
            // Insert all rows
            for (const row of rows) {
              const values = columns.map(col => row[col]);
              exportDb.runSync(insertSQL, values);
            }
          }
        }
      }
    
      // Close export database
      exportDb.closeSync();
    
    } catch (error) {
      console.error('Error creating export database:', error);
    }
  }

}



// Create instance of singleton class 
const DB = DatabaseManager.getInstance()

// Connect instance to database
DB.connect()

// Export class so other classes can reuse the connection
export default DB