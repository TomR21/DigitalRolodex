import { Stack } from 'expo-router';

import { Colors } from '@/constants/Colors';


export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: Colors.gray }, headerTintColor: Colors.white }}>

      <Stack.Screen name="settingScreen" options={{ title: 'Settings' }} />
    
    </Stack>
  );
}