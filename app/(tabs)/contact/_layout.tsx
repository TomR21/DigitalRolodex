import { Button } from '@react-navigation/elements'
import { Stack } from 'expo-router'

const StackLayout = () => {
  return ( 
    <Stack>
      <Stack.Screen name="index" 
      options = {{
        title: "Contact List",
        headerRight: () => (
          <Button onPress={() => alert('This is a button!')}> + </Button>
          )}}/>
      <Stack.Screen name="addContactScreen" options={{title: "Add Contact Information"}}/>
      <Stack.Screen name="displayContactScreen" options={{title: "Contact Information"}}/>        
    </Stack>
  )
}

export default StackLayout