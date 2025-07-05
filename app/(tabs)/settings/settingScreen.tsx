import React from 'react';
import { Button, Text, View } from 'react-native';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { Styles } from '@/constants/Styles';
import DB from '@/services/DatabaseConnection';


/** Closes the database connection and provides a share option for all database files */
async function shareDB() {
  try {
    // Check current journalling mode for testing purposes (cannot share only contactData while in WAL mode)
    const journalMode = await DB.executeReadQuery('PRAGMA journal_mode');
    console.log('Journal mode:', journalMode);

    // Close the database connection first
    DB.disconnect()

    // Merge -wal and -shm files with core database
    // Then need for searching all separate files goes away

    // Wait for file system to sync
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Directory of SQL database files
    const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
    const baseFileName = 'contactData';
    
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

  // Reopen connection to the database
  DB.connect()

};


function settingScreen() {
  return (
    <View style={Styles.background}>
      <Text style={Styles.text}> Setting 1 </Text>
      <Button title="Share DB" onPress={() => shareDB()}/>  
    </View>
  );
}

export default settingScreen;