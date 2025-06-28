import { Dimensions, StyleSheet } from "react-native";

import { Colors } from "./Colors";

const screenWidth = Dimensions.get('window').width;

export const Styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.black,
    flex: 1
  },
  button: {
    backgroundColor: Colors.blue,
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
    color: Colors.white,           
    fontSize: 26,
    fontFamily: 'Serif',
    fontWeight: 'bold'
  },
  clickableContactTouchable: {
    width: screenWidth,
    backgroundColor: Colors.black,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    justifyContent: 'center',
  },
  eventView: {
    backgroundColor: Colors.blue,
    borderWidth: 1,
    padding: 10,
    borderRadius: 15
  },
  text: {
    fontSize: 20,
    fontFamily: 'Serif',
    fontWeight: 'bold',
    color: Colors.white,
  },
  textEvents: {
    fontSize: 14,
    fontFamily: 'Serif',
    fontWeight: 'normal',
    color: Colors.white
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'Serif',
    color: Colors.white
  },
  textInputBox: {
    flex: 0.5,
    height: 40
  },
  textInputPlacing: {
    flexDirection: "row"
  }
});


export const displayStyle = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.black,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  roleBadge: {
    marginTop: 6,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: Colors.blue,
  },
  roleText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightgray,
    marginVertical: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.smoke,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    fontSize: 16,
    color: Colors.white,
    lineHeight: 22,
  },
  notesContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightgray,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4
  },
  verticalBarNotes: {
    width: 6,
    height: '100%',
    borderRadius: 3,
    marginRight: 16,
  },
  notesContent: {
    flex: 1,
  },
});