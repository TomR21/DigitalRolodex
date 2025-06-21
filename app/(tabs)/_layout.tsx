import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from "expo-router";

import { Colors } from '@/constants/Colors';


export default function RootLayout() {
  return (
    // Create a bottom tab to switch between the different screens
    <Tabs screenOptions={{tabBarStyle: {backgroundColor: Colors.gray}, headerStyle: {backgroundColor: Colors.gray}}}>
      <Tabs.Screen
        name="home/homeScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color}/>,
        }}/>
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Personen',
          headerShown: false, 
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color}/>
        }}/>
      <Tabs.Screen
        name="settings/settingScreen"
        options={{
          title: 'Settings', 
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color}/>
        }}/>
    </Tabs>
  );
}
