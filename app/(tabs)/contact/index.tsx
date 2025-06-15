import { useFocusEffect, useRouter } from 'expo-router';
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { Styles } from "@/constants/Styles";
import { Card } from '@/constants/Types';
import { getCardsFromDatabase } from '@/services/sql_functions';


type ItemProps = {title: string, onPress(): void};

/** Component which displays the contact name and activates redirect on press */
const ClickableContact = ({ title, onPress}: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={Styles.clickableContactTouchable}
    activeOpacity={0.7}  // Opacity when Touchable is active (in focus)
  >
    <Text style={Styles.clickableContactText}> {title} </Text>
  </TouchableOpacity>
);


/** Opens the displayContactScreen and passes along the userId */
function openDisplayContactScreen(contactid: string) {
  const router = useRouter();
  console.log(contactid, " has been pressed")
  router.push({pathname: "../contact/displayContactScreen", params: {contactId: contactid}})
}


export default function contactScreen() {
  
  // Holds all card information: (name, id) of all contacts
  const [data, setData] = React.useState<Array<Card>>([]);

  // Obtain the name and contactId of all contacts each time the screen is in focus 
  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    React.useCallback(() => {
      // Invoked whenever the route is focused.
      async function loadData() {
        const sqlData = await getCardsFromDatabase(); 
        setData(sqlData);
      };

      loadData();
    }, []));


  return (
    <View style={Styles.centering}>
      
      {/* Create a list of clickable contacts. Clicking opens new DisplayContact screen*/}
      <FlatList
        data={data}
        renderItem={({item, index}) => (
          <ClickableContact
            title={item.name}
            onPress={() => openDisplayContactScreen(item.id.toString())}/>
        )
      }/>

    </View>
)}
