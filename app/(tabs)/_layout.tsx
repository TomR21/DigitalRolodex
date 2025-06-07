import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Button } from '@react-navigation/elements';
import { Tabs } from "expo-router";


export default function RootLayout() {
  return (
    // Create a bottom tab to switch between the different screens
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color}/>
        }}/>
      <Tabs.Screen
        name="contactScreen"
        options={{
          title: 'Personen', 
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color}/>,
          headerRight: () => (
          <Button onPress={() => alert('This is a button!')}> + </Button>
          )
        }}/>
      <Tabs.Screen
        name="settingScreen"
        options={{
          title: 'Settings', 
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color}/>
        }}/>
    </Tabs>
  );
}
