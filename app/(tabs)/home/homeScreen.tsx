import { useFocusEffect } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { Styles } from "@/constants/Styles";
import { BirthdayInfo, recentEventsData } from "@/constants/Types";
import { getBirthdaysFromDatabase, getRecentEventsFromDatabase } from "@/services/sql_functions";

// Voor starten van de applicatie
// npx expo start


function findBirthdaysThisMonth(birthdayData: Array<BirthdayInfo>) {
  // Text variable to store all output information
  var birthdayText: string = ""

  const currDateArray = new Date().toLocaleDateString().split("/")  // Date format: 04/30/2025
  const currMonth = currDateArray[0]
  const currDay = currDateArray[1]

  let contact: BirthdayInfo;

  for (contact of birthdayData) {
    const birthDate = contact["birthday"].split("-")

    if (Number(birthDate[1]) == Number(currMonth)) {
      const daysDiff = Number(birthDate[0]) - Number(currDay)
      birthdayText += "  🎉  " + contact["name"] + " is jarig over " + daysDiff + " dagen!\n "
    }
  }

  return birthdayText
}

/** Returns a string containing the names, event names and dates of all users with events occuring this month  */
function findSoonEvents(recentEventsData: Array<recentEventsData>) {
  // Text variable to store all output information
  var displayText: string = ""

  const currDateArray = new Date().toLocaleDateString().split("/")  // Date format: 04/30/2025
  const currMonth = currDateArray[0]
  const currDay = currDateArray[1]

  let contact: recentEventsData;
  let recentEvent: string

  // Matches all text between '[' and ']' 
  const regex = new RegExp('(?<=\\[).+?(?=\\])')
  // Matches all text before first occurence of '[' character
  const regex2 = new RegExp('.+?(?=\\[)')

  // Loop over every contact to find applicable events with date
  for (contact of recentEventsData) {
    
    const recentEvents = contact["recent_events"].split(".")
    
    // For every event check if it contains a date 
    for (recentEvent of recentEvents) {
      
      const eventDate = recentEvent.match(regex)
      if ( eventDate !== null) {

        // Find day and month from the event date 
        const dateSplit = eventDate.toString().split("-")
        const eventDay = dateSplit[0]
        const eventMonth = dateSplit[1]
        
        // If event is in this month add it to output text
        if (Number(eventMonth) == Number(currMonth)) {
          // Matches the regex expression to obtain all text before "[". ? required for null matching. 
          const eventName = recentEvent.match(regex2)?.toString()
          const daysDiff = Number(eventDay) - Number(currDay)

          displayText += "  🗣️  " + eventName + "van " + contact.name + " is in " + daysDiff + " dagen!\n "
        }   
      }
    }
  }
  return displayText
}


function Index() {
  
  // Use state to store birthday and events text
  const [birthdayText, setBirthdayText]         = React.useState<string>("");
  const [recentEventsText, setRecentEventsText] = React.useState<string>("");

  // Obtain the list of all birthdays each time the screen is in focus 
  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    React.useCallback(() => {
      // Invoked whenever the route is focused.
      const fetchDataAsync = async () => {
      // Get all birthdays, names and contact ID's from SQL data 
      const birthdayData = await getBirthdaysFromDatabase(); 
      const recentEventsData = await getRecentEventsFromDatabase();

      // Set all the text fields to birthdays this month
      setBirthdayText(findBirthdaysThisMonth(birthdayData))
      setRecentEventsText(findSoonEvents(recentEventsData))
      };

      fetchDataAsync();

    }, []));

  return (
    <View>
      <Text style={Styles.text}> Verjaardagen: </Text>
      <Text style={Styles.textEvents}> {birthdayText} </Text>
      <Text style={Styles.text}> {'\n'}Upcoming Events:</Text>
      <Text style={Styles.textEvents}> {recentEventsText} </Text>
    </View>
  );
}

export default Index;

