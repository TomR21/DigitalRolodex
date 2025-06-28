import { Text, View } from "react-native"

import { displayStyle } from "@/constants/Styles"

/** Converts string with delimiter to multiline string for Text display */
function makeMultilineText(notes: string|null, delimiter: string, emoji: string) {
    if (notes === null) {
      return null
    } else {
      // Store each separate note on a new line
      var message: string = ""
      
      for (const str of notes.split(delimiter)) {
        message += emoji + "  " + str + "\n"
      }
      
      // return trimmed message, cuts off last newline
      return message.trim()
    }
}

// Allowed input types for the component
type InputTypes = {header: string, rawText: string | null, emoji: string, color: string};

// Component which formats the raw Text and displays it in a box with vertical color bar
const  VerticalBarBox = ({header, rawText, emoji, color}: InputTypes) => (
    <View style={displayStyle.notesContainer}>
      <View style={{...displayStyle.verticalBarNotes, backgroundColor: color}} />
        <View style={displayStyle.notesContent}>
        <Text style={displayStyle.label}>{header}</Text>
        <Text style={displayStyle.text}>{makeMultilineText(rawText, ".", emoji)}</Text>
      </View>
    </View>
) 

export default VerticalBarBox