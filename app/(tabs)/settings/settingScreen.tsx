import React from 'react';
import { Button, Text, View } from 'react-native';

import * as FileSystem from 'expo-file-system';
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
    
    // Directory of SQL database files
    const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
    const baseFileName = 'export_database'; //contactData
    
    // Check for all possible SQLite files including WAL and SHM files for full backup
    const possibleFiles = [
      `${baseFileName}`,           // Main database file
      `${baseFileName}.db`,        // With .db extension
      `${baseFileName}-wal`,       // Write-Ahead Log
      `${baseFileName}-shm`       // Shared Memory
    ];
    
    // Check if file exists at path and provide share option
    for (const fileName of possibleFiles) {
      const filePath = `${sqliteDir}/${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      
      if (fileInfo.exists) {
        console.log(`Found file: ${fileName}, size: ${fileInfo.size}`);
        
        // Share file if it is not empty
        if (fileInfo.size > 0) {
          await Sharing.shareAsync(filePath, {
            mimeType: 'application/x-sqlite3',
            dialogTitle: `Share ${fileName}`
          });
        }
      }
    }

  } catch (error) {
    console.error('Error exporting database files:', error);
  }

}


function SettingScreen() {
  return (
    <View style={Styles.background}>
      <Text style={Styles.text}> Setting 1 </Text>
      <Button title="Share DB" onPress={() => shareDB()}/> 

      {/* <Button title = "Add Col" onPress={() => addColumnToDatabase("notify_number_days")}/>  */}

    </View>
  );
}

export default SettingScreen;