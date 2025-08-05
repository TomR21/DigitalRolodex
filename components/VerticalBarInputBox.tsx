import React from 'react';
import { Text, TextInput, View } from "react-native";

import { displayStyle, Styles } from "@/constants/Styles";


// Allowed input types for the component
type InputTypes = {
  header: string, 
  rawText: string | null, 
  color: string,
  onChange: React.Dispatch<React.SetStateAction<string | null>>
};

// Component which formats the raw Text and displays it in a box with vertical color bar
const  VerticalBarInputBox = ({header, rawText, color, onChange}: InputTypes) => (
    <View style={displayStyle.notesContainer}>
      <View style={{...displayStyle.verticalBarNotes, backgroundColor: color}} />
        <View style={displayStyle.notesContent}>
        <Text style={displayStyle.label}>{header}</Text>

        <TextInput style = {Styles.textInput}
          onChangeText={rawText => onChange(rawText)}
          value={rawText ?? undefined}
          multiline
          placeholder={"Enter " + header}
          placeholderTextColor = 'gray'/>
      </View>
    </View>
) 

export default VerticalBarInputBox