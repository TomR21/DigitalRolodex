import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  centering: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  flatListItem: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  }, 
  flatListTitle: {
    fontSize: 32,
    fontFamily: 'Serif',
    color: 'black',
    fontWeight: 'bold'
  },
  background: {
    backgroundColor: '#fff',
  }
});