import { useFocusEffect, useRouter } from 'expo-router';
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { Styles } from "@/constants/Styles";
import { Card } from '@/constants/Types';
import { getCardsFromDatabase } from '@/services/sql_functions';

type ItemProps = {title: string};

const Item = ({title}: ItemProps) => (
  <View style={Styles.flatListItem}>
    <Text style={Styles.flatListTitle}>{title}</Text>
  </View>
);

/** Opens the displayContactScreen and passes along the userId */
function openDisplayContactScreen(contactid: string) {
  const router = useRouter();
  console.log(contactid, " has been pressed")
  router.push({pathname: "../contact/displayContactScreen", params: {contactId: contactid}})
}

/** Opens the displayContactScreen */
function openAddContactScreen() {
  const router = useRouter();
  router.push("../contact/addContactScreen")
}


export default function contactScreen() {
  
  // Holds all card information: (name, id) of all contacts
  const [data, setData] = React.useState<Array<Card>>([]);

  // Obtain the list of all contacts each time the screen is in focus 
  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    React.useCallback(() => {
      // Invoked whenever the route is focused.
      console.log("Hello, I'm focused!");

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
        renderItem={({item ,index}) => (
          <TouchableOpacity 
            key={index.toString()} 
            onPress={() => openDisplayContactScreen((item.id).toString())}
          >
          <Item title = {item.name} />
          </TouchableOpacity>
      )}/>

      <TouchableOpacity style={Styles.buttonRounded} 
        onPress={() => openAddContactScreen()}>
        <Text style={Styles.text}> Click me! </Text>
      </TouchableOpacity>
          
    </View>
)}
