import { useLocalSearchParams, useRouter } from 'expo-router';
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import DropdownComponent from '@/components/Dropdown';
import { Styles } from "@/constants/Styles";
import { QueryInput, Tag } from '@/constants/Types';
import { addToDatabase, editDatabase, getFromDatabase, getTagsFromDatabase } from '@/services/sql_functions';


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

  // Variables states to keep track of TextInput field values
  const [name, setName]                 = React.useState<string>('');
  const [birthday, setBirthday]         = React.useState<string|null>(null);
  const [address, setAddress]           = React.useState<string|null>(null);
  const [location, setLocation]         = React.useState<string|null>(null);
  const [celnumber, setCelnumber]       = React.useState<string|null>(null);
  const [email, setEmail]               = React.useState<string|null>(null);
  const [job, setJob]                   = React.useState<string|null>(null);
  const [employer, setEmployer]         = React.useState<string|null>(null);
  const [knowFrom, setKnowFrom]         = React.useState<string|null>(null);
  const [knowFromDate, setKnowFromDate] = React.useState<string|null>(null);
  const [lastMetDate, setLastMetDate]   = React.useState<string|null>(null);
  const [hobbies, setHobbies]           = React.useState<string|null>(null);
  const [goals, setGoals]               = React.useState<string|null>(null);
  const [wishes, setWishes]             = React.useState<string|null>(null);
  const [recentEvents, setRecentEvents] = React.useState<string|null>(null);
  const [notes, setNotes]               = React.useState<string|null>(null);

  const [tagData, setTagData]           = React.useState<Array<Tag>>([{id:0, tag_name: "empty"}])
  const [tag, setTag]                   = React.useState<Tag>(tagData[0]);
  
  // Object which stores all the current fields in the TextInput fields
  const input: QueryInput = {
    name: name,
    tag_id: tag.id,
    birthday: birthday,
    address: address,
    location: location,
    celnumber: celnumber,
    email: email,
    job: job,
    employer: employer,
    knowFrom: knowFrom,
    knowFromDate: knowFromDate,
    lastMetDate: lastMetDate,
    hobbies: hobbies,
    goals: goals,
    wishes: wishes,
    recentEvents: recentEvents,
    notes: notes
  }

  // Load all information upon visiting the screen
  React.useEffect(() => {
    const fetchDataAsync = async () => {
      // Fetch current tags and save them for dropdown
      const tagData = await getTagsFromDatabase()
      console.log(tagData)
      setTagData(tagData)

      // Get SQLite data from row corresponding to contactId if passed through
      if ( contactId !== undefined) { 
        const sqlData = await getFromDatabase(contactId)
        
        console.log("Will fill the fields with: ", sqlData)

        // Set all the text fields to current data 
        setName(sqlData[0].name)
        setBirthday(sqlData[0].birthday)
        setAddress(sqlData[0].address)
        setLocation(sqlData[0].location)
        setCelnumber(sqlData[0].celnumber)
        setEmail(sqlData[0].email)
        setJob(sqlData[0].job)
        setEmployer(sqlData[0].employer)
        setKnowFrom(sqlData[0].know_from)
        setKnowFromDate(sqlData[0].know_from_date)
        setLastMetDate(sqlData[0].last_met_date)
        setHobbies(sqlData[0].hobbies)
        setGoals(sqlData[0].goals)
        setWishes(sqlData[0].wishes)
        setRecentEvents(sqlData[0].recent_events)
        setNotes(sqlData[0].notes)
        setTag({id: sqlData[0].tag_id, tag_name: ""})
      }
    };
    
    fetchDataAsync();
  }, []);

  // Return addContactScreen element
  return (
    <View style={Styles.background}>

      <Text style={Styles.text}> Enter Personal Information </Text> 
      <View>

      <View style= {Styles.textInputPlacing}>
        <View style = {Styles.textInputBox}>
        <TextInput  style = {Styles.textInput}
            onChangeText={name => setName(name)}
            value={name}
            placeholder="Enter Name"
            placeholderTextColor = 'gray' />
        </View>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput} 
            onChangeText={birthday => setBirthday(birthday)}
            value={birthday ?? undefined}
            placeholder="Enter Birthday"
            placeholderTextColor = 'gray'/>
        </View>
      </View>

      <View style = {Styles.textInputPlacing}>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput}
            onChangeText={address => setAddress(address)}
            value={address ?? undefined}
            placeholder="Enter Address"
            placeholderTextColor = 'gray'/>
        </View>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput}
            onChangeText={location => setLocation(location)}
            value={location ?? undefined}
            placeholder="Enter Living Location"
            placeholderTextColor = 'gray'/>
        </View>
      </View>

      <View style = {Styles.textInputPlacing}>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput}
            onChangeText={celnumber => setCelnumber(celnumber)}
            value={celnumber ?? undefined}
            placeholder="Enter Celphone Number"
            placeholderTextColor = 'gray'/>
        </View>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput}
            onChangeText={email => setEmail(email)}
            value={email ?? undefined}
            placeholder="Enter Email"
            placeholderTextColor = 'gray'/>
        </View>
      </View>

      <View style = {Styles.textInputPlacing}>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput}
            onChangeText={job => setJob(job)}
            value={job ?? undefined}
            placeholder="Enter Job"
            placeholderTextColor = 'gray'/>
        </View>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput}
            onChangeText={employer => setEmployer(employer)}
            value={employer ?? undefined}
            placeholder="Enter Employer"
            placeholderTextColor = 'gray'/>
        </View>
      </View>

      <View style = {Styles.textInputPlacing}>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput}
            onChangeText={knowFrom => setKnowFrom(knowFrom)}
            value={knowFrom ?? undefined}
            placeholder="Eerste ontmoeting"
            placeholderTextColor = 'gray'/>
        </View>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput}
            onChangeText={knowFromDate => setKnowFromDate(knowFromDate)}
            value={knowFromDate ?? undefined}
            placeholder="Datum Eerste Ontmoeting"
            placeholderTextColor = 'gray'/>
        </View>
      </View>

      <View style = {Styles.textInputPlacing}>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput}
            onChangeText={notes => setNotes(notes)}
            value={notes ?? undefined}
            placeholder="Enter Notes"
            placeholderTextColor = 'gray'/>
        </View>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput}
            onChangeText={hobbies => setHobbies(hobbies)}
            value={hobbies ?? undefined}
            placeholder="Enter Hobbies"
            placeholderTextColor = 'gray'/>
        </View>
      </View>

      <View style = {Styles.textInputPlacing}>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput} 
            onChangeText={goals => setGoals(goals)}
            value={goals ?? undefined}
            placeholder="Enter Goals"
            placeholderTextColor = 'gray'/>
        </View>
        <View style = {Styles.textInputBox}>
        <TextInput style = {Styles.textInput}
            onChangeText={wishes => setWishes(wishes)}
            value={wishes ?? undefined}
            placeholder="Enter Wishes"
            placeholderTextColor = 'gray'/>
        </View>
      </View>

      <TextInput style = {Styles.textInput}
          onChangeText={recentEvents => setRecentEvents(recentEvents)}
          value={recentEvents ?? undefined}
          placeholder="Enter Recent Events"
          placeholderTextColor = 'gray'/>

      <TextInput style = {Styles.textInput}
          onChangeText={lastMetDate => setLastMetDate(lastMetDate)}
          value={lastMetDate ?? undefined}
          placeholder="Enter Last Met Date"
          placeholderTextColor = 'gray'/>

      </View>

      <DropdownComponent tagData={tagData} currTag={tag} onChange={setTag}/> 

      <TouchableOpacity style={Styles.button} 
        onPress={() => changeDatabase(contactId, input)}>
        <Text style={Styles.text}> Save Information </Text>
      </TouchableOpacity>

    </View>
  )
};
