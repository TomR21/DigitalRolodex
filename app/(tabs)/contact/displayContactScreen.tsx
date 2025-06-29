import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from "react-native";

import { VerticalBarBox } from '@/components';
import { Colors } from '@/constants/Colors';
import { displayStyle } from '@/constants/Styles';
import { QueryOutput } from '@/constants/Types';
import { findDaysDifference, findYearsDifference } from '@/services/datetimeFunctions';
import { getFromDatabase } from '@/services/sql_functions';


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


export default function displayContactScreen() {

  // Retrieve passed contactId parameter   
  const { contactId } = useLocalSearchParams<{ contactId: string }>();
  
  // Use state to hold contact data
  const initialData = {id:0, name:"", birthday:"", address:"", location:"", celnumber:"", email:"", job:"", employer:"",
    know_from:"", know_from_date:"", last_met_date:"", hobbies:"", goals:"", wishes:"", recent_events:"", notes:""}
  const [contactData, setContactData] = React.useState<Array<QueryOutput>>([initialData]);

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
    <ScrollView contentContainerStyle={displayStyle.scrollContainer}>
      <View style={displayStyle.card}>

        {/* Header with name and job */}
        <View style={displayStyle.headerSection}>
          <Text style={displayStyle.name}> {contactData[0].name} </Text>
          <View style={displayStyle.roleBadge}>
            <Text style={displayStyle.roleText}>
              {contactData[0].job} @ {contactData[0].employer}
            </Text>
          </View>
        </View>

        <View style={displayStyle.divider} />

        {/* Display birthday and other timestamps labels and values side by side*/}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Birthday</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>
            {contactData[0].birthday} {makeAgeHeader(contactData[0].birthday)}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>First Met</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>{contactData[0].know_from} {contactData[0].know_from_date}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Last Met</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>
            {contactData[0].last_met_date} {makeLastMetHeader(contactData[0].last_met_date)}</Text>
        </View>

        <View style={displayStyle.divider}/>

        {/* Display contact info labels and values side by side*/}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Phone</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>{contactData[0].celnumber}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Email</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>{contactData[0].email}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Address</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>{contactData[0].address}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Location</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>{contactData[0].location}</Text>
        </View>

        <View style={[displayStyle.divider, { marginVertical: 24 }]} />

        {/* Creates boxes with vertical bars for multiline text data */}
        <VerticalBarBox 
          header="Recent Events"
          rawText={contactData[0].recent_events}
          emoji="👀"  
          color = {Colors.magenta}/>
          
        <VerticalBarBox 
          header="Hobbies"
          rawText={contactData[0].hobbies}
          emoji="⚽️"  
          color = {Colors.blue}/>

        <VerticalBarBox 
          header="Wishes"
          rawText={contactData[0].wishes}
          emoji="🎁"  
          color = {Colors.orange}/>

        <VerticalBarBox 
          header="Goals"
          rawText={contactData[0].goals}
          emoji="🎯"  
          color = {Colors.teal}/>

        <VerticalBarBox 
          header="Notes"
          rawText={contactData[0].notes}
          emoji="🗒️"  
          color = {Colors.amber}/>

      </View>
    </ScrollView>
  );
}