import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Router, useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Alert, ScrollView, Text, View } from "react-native";

import { VerticalBarBox } from '@/components';
import { Colors } from '@/constants/Colors';
import { displayStyle } from '@/constants/Styles';
import { contactTable } from '@/db/schema';
import { findDaysDifference, findYearsDifference } from '@/services/datetimeFunctions';
import { getFromDatabase, removeFromDatabase } from '@/services/sql_functions';


/** Pushes user to addContactScreen with contactId to edit info */
function openEditContactScreen(router: Router, contactId: string) {
  router.push({pathname: "../contact/AddContactScreen", params: {contactId: contactId}})
}

/** Deletes contact in SQL database and goes back to previous screen */
async function deleteContact(router: Router, contactId: string) {
  await removeFromDatabase(contactId)
  router.back()
}

/** Creates an alert window to confirm if the info corresponding contactId needs to be removed  */
function contactDeletionAlert(router: Router, contactId: string) {
  Alert.alert('Delete Contact Information', 'Are you sure you want to delete all the information about this contact?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Delete', onPress: () => deleteContact(router, contactId)},
  ]);
}

/** Return empty header for unknown age and age within brackets for calculated age  */
function makeAgeHeader(date: string | null) {
  if (date === null) {
    return ""
  } else {
    return "(" + findYearsDifference(date) + ")"
  }
}

/** Return empty header for unknown seen time ago and days/years ago within brackets */
function makeLastMetHeader(date: string | null) {
  if (date === null) {
    return ""
  } else {
    const yearsDiff = findYearsDifference(date)
    const daysDiff = findDaysDifference(date)
    var printText = "(" 
    if (yearsDiff == 0) {
      printText += daysDiff + " days)"
    } else {
      printText += yearsDiff + "yrs)"
    }
    
    return printText 
  }
}


export default function DisplayContactScreen() {
  
  // Retrieve passed contactId parameter   
  const { contactId } = useLocalSearchParams<{ contactId: string }>();

  // use router to navigate to other screens 
  const router = useRouter();

  // Use state to hold contact data
  const initialData = {id:0, name:"", tag_id:0, birthday:"", address:"", location:"", celnumber:"", email:"", job:"", employer:"",
    know_from:"", know_from_date:"", last_met_date:"", hobbies:"", goals:"", wishes:"", recent_events:"", notes:"", linkedin:""}
  const [contactData, setContactData] = React.useState<typeof contactTable.$inferSelect>(initialData);

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

    }, [contactId]));


    const navigation = useNavigation();
    useLayoutEffect(() => {
      navigation.setOptions({
            // Display the edit and delete button on the right of the header
            headerRight: () => (
              <View style = {{flexDirection: 'row'}}>
                <FontAwesome.Button size={24} name="pencil" color={Colors.white} backgroundColor={Colors.gray} underlayColor={Colors.gray} 
                  onPress={() => openEditContactScreen(router, contactId)}/>
                <FontAwesome.Button size={24} name="trash" color={Colors.white} backgroundColor={Colors.gray} underlayColor={Colors.gray} 
                  onPress={() => contactDeletionAlert(router, contactId)}/>
              </View>
            ),
          })
  },[navigation, contactId]);


  return (
    <ScrollView contentContainerStyle={displayStyle.scrollContainer}>
      <View style={displayStyle.card}>

        {/* Header with name and job */}
        <View style={displayStyle.headerSection}>
          <Text style={displayStyle.name}> {contactData.name} </Text>
          <View style={displayStyle.roleBadge}>
            <Text style={displayStyle.roleText}>
              {contactData.job} @ {contactData.employer}
            </Text>
          </View>
        </View>

        <View style={displayStyle.divider} />

        {/* Display birthday and other timestamps labels and values side by side*/}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Birthday</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>
            {contactData.birthday} {makeAgeHeader(contactData.birthday)}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>First Met</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>{contactData.know_from} {contactData.know_from_date}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Last Met</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>
            {contactData.last_met_date} {makeLastMetHeader(contactData.last_met_date)}</Text>
        </View>

        <View style={displayStyle.divider}/>

        {/* Display contact info labels and values side by side*/}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Phone</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>{contactData.celnumber}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Email</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>{contactData.email}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Address</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>{contactData.address}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Location</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>{contactData.location}</Text>
        </View>

        <View style={[displayStyle.divider, { marginVertical: 24 }]} />

        {/* Creates boxes with vertical bars for multiline text data */}
        <VerticalBarBox 
          header="Recent Events"
          rawText={contactData.recent_events}
          emoji="👀"  
          color = {Colors.magenta}/>
          
        <VerticalBarBox 
          header="Hobbies"
          rawText={contactData.hobbies}
          emoji="⚽️"  
          color = {Colors.blue}/>

        <VerticalBarBox 
          header="Wishes"
          rawText={contactData.wishes}
          emoji="🎁"  
          color = {Colors.orange}/>

        <VerticalBarBox 
          header="Goals"
          rawText={contactData.goals}
          emoji="🎯"  
          color = {Colors.teal}/>

        <VerticalBarBox 
          header="Notes"
          rawText={contactData.notes}
          emoji="🗒️"  
          color = {Colors.amber}/>

      </View>
    </ScrollView>
  );
}