import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get('window').width;

export const Styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'blue',
    borderWidth: 1,
    height: 50,
    padding: 10,
    borderRadius: 15
  },
  buttonBox: {
    flex: 0.3
  },
  centering: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  clickableContactText: {
    color: '#eee',                // Light text color for contrast
    fontSize: 26,
    fontFamily: 'Serif',
    fontWeight: 'bold'
  },
  clickableContactTouchable: {
    width: screenWidth,
    backgroundColor: '#121212',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Serif',
    fontWeight: 'bold',
    color: 'white',
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'Serif',
    color: 'white'
  },
  textInputBox: {
    flex: 0.5,
    height: 40
  },
  textInputPlacing: {
    flexDirection: "row"
  }
});