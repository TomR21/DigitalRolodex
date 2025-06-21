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
  eventView: {
    backgroundColor: "steelblue",
    borderWidth: 1,
    padding: 10,
    borderRadius: 15
  },
  text: {
    fontSize: 20,
    fontFamily: 'Serif',
    fontWeight: 'bold',
    color: 'white',
  },
  textEvents: {
    fontSize: 14,
    fontFamily: 'Serif',
    fontWeight: 'normal',
    color: 'white'
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


const BAR_COLOR = '#2980b9';
const NOTES_BAR_COLOR = '#d35400';

export const displayStyle = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
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
    color: '#eee',
    letterSpacing: 0.5,
  },
  roleBadge: {
    marginTop: 6,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: BAR_COLOR,
  },
  roleText: {
    color: '#ecf0f1',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 22,
  },
  notesContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
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
    backgroundColor: NOTES_BAR_COLOR,
    borderRadius: 3,
    marginRight: 16,
  },
  notesContent: {
    flex: 1,
  },
});