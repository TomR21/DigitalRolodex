import { useFocusEffect } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";

import { VerticalBarBox } from "@/components";
import { Colors } from "@/constants/Colors";
import { Styles, displayStyle } from "@/constants/Styles";
import { BirthdayInfo, EventData, LastMetData, RecentEventsData } from "@/constants/Types";
import { findDaysDifference } from "@/services/datetimeFunctions";
import { getBirthdaysFromDatabase, getLastMetDateFromDatabase, getRecentEventsFromDatabase } from "@/services/sql_functions";

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

    // Add to text if birthday is within the next 30 days or previous 2 days
    if ( daysDiff > 0 && daysDiff < 2 ) {
      birthdayText += "  🎉  " + contact["name"] + " was jarig " + daysDiff + " dag geleden!\n "
    } else if ( daysDiff == 0 ) {
      birthdayText += "  🎉  " + contact["name"] + " is vandaag jarig!\n "
    } else if ( daysDiff > -30 && daysDiff < 0) {
      birthdayText += "  🎉  " + contact["name"] + " is jarig over " + -1*daysDiff + " dagen!\n "
    }
  }

  return birthdayText
}

/** Returns an array of objects containing the name, event name and date of events occuring this month  */
function findSoonEvents(recentEventsData: Array<RecentEventsData>) {
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
        if ( daysDiff > -30 && daysDiff < 1 ) {
          // Matches the regex expression to obtain all text before "[". ? required for null matching. 
          const eventName = recentEvent.match(regex2)?.toString()
          
          const res = {name: contact.name, event: eventName, daysLeft: daysDiff}
          eventArray.push(res)
        }   
      }
    }
  }

  // Sort the array from most recent to last happened
  eventArray.sort(function(a, b) {
    var numA = Number(a.daysLeft)
    var numB = Number(b.daysLeft)
    return (numA < numB) ? -1 : (numA > numB) ? 1 : 0;
  });

  return eventArray
}

/** Returns an array of objects containing the id, name, last_met_date and amount of days since last seen */
function findHighDaysLastMet(lastMetRawData: Array<LastMetData>) {
  //Array to store all output information
  var lastMetArray: Array<LastMetData> = []

  // Loop over every contact
  let contact: LastMetData;
  for (contact of lastMetRawData) {
    
    // Obtain the number of days between today and contact's birthday
    const daysDiff = findDaysDifference(contact["last_met_date"]) 

    // Add to text if birthday is within the next or previous 30 days
    if ( contact.notify_recently_met && Math.abs(daysDiff) > contact.notify_number_days) {
      const res = {id: contact.id, name: contact.name, last_met_date: contact.last_met_date, daysDiff: daysDiff, 
        notify_recently_met: contact.notify_recently_met, notify_number_days: contact.notify_number_days}
      lastMetArray.push(res)
      }
  } 
  console.log("Array: ", lastMetArray)

  return lastMetArray
}


function Index() {
  
  // Use state to store birthday text and an array of events taking place soon
  const [birthdayText, setBirthdayText] = React.useState<string>("");
  const [lastMetData, setLastMetData]   = React.useState<Array<LastMetData>>([]);
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
      const lastMetRawData = await getLastMetDateFromDatabase();

      // Set all the text fields to birthdays this month
      setBirthdayText(findBirthdaysThisMonth(birthdayData))
      setEventData(findSoonEvents(recentEventsData))
      setLastMetData(findHighDaysLastMet(lastMetRawData))
      };

      fetchDataAsync();

    }, []));

  return (
    <View style={Styles.background}>
      <Text style={Styles.text}> Verjaardagen </Text>
      <Text style={Styles.textEvents}> {birthdayText}</Text>

      <View style={displayStyle.divider} />

      {/* Create a list of events taking place this month */}
      <Text style={Styles.text}> Upcoming Events </Text>
      <FlatList
        data={eventData}
        renderItem={({item, index}) => (
            <VerticalBarBox 
            header = {item.name}
            rawText = {item.event + "is over " + -1*item.daysLeft + " dagen"} 
            emoji = ""
            color = {Colors.teal}
          />
      )}/>

      <View style={displayStyle.divider} />

      {/* Create list of people seen longer ago then tag notify date */}
      <Text style={Styles.text}>Long Time No See </Text>
      <FlatList
        data={lastMetData}
        renderItem={({item, index}) => (
          <VerticalBarBox 
            header = {item.name}
            rawText = {"Alweer " + item.daysDiff! + " dagen geleden!"} 
            emoji = ""
            color = {Colors.magenta}
          />
      )}/>
    </View>
  );
}

export default Index;

