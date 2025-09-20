import migrations from '@/drizzle/migrations/migrations';
import DB from '@/services/DatabaseManager';
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from "expo-router";
import { Text, View } from "react-native";


// Establish database connection when not connected
if ( !DB.connection ) {
  DB.connect()
}
const drizzDB = drizzle(DB.connection!)


export default function RootLayout() {
  // Apply Drizzle migrations
  const { success, error: migrationError } = useMigrations(drizzDB, migrations);

  if ( migrationError ) {
    console.log("Migration Error: ", migrationError)
    return (
      <View>
        <Text style={{color: 'white'}}> Migration error: {migrationError.message} </Text>
      </View>
    );
  }
  if ( !success ) {
    return (
      <View>
        <Text style={{color: 'white'}}>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value = {DarkTheme}>
    <Stack >

      <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>

    </Stack>
    </ThemeProvider>
    );
}