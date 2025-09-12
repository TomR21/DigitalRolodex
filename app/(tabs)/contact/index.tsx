import { useFocusEffect, useRouter } from 'expo-router';
import React from "react";
import { Alert, FlatList, Keyboard, Text, TouchableOpacity, View } from "react-native";

import { Styles } from "@/constants/Styles";
import { Card } from '@/constants/Types';
import { editLastMetInDatabase, getCardsFromDatabase } from '@/services/sql_functions';
import { useSearch } from './_layout';


/** Component which displays the contact name and activates redirect on press */
type ItemProps = {title: string, onPress(): void, onLongPress(): void};

const ClickableContact = ({ title, onPress, onLongPress}: ItemProps) => (
  <TouchableOpacity
    style={Styles.clickableContactTouchable}
    activeOpacity={0.7}  // Opacity when Touchable is active (in focus)
    onPress={onPress}
    onLongPress={onLongPress}
  >
    <Text style={Styles.clickableContactText}> {title} </Text>
  </TouchableOpacity>
);

/** Creates an alert window to confirm if the contact last met date should be changed to today */
function alertChangeLastMet(contactId: string, contactName: string) {
  Alert.alert('Change Last Met Date', 'Are you sure you want to change the last met date for ' + contactName + ' to today?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Change Date', onPress: () => editLastMetInDatabase(contactId)},
      
  ]);
}

/** Opens the displayContactScreen and passes along the userId */
function openDisplayContactScreen(contactid: string) {
  const router = useRouter();
  console.log(contactid, " has been pressed")
  router.push({pathname: "../contact/displayContactScreen", params: {contactId: contactid}})
}


/** Filters the input array by checking all matches which include the search string */
function dataFilter(dataArray: Array<Card>, search: string) {
  const dataArrayFiltered = dataArray.filter(data =>
    data.name.toLowerCase().includes(search.toLowerCase()));
  return dataArrayFiltered
}


export default function contactScreen() {
  
  // Holds all card information: (name, id) of all contacts
  const [data, setData] = React.useState<Array<Card>>([]);

  // Find the search value entered in the search bar, default is ''
  const { search } = useSearch();

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
        data={dataFilter(data, search)}
        onScrollBeginDrag={() => {
              Keyboard.dismiss()} // disable keyboard on scroll (automatically puts search bar out of focus)
        }
        keyboardShouldPersistTaps="always" // click on card directly with open keyboard 
        renderItem={({item, index}) => (
          <ClickableContact
            title={item.name}
            onPress={() => openDisplayContactScreen(item.id.toString())}
            onLongPress={() => alertChangeLastMet(item.id.toString(), item.name)}
          />
        )
      }/>

    </View>
)}
