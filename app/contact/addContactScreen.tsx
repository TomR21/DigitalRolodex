import { useLocalSearchParams, useRouter } from 'expo-router';
import React from "react";
import { Button, Text, TextInput, View } from "react-native";

import { Styles } from "@/constants/Styles";
import { QueryInput } from '@/constants/Types';
import { addToDatabase, editDatabase, getFromDatabase } from '@/services/sql_functions';


/** Decider function to add new user or edit information based on contactId existence */
async function changeDatabase(contactId: string, input: QueryInput) {
  
  // Create new row when not directed to screen with contactId, else edit
  if (contactId === undefined) {
    console.log("Creating addition query")
    await addToDatabase(input)
  } else {
    console.log("Creating edit query")
    await editDatabase(contactId, input)
  }

  // Go back to page where we came from
  const router = useRouter()
  router.back()
}


export default function addContactScreen() {

  // Retrieve passed contactId parameter   
  const { contactId } = useLocalSearchParams<{ contactId: string }>();

  // Variables which update using set... when information is changed in TextInput
  const [name, setName] = React.useState<string>('');
  const [birthday, setBirthday] = React.useState<string|null>(null);
  const [address, setAddress] = React.useState<string|null>(null);
  const [location, setLocation] = React.useState<string|null>(null);
  const [celnumber, setCelnumber] = React.useState<string|null>(null);
  const [job, setJob] = React.useState<string|null>(null);
  const [employer, setEmployer] = React.useState<string|null>(null);
  const [hobbies, setHobbies] = React.useState<string|null>(null);
  const [goals, setGoals] = React.useState<string|null>(null);
  const [wishes, setWishes] = React.useState<string|null>(null);
  const [recentEvents, setRecentEvents] = React.useState<string|null>(null);
  
  // Object which stores all the current fields in the TextInput fields
  const input: QueryInput = {
    name: name,
    birthday: birthday,
    address: address,
    location: location,
    celnumber: celnumber,
    job: job,
    employer: employer,
    hobbies: hobbies,
    goals: goals,
    wishes: wishes,
    recentEvents: recentEvents
  }

  // Load all information upon visiting the screen
  React.useEffect(() => {
          const fetchDataAsync = async () => {
            // Get SQL data from row corresponding to contactId 
            const sqlData = await getFromDatabase(contactId); 

            console.log("Will fill the fields with: ", sqlData)

            // Set all the text fields to current data 
            setName(sqlData[0].name)
            setBirthday(sqlData[0].birthday)
            setAddress(sqlData[0].address)
            setLocation(sqlData[0].location)
            setCelnumber(sqlData[0].celnumber)
            setJob(sqlData[0].job)
            setEmployer(sqlData[0].employer)
            setHobbies(sqlData[0].hobbies)
            setGoals(sqlData[0].goals)
            setWishes(sqlData[0].wishes)
            setRecentEvents(sqlData[0].recentEvents)

            console.log('All Information Fields filled!')
          };
          fetchDataAsync();
        }, []);

  // Return addContactScreen element
  return (
    <View>

      <Text> Enter Personal Information </Text> 
      <View>

      <View style= {Styles.buttonPlacing}>
        <View style = {Styles.textInput}>
        <TextInput  
            onChangeText={name => setName(name)}
            value={name}
            placeholder="Enter Name"/>
        </View>
        <View style = {Styles.textInput}>
        <TextInput 
            onChangeText={birthday => setBirthday(birthday)}
            value={birthday ?? undefined}
            placeholder="Enter Birthday"/>
        </View>
      </View>

      <View style = {Styles.buttonPlacing}>
        <View style = {Styles.textInput}>
        <TextInput
            onChangeText={address => setAddress(address)}
            value={address ?? undefined}
            placeholder="Enter Address"/>
        </View>
        <View style = {Styles.textInput}>
        <TextInput 
            onChangeText={location => setLocation(location)}
            value={location ?? undefined}
            placeholder="Enter Living Location"/>
        </View>
      </View>

      <View style = {Styles.buttonPlacing}>
        <View style = {Styles.textInput}>
        <TextInput
            onChangeText={celnumber => setCelnumber(celnumber)}
            value={celnumber ?? undefined}
            placeholder="Enter Celphone Number"/>
        </View>
        <View style = {Styles.textInput}>
        <TextInput
            onChangeText={job => setJob(job)}
            value={job ?? undefined}
            placeholder="Enter Job"/>
        </View>
      </View>

      <View style = {Styles.buttonPlacing}>
        <View style = {Styles.textInput}>
        <TextInput
            onChangeText={employer => setEmployer(employer)}
            value={employer ?? undefined}
            placeholder="Enter Employer"/>
        </View>
        <View style = {Styles.textInput}>
        <TextInput 
            onChangeText={hobbies => setHobbies(hobbies)}
            value={hobbies ?? undefined}
            placeholder="Enter Hobbies"/>
        </View>
      </View>

      <View style = {Styles.buttonPlacing}>
        <View style = {Styles.textInput}>
        <TextInput  
            onChangeText={goals => setGoals(goals)}
            value={goals ?? undefined}
            placeholder="Enter Goals"/>
        </View>
        <View style = {Styles.textInput}>
        <TextInput
            onChangeText={wishes => setWishes(wishes)}
            value={wishes ?? undefined}
            placeholder="Enter Wishes"/>
        </View>
      </View>

      <TextInput
          onChangeText={recentEvents => setRecentEvents(recentEvents)}
          value={recentEvents ?? undefined}
          placeholder="Enter Recent Events"/>

      </View>

      <Button 
          title = "Save Information"
          onPress={() => changeDatabase(contactId, input)}/>

    </View>
)};

