import { Router, useLocalSearchParams, useRouter } from 'expo-router';
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { DropdownComponent, VerticalBarInputBox } from '@/components';
import { Colors } from '@/constants/Colors';
import { Styles, displayStyle } from "@/constants/Styles";
import { QueryInput, Tag } from '@/constants/Types';
import { addToDatabase, editDatabase, getFromDatabase, getTagsFromDatabase } from '@/services/sql_functions';


//TODO: Move page up when keyboard is active (otherwise bottom input not visible) 

/** Decider function to add new user or edit information based on contactId existence */
async function changeDatabase(router: Router, contactId: string, input: QueryInput) {
  // Do not go back to previous page upon saving unless query is performed successfully
  var success = false;

  // Create new row when not directed to screen with contactId, else edit
  if (contactId === undefined) {
    console.log("Creating addition query")
    success = await addToDatabase(input)
  } else {
    console.log("Creating edit query")
    success = await editDatabase(Number(contactId), input)
  }

  // Go back to page where we came from when database has been changed
  if ( success ) {
    router.back()
  }
}


export default function addContactScreen() {

  // Retrieve passed contactId parameter   
  const { contactId } = useLocalSearchParams<{ contactId: string }>();

  // use router to navigate to other screens
  const router = useRouter()

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
        setName(sqlData.name)
        setBirthday(sqlData.birthday)
        setAddress(sqlData.address)
        setLocation(sqlData.location)
        setCelnumber(sqlData.celnumber)
        setEmail(sqlData.email)
        setJob(sqlData.job)
        setEmployer(sqlData.employer)
        setKnowFrom(sqlData.know_from)
        setKnowFromDate(sqlData.know_from_date)
        setLastMetDate(sqlData.last_met_date)
        setHobbies(sqlData.hobbies)
        setGoals(sqlData.goals)
        setWishes(sqlData.wishes)
        setRecentEvents(sqlData.recent_events)
        setNotes(sqlData.notes)
        setTag({id: sqlData.tag_id, tag_name: ""})
      }
    };
    
    fetchDataAsync();
  }, []);

  // Return addContactScreen element. Wrap Scrollview inside KeyboardAvoidingView
  // to ensure all inputs are visible with keyboard active
  return (
    <KeyboardAvoidingView 
      style={Styles.background}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

     <ScrollView contentContainerStyle={displayStyle.scrollContainer}>
      <View style={displayStyle.card}>

        <DropdownComponent tagData={tagData} currTag={tag} onChange={setTag}/>

        {/* Header with name and job */}
        <View style={displayStyle.headerSection}>
          <TextInput  style = {{...displayStyle.name}}
            onChangeText={name => setName(name)}
            value={name}
            placeholder="Enter Name"
            placeholderTextColor = 'gray' />
          <View style={{...displayStyle.roleBadge, flexDirection: "row", alignItems: "center"}}>
            <TextInput style = {Styles.textInput}
              onChangeText={job => setJob(job)}
              value={job ?? undefined}
              placeholder="Enter Job"
              placeholderTextColor = 'gray'/>
            <Text style={displayStyle.roleText}> @ </Text>
            <TextInput style = {Styles.textInput}
              onChangeText={employer => setEmployer(employer)}
              value={employer ?? undefined}
              placeholder="Enter Employer"
              placeholderTextColor = 'gray'/>
          </View>
        </View>

        <View style={displayStyle.divider} />

        {/* Display birthday and other timestamps labels and values side by side*/}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Birthday</Text>
          <TextInput style = {displayStyle.text} 
            onChangeText={birthday => setBirthday(birthday)}
            value={birthday ?? undefined}
            placeholder="DD-MM-YYYY"
            placeholderTextColor = 'gray'/>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>First Met</Text>
          <TextInput style = {displayStyle.text}
            onChangeText={knowFrom => setKnowFrom(knowFrom)}
            value={knowFrom ?? undefined}
            placeholder="Where Met"
            placeholderTextColor = 'gray'/>
          <TextInput style = {displayStyle.text}
            onChangeText={knowFromDate => setKnowFromDate(knowFromDate)}
            value={knowFromDate ?? undefined}
            placeholder="DD-MM-YYYY"
            placeholderTextColor = 'gray'/>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Last Met</Text>
          <TextInput style = {displayStyle.text}
            onChangeText={lastMetDate => setLastMetDate(lastMetDate)}
            value={lastMetDate ?? undefined}
            placeholder="Enter Last Met Date"
            placeholderTextColor = 'gray'/>
        </View>

        <View style={displayStyle.divider}/>

        {/* Display contact info labels and values side by side*/}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Phone</Text>
          <TextInput style = {displayStyle.text}
              onChangeText={celnumber => setCelnumber(celnumber)}
              value={celnumber ?? undefined}
              placeholder="Enter Celphone Number"
              placeholderTextColor = 'gray'/>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Email</Text>
          <TextInput style = {displayStyle.text}
              onChangeText={email => setEmail(email)}
              value={email ?? undefined}
              placeholder="Enter Email"
              placeholderTextColor = 'gray'/>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Address</Text>
          <TextInput style = {displayStyle.text}
              onChangeText={address => setAddress(address)}
              value={address ?? undefined}
              placeholder="Enter Address"
              placeholderTextColor = 'gray'/>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...displayStyle.label, width: '30%'}}>Location</Text>
          <TextInput style = {displayStyle.text}
              onChangeText={location => setLocation(location)}
              value={location ?? undefined}
              placeholder="Enter Living Location"
              placeholderTextColor = 'gray'/>
        </View>

        <View style={[displayStyle.divider, { marginVertical: 24 }]} />
        {/* Creates boxes with vertical bars for multiline text data */}
        
        <VerticalBarInputBox
          header="Recent Events [DD-MM-YYYY]"
          color = {Colors.magenta}
          rawText={recentEvents}
          onChange={setRecentEvents}/>
          
        <VerticalBarInputBox
          header="Hobbies"
          color = {Colors.blue}
          rawText={hobbies}
          onChange={setHobbies}/>

        <VerticalBarInputBox
          header="Wishes"
          color = {Colors.orange}
          rawText={wishes}
          onChange={setWishes}/>

        <VerticalBarInputBox
          header="Goals"
          color = {Colors.teal}
          rawText={goals}
          onChange={setGoals}/>

        <VerticalBarInputBox
          header="Notes"
          color = {Colors.amber}
          rawText={notes}
          onChange={setNotes}/>
      </View>

      <TouchableOpacity style={Styles.button} 
        onPress={() => changeDatabase(router, contactId, input)}>
        <Text style={Styles.text}> Save Information </Text>
      </TouchableOpacity>

    </ScrollView>

  </KeyboardAvoidingView>
  )
};
