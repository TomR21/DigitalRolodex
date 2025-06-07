import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Button, Text, View } from "react-native";

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

async function deleteContact(contactId: string) {
  await removeFromDatabase(contactId)
  const router = useRouter()
  router.back()
}

function editContact(contactId: string) {
  const router = useRouter()
  router.push({pathname: "../contact/addContactScreen", params: {contactId: contactId}})
}


export default function displayContactScreen() {
    
    // Retrieve passed contactId parameter   
    const { contactId } = useLocalSearchParams<{ contactId: string }>();
    
    // Use state to hold contact data
    const initialData = {id:0, name:"", birthday:"", address:"", location:"", celnumber:"", job:"", employer:"",
      hobbies:"", goals: "", wishes:"", recentEvents:""}
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
        <Text> Personal Information </Text>
        <Text> Contact ID: {contactId} </Text>
        <Text> Name: {contactData[0].name}</Text>
        <Text> Birthday: {contactData[0].birthday}</Text>
        <Text> Address: {contactData[0].address}</Text>
        <Text> Location: {contactData[0].location}</Text>
        <Text> Celphone number: {contactData[0].celnumber}</Text>
        <Text> Job: {contactData[0].job}</Text>
        <Text> Employer: {contactData[0].employer}</Text>
        <Text> Hobbies: {contactData[0].hobbies}</Text>
        <Text> Goals: {contactData[0].goals}</Text>
        <Text> Wishes: {contactData[0].wishes}</Text>
        <Text> Recent Events: {contactData[0].recentEvents}</Text>


        <Button 
          title = "Remove Contact"
          onPress={() => contactDeletionAlert(contactId)}/>
        <Button 
          title = "Edit Contact"
          onPress={() => editContact(contactId)}/>
      </View>
    );
}