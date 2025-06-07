import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  centering: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPlacing: {
    flexDirection: "row"
  },
  textInput: {
    flex: 1,
    height: 40
  },
  button: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 5,
  },
  flatListItem: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  }, 
  flatListTitle: {
    fontSize: 32,
  }
});