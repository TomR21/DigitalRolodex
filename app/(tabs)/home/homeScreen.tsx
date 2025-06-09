import React from "react";
import { Button, Text, View } from "react-native";

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
      birthdayText += contact["name"] + " is jarig over " + daysDiff + " dagen!\n"
    }
  }

  return birthdayText
}


function Index() {
  //const data = await getBirthdaysFromDatabase()
  // Use state to hold contact data
  const initialData = {id:'0', name:"", birthday: "0-0-0000"}
  const [birthdayData, setBirthdayData] = React.useState<Array<BirthdayInfo>>([initialData]);
  const [birthdayText, setBirthdayText] = React.useState<string>("");

  // Load all information upon visiting the screen
    React.useEffect(() => {
      const fetchDataAsync = async () => {
        // Get SQL data from row corresponding to contactId 
        const sqlData = await getBirthdaysFromDatabase(); 
  
        console.log("Will fill the fields with: ", sqlData)
  
        // Set all the text fields to current data 
        setBirthdayData(sqlData)
      };
      fetchDataAsync();
    }, []);

  return (
    <View>
      <Text style={Styles.text}> Home Info 1 </Text>
      <Button title="Get Birthdays" onPress={() => setBirthdayText(getBirthdaysThisMonth(birthdayData))}/>
      <Text style={Styles.text}> {birthdayText} </Text>
    </View>
  );
}

export default Index;

