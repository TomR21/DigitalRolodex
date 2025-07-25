import * as SQLite from 'expo-sqlite';

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

  /** Tries connecting to the SQL database when not already connected */
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
      console.log("Obtained results: ", results)
      return results
    } catch (error) {
      console.log(error)
      return []
    }
  }

  /** Executes write queries like INSERT, UPDATE and DELETE */
  public async executeWriteQuery(query: string): Promise<void> {
    // Throw error when there is no connection
    if ( !this.connection ) {
      throw new Error('Database not connected. Call connect() first.');
    }
    
    // Log all errors created for unsuccessful query
    try {
      await this.connection.runAsync(query)
      console.log("Performed query: ", query)
    } catch (error) {
      console.log(error)
    }
  }

}



// Create instance of singleton class 
const DB = DatabaseManager.getInstance()

// Connect instance to database
DB.connect()

// Export class so other classes can reuse the connection
export default DB