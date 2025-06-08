//import { Button } from '@react-navigation/elements';
import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

import { Styles } from '@/constants/Styles';

/** Opens the displayContactScreen */
function openAddContactScreen() {
  const router = useRouter();
  router.push("../contact/addContactScreen")
}


const StackLayout = () => {
  return ( 
    <Stack>
      <Stack.Screen name="index" 
      options = {{
        title: "Contact List",
        headerRight: () => (
          <TouchableOpacity style={Styles.button} 
            onPress={() => openAddContactScreen()}>
            <Text style={Styles.text}> Add Contact </Text>
          </TouchableOpacity>
          //<Button onPress={() => openAddContactScreen()}> + </Button>
      )}}/>
      <Stack.Screen name="addContactScreen" options={{title: "Add Contact Information"}}/>
      <Stack.Screen name="displayContactScreen" options={{title: "Contact Information"}}/>        
    </Stack>
  )
}

export default StackLayout