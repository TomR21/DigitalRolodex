import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Router, Stack, useRouter } from 'expo-router';
import { createContext, useContext, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/Colors';


/** Opens the displayContactScreen */
function openAddContactScreen(router: Router) {
  router.push("../contact/addContactScreen")
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

/** Component which holds TextInput and makes use of SearchContext to pass through input text  */
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
  // use router to navigate to other screens 
  const router = useRouter();

  return ( 
    <SearchProvider>
      <Stack screenOptions={{ headerStyle: {backgroundColor: Colors.gray}, headerTintColor: Colors.white}}>
        
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
              <FontAwesome.Button size={24} name="user-plus" color={Colors.white} backgroundColor={Colors.gray} underlayColor={Colors.gray} 
                onPress={() => openAddContactScreen(router)}/>
            )

          }}/>
    
        <Stack.Screen name="addContactScreen" options={{title: "Add Contact Information"}}/>
        
        <Stack.Screen name="DisplayContactScreen" 
          options = {{
            title: "Contact Info",
          }}/>

      </Stack>
    </SearchProvider>
  )
}

export default StackLayout