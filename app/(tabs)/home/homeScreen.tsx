import { useFocusEffect } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { Styles } from "@/constants/Styles";
import { BirthdayInfo } from "@/constants/Types";
import { getBirthdaysFromDatabase } from "@/services/sql_functions";

// Voor starten van de applicatie
// npx expo start

function getBirthdaysThisMonth(birthdayData: Array<BirthdayInfo>) {
  var birthdayText: string = ""

  const currDateArray = new Date().toLocaleDateString().split("/")  // Date format: 04/30/2025
  const currMonth = currDateArray[0]
  const currDay = currDateArray[1]

  let contact: BirthdayInfo;

  for (contact of birthdayData) {
    const birthDate = contact["birthday"].split("-")
    const birthMonth = birthDate[1]

    if (Number(birthMonth) == Number(currMonth)) {
      const daysDiff = Number(birthDate[0]) - Number(currDay)
      birthdayText += contact["name"] + " is jarig over " + daysDiff + " dagen!\n "
    }
  }

  return birthdayText
}


function Index() {
  
  // Use state to hold contact data
  const initialData = {id:'0', name:"", birthday: "0-0-0000"}
  const [birthdayData, setBirthdayData] = React.useState<Array<BirthdayInfo>>([initialData]);
  const [birthdayText, setBirthdayText] = React.useState<string>("");

  // Obtain the list of all birthdays each time the screen is in focus 
  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    React.useCallback(() => {
      // Invoked whenever the route is focused.
      const fetchDataAsync = async () => {
      // Get all birthdays, names and contact ID's from SQL data 
      const sqlData = await getBirthdaysFromDatabase(); 

      // Set all the text fields to birthdays this month
      setBirthdayData(sqlData)
      setBirthdayText(getBirthdaysThisMonth(sqlData))
      };

      fetchDataAsync();

    }, []));

  return (
    <View>
      <Text style={Styles.text}> Verjaardagen: </Text>
      <Text style={Styles.text}> {birthdayText} </Text>
    </View>
  );
}

export default Index;

