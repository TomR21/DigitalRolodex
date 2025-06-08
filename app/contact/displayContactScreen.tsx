import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { Styles } from '@/constants/Styles';
import { data_row } from '@/constants/Types';
import { getFromDatabase, removeFromDatabase } from '@/services/sql_functions';


/** Creates an alert window to confirm if the info corresponding contactId needs to be removed  */
const contactDeletionAlert = (contactId: string) =>
    Alert.alert('Delete Contact Information', 'Are you sure you want to delete all the information about this contact?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Delete', onPress: () => deleteContact(contactId)},
    ]);

/** Deletes contact in SQL database and goes back to previous screen */
async function deleteContact(contactId: string) {
  await removeFromDatabase(contactId)
  const router = useRouter()
  router.back()
}

/** Pushes user to addContactScreen with contactId to edit info */
function editContact(contactId: string) {
  const router = useRouter()
  router.push({pathname: "../contact/addContactScreen", params: {contactId: contactId}})
}

/** Converts string with delimiter to multiline string for Text display */
function makeTextHeader(notes: string|null, delimiter: string, emoji: string) {
    if (notes === null) {
      return null
    } else {
      // Store each separate note on a new line
      var message: string = ""
      
      for (const str of notes.split(delimiter)) {
        message += emoji + str + "\n"
      }
      
      // Cut off final newline and return message
      //message = message.replace(/\n$/, "")
      return message.trim()
    }
}

/** Calculate age from birthday */
function calculateAge(date: string|null) {
  if (date === null) {
    return null
  } else{
    // Get birthyear from entered date
    const birthyear = date.split("-")[2] 

    // Get current year
    const today = new Date().toString()
    const yeartoday = today.split(" ")[3] // Date format: Mon 30 12 1991 23:55:14 GMT+0200
    
    const age = Number(yeartoday) - Number(birthyear) - 1
    return age
  }
}


export default function displayContactScreen() {
  
  // Retrieve passed contactId parameter   
  const { contactId } = useLocalSearchParams<{ contactId: string }>();
  
  // Use state to hold contact data
  const initialData = {id:0, name:"", birthday:"", address:"", location:"", celnumber:"", job:"", employer:"",
    hobbies:"", goals:"", wishes:"", recent_events:""}
  const [contactData, setContactData] = React.useState<Array<data_row>>([initialData]);

  // Obtain the list of all contacts each time the screen is in focus 
  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    React.useCallback(() => {
      // Invoked whenever the route is focused.
      console.log("Hello, I'm focused!");

      async function getToken() {
        const sqlData = await getFromDatabase(contactId); 
        setContactData(sqlData);
      };

      getToken();

    }, []));

      
  return (
    <View>
      <Text style={Styles.text}> Personal Information </Text>
      <Text style={Styles.text}> Contact ID: {contactId} </Text>
      <Text style={Styles.text}> Name: {contactData[0].name}</Text>
      <Text style={Styles.text}> Birthday: {contactData[0].birthday} ({calculateAge(contactData[0].birthday)})</Text>
      <Text style={Styles.text}> Address: {contactData[0].address}</Text>
      <Text style={Styles.text}> Location: {contactData[0].location}</Text>
      <Text style={Styles.text}> Celphone number: {contactData[0].celnumber}</Text>
      <Text style={Styles.text}> Job: {contactData[0].job}</Text>
      <Text style={Styles.text}> Employer: {contactData[0].employer}</Text>
      <Text style={Styles.text}> Hobbies: {'\n'}  {makeTextHeader(contactData[0].hobbies, ".", "  ⚽️  ")} </Text>
      <Text style={Styles.text}> Goals: {'\n'}  {makeTextHeader(contactData[0].goals, ".", "  🎯  ")} </Text>
      <Text style={Styles.text}> Wishes: {'\n'}  {makeTextHeader(contactData[0].wishes, ".", "  🎁  ")} </Text>
      <Text style={Styles.text}> Recent Events: {'\n'}  {makeTextHeader(contactData[0].recent_events, ".", "  👀  ")} </Text>


      <TouchableOpacity style={Styles.buttonRounded} 
        onPress={() => contactDeletionAlert(contactId)}>
        <Text style={Styles.text}> Remove Contact </Text>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.buttonRounded} 
        onPress={() => editContact(contactId)}>
        <Text style={Styles.text}> Edit Contact </Text>
      </TouchableOpacity>

    </View>
  );
}