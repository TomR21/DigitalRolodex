import React from 'react';
import { Button, Text, View } from 'react-native';

import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { Styles } from '@/constants/Styles';
import DB from '@/services/DatabaseManager';


/** Creates export database and provides a share option for export database files */
async function shareDB(): Promise<void> {
  try {

    // Create copy of current database info
    await DB.createExportDatabase()

    // Wait for file system to sync
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Obtain path to SQLite directory
    const sqlDirectory = new Directory(Paths.document, "SQLite")
    
    // Find export DB file
    const baseFileName = 'export_database.db'; //contains copy of contactData
    const file = new File(sqlDirectory, baseFileName) 

    // Check if file exists at path and provide share option
    if ( file.exists ) {
      console.log(`Found file: ${file.name}, size: ${file.size}`);

      // Share file if it is not empty
      if (file.size > 0) {
        await Sharing.shareAsync(file.uri, {
          mimeType: 'application/x-sqlite3',
          dialogTitle: `Share ${file.name}`
        });
    }}

  } catch (error) {
    console.error('Error exporting database files:', error);
  }

}


function SettingScreen() {
  return (
    <View style={Styles.background}>
      <Text style={Styles.text}> Setting 1 </Text>
      <Button title="Share DB" onPress={() => shareDB()}/> 

      {/* <Button title = "Add Col" onPress={() => changeEntryDatabase()}/> */}
      
    </View>
  );
}

export default SettingScreen;