import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { removeFromDatabase } from '@/services/sql_functions';


/** Opens the displayContactScreen */
function openAddContactScreen() {
  const router = useRouter();
  router.push("../contact/addContactScreen")
}

/** Pushes user to addContactScreen with contactId to edit info */
function openEditContactScreen(contactId: string) {
  const router = useRouter()
  router.push({pathname: "../contact/addContactScreen", params: {contactId: contactId}})
}

/** Creates an alert window to confirm if the info corresponding contactId needs to be removed  */
function contactDeletionAlert(contactId: string) {
  Alert.alert('Delete Contact Information', 'Are you sure you want to delete all the information about this contact?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Delete', onPress: () => deleteContact(contactId)},
  ]);
}

/** Deletes contact in SQL database and goes back to previous screen */
async function deleteContact(contactId: string) {
  await removeFromDatabase(contactId)
  const router = useRouter()
  router.back()
}

const StackLayout = () => {
  // Obtain current contactId if passed through
  const { contactId } = useGlobalSearchParams<{ contactId: string }>();

  return ( 
    <Stack>
      <Stack.Screen name="index" 
        options = {{
          title: "Contact List",

          // Display an add contact button (+) on the right of the header
          headerRight: () => (
            <FontAwesome.Button size={24} name="user-plus" color="white" backgroundColor="dark" underlayColor="dark" 
              onPress={() => openAddContactScreen()}/>
          )

        }}/>
      <Stack.Screen name="addContactScreen" options={{title: "Add Contact Information"}}/>
      <Stack.Screen name="displayContactScreen" 
        options = {{
          title: "Contact Info",
          
          // Display the edit and delete button on the right of the header
          headerRight: () => (
            <View style = {{flexDirection: 'row'}}>
              <FontAwesome.Button size={24} name="pencil" color="white" backgroundColor="dark" underlayColor="dark" 
                onPress={() => openEditContactScreen(contactId)}/>
              <FontAwesome.Button size={24} name="trash" color="white" backgroundColor="dark" underlayColor="dark" 
                onPress={() => contactDeletionAlert(contactId)}/>
            </View>
          )

        }}/>        
    </Stack>
  )
}

export default StackLayout