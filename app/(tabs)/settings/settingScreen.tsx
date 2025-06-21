import React from 'react';
import { Button, Text, View } from 'react-native';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { Styles } from '@/constants/Styles';


async function shareDB() {
  // Finds the location of the SQL database and upons a FileSharing window
  await Sharing.shareAsync(
    FileSystem.documentDirectory + 'SQLite/contactData', 
    {dialogTitle: 'share or copy your DB via'}
  ).catch(error =>{
   console.log(error);
})
}


function settingScreen() {
  return (
    <View style={Styles.background}>
      <Text style={Styles.text}> Setting 1 </Text>
      <Button title="Share DB" onPress={() => shareDB()}/>  
    </View>
  );
}

export default settingScreen;