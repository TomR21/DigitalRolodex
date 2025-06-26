import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import { createContext, useContext, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/Colors';
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

/** Context from search bar that will be passed on to contact list for filtering */
const SearchContext = createContext<{search: string, setSearch: (val: string) => void;}> (
  { search: '',
    setSearch: () => {},
  });

// Create function useSearch which finds the context passed down to the child component
export const useSearch = () => useContext(SearchContext);

/** Component which passes down the search state and setSearch function onto the child component */
const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState('');
  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

/** Component  */
function SearchBar() {
  const { search, setSearch } = useSearch();

  return (
    <TextInput
      placeholder="Search..."
      value={search}
      onChangeText={setSearch}
      style={{
        backgroundColor: Colors.lightgray,
        color: Colors.white,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontSize: 14,
      }}
      placeholderTextColor='gray'
    />
  );
}


const StackLayout = () => {
  // Obtain current contactId if passed through
  const { contactId } = useGlobalSearchParams<{ contactId: string }>();

  return ( 
    <SearchProvider>
      <Stack screenOptions={{headerStyle: {backgroundColor: Colors.gray}}}>
        
        <Stack.Screen name="index" 
          options = {{
            headerLeft: () => (
              <View style={{ paddingLeft: 5 }}>
                <Text style={{ color: Colors.white, fontSize: 20, fontWeight: 'bold' }}>
                  Contacts
                </Text>
              </View>
            ),

            headerTitle: () => (
              <View style={{ width: 150, paddingLeft: 10 }}>
                <SearchBar />
              </View>
            ),

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
    </SearchProvider>
  )
}

export default StackLayout