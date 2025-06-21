import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from "react-native";

import { displayStyle } from '@/constants/Styles';
import { QueryOutput } from '@/constants/Types';
import { getFromDatabase } from '@/services/sql_functions';


const VBarColors = {
  blue: '#2980b9',             // strong blue
  orange: '#d35400',           // warm orange
  teal: '#16a085',             // calm teal greenish-blue
  purple: '#8e44ad',           // rich moderate purple
  pink: '#e91e63',             // vibrant pink
  cyan: '#00bcd4',             // bright cyan, fresh and readable
  lime: '#cddc39',             // yellow-green fresh accent
  amber: '#ffc107',            // warm amber gold for highlights
  redAccent: '#e74c3c',        // vivid red for alert or emphasis
  magenta: '#d81b60',          // deep magenta, elegant contrast
};

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

/** Return empty header for unknown age and age within brackets for calculated age  */
function makeAgeHeader(age: number | null) {
  if (age === null) {
    return ""
  } else {
    return "(" + age + ")"
  }
}

/** Calculate age from birthday */
function calculateAge(date: string|null) {
  if (date === null) {
    return null
  } else {
    // Get birthyear from entered date
    const birthdayArray = date.split("-") 
    const birthyear = birthdayArray[2]

    // Get current year
    const currdayArray = new Date().toString().split(" ")
    const yeartoday = currdayArray[3] // Date format: Mon 30 12 1991 23:55:14 GMT+0200
    
    // Calculate age difference between today and birth
    var age = Number(yeartoday) - Number(birthyear) - 1 
    
    // Add 1 to age if day of birth has already taken place this year
    if (Number(birthdayArray[1]) < Number(currdayArray[2])) {age++} 
    if (Number(birthdayArray[1]) == Number(currdayArray[2]) && Number(birthdayArray[0]) <= Number(currdayArray[1])) {age++} 

    return age
  }
}


export default function displayContactScreen() {

  // Retrieve passed contactId parameter   
  const { contactId } = useLocalSearchParams<{ contactId: string }>();
  
  // Use state to hold contact data
  const initialData = {id:0, name:"", birthday:"", address:"", location:"", celnumber:"", email:"", job:"", employer:"",
    know_from:"", know_from_date:"", hobbies:"", goals:"", wishes:"", recent_events:"", notes:""}
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

        {/* Header with name and role */}
        <View style={displayStyle.headerSection}>
          <Text style={displayStyle.name}> {contactData[0].name} </Text>
          <View style={displayStyle.roleBadge}>
            <Text style={displayStyle.roleText}>
              {contactData[0].job} @ {contactData[0].employer}
            </Text>
          </View>
        </View>


        {/* Divider */}
        <View style={displayStyle.divider} />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Birthday</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>
            {contactData[0].birthday} {makeAgeHeader(calculateAge(contactData[0].birthday))}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>First Met</Text>
          <Text adjustsFontSizeToFit={true} numberOfLines={1} style={displayStyle.text}>{contactData[0].know_from} {contactData[0].know_from_date}</Text>
        </View>

        {/* Divider */}
        <View style={displayStyle.divider} />


        {/* Contact Info Box with labels and values side by side */}
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

        {/* Horizontal Divider */}
        <View style={[displayStyle.divider, { marginVertical: 24 }]} />

        {/* Recent Events Box with vertical bar */}
        <View style={displayStyle.notesContainer}>
          <View style={{...displayStyle.verticalBarNotes, backgroundColor: VBarColors.magenta}} />
          <View style={displayStyle.notesContent}>
            <Text style={displayStyle.label}>Recent Events</Text>
            <Text style={displayStyle.text}>{makeTextHeader(contactData[0].recent_events, ".", "👀  ")}</Text>
          </View>
        </View>

        {/* Hobbies Box with vertical bar */}
        <View style={displayStyle.notesContainer}>
          <View style={{...displayStyle.verticalBarNotes, backgroundColor: VBarColors.blue}} />
          <View style={displayStyle.notesContent}>
            <Text style={displayStyle.label}>Hobbies</Text>
            <Text style={displayStyle.text}>{makeTextHeader(contactData[0].hobbies, ".", "⚽️  ")}</Text>
          </View>
        </View>

        {/* Wishes Box with vertical bar */}
        <View style={displayStyle.notesContainer}>
          <View style={{...displayStyle.verticalBarNotes, backgroundColor: VBarColors.orange}}/>
          <View style={displayStyle.notesContent}>
            <Text style={displayStyle.label}>Wishes</Text>
            <Text style={displayStyle.text}>{makeTextHeader(contactData[0].wishes, ".", "🎁  ")}</Text>
          </View>
        </View>

        {/* Goals Box with vertical bar */}
        <View style={displayStyle.notesContainer}>
          <View style={{...displayStyle.verticalBarNotes, backgroundColor: VBarColors.teal}} />
          <View style={displayStyle.notesContent}>
            <Text style={displayStyle.label}>Goals</Text>
            <Text style={displayStyle.text}>{makeTextHeader(contactData[0].goals, ".", "🎯  ")}</Text>
          </View>
        </View>

        {/* Notes Box with vertical bar */}
        <View style={displayStyle.notesContainer}>
          <View style={{...displayStyle.verticalBarNotes, backgroundColor: VBarColors.amber}} />
          <View style={displayStyle.notesContent}>
            <Text style={displayStyle.label}>Notes</Text>
            <Text style={displayStyle.text}>{makeTextHeader(contactData[0].notes, ".", "🗒️  ")}</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}