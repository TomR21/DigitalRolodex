import { useFocusEffect } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { Styles } from "@/constants/Styles";
import { BirthdayInfo, EventData, RecentEventsData } from "@/constants/Types";
import { findDaysDifference } from "@/services/datetimeFunctions";
import { getBirthdaysFromDatabase, getRecentEventsFromDatabase } from "@/services/sql_functions";

// Voor starten van de applicatie
// npx expo start


function findBirthdaysThisMonth(birthdayData: Array<BirthdayInfo>) {
  // Text variable to store all output information
  var birthdayText: string = ""

  // Loop over every contact
  let contact: BirthdayInfo;
  for (contact of birthdayData) {

    // Obtain the number of days between today and contact's birthday
    const daysDiff = findDaysDifference(contact["birthday"]) 

    // Add to text if birthday is within the next or previous 30 days
    if ( Math.abs(daysDiff) < 30) {
      birthdayText += "  🎉  " + contact["name"] + " is jarig over " + daysDiff + " dagen!\n "
    }
  }

  return birthdayText
}

/** Returns an array of objects containing the name, event name and date of events occuring this month  */
function findSoonEvents2(recentEventsData: Array<RecentEventsData>) {
  // Text variable to store all output information
  var eventArray: Array<EventData> = []

  let contact: RecentEventsData;
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
        const daysDiff = findDaysDifference(eventDate.toString())
        
        // If event is in this month add it to output text
        if ( daysDiff < 30 && daysDiff > -1 ) {
          // Matches the regex expression to obtain all text before "[". ? required for null matching. 
          const eventName = recentEvent.match(regex2)?.toString()
          
          const res = {name: contact.name, event: eventName, daysLeft: daysDiff.toString()}
          eventArray.push(res)
        }   
      }
    }
  }
  return eventArray
}

/** Component which displays the event info */
const EventDisplay = ({ name, event, daysLeft}: EventData) => (
  <View style={Styles.eventView}>
    <Text style={{...Styles.text, fontSize: 16}}> {name} </Text>
    <Text style={{...Styles.text, fontSize: 14, color: Colors.lightgray}}> {event} in {daysLeft} dagen! </Text>
  </View>
);


function Index() {
  
  // Use state to store birthday text and an array of events taking place soon
  const [birthdayText, setBirthdayText] = React.useState<string>("");
  const [eventData, setEventData]       = React.useState<Array<EventData>>([]);

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
      setEventData(findSoonEvents2(recentEventsData))
      };

      fetchDataAsync();

    }, []));

  return (
    <View style={Styles.background}>
      <Text style={Styles.text}> Verjaardagen </Text>
      <Text style={Styles.textEvents}> {birthdayText} {'\n'}</Text>
      <Text style={Styles.text}> Upcoming Events </Text>

      {/* Create a list of events taking place this month */}
      <FlatList
        data={eventData}
        renderItem={({item, index}) => (
          <EventDisplay
            name={item.name}
            event={item.event}
            daysLeft={item.daysLeft}/>
      )}/>
    </View>
  );
}

export default Index;

