import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { Tag } from '@/constants/Types';
import { Colors } from "../constants/Colors";

// Input property types, needs currently selected value to be present in parent component
interface inputProps {
  tagData: Array<Tag>,   
  currTag: Tag,
  onChange: React.Dispatch<React.SetStateAction<Tag>>
}

/** Component which displays all tag names and saves the chosen option. Default is the first option. */
const DropdownComponent = ({ tagData, currTag, onChange }: inputProps) => {

  // Change color to white of currently selected tag
  const renderItem = (tag: Tag) => {
    const isSelected = tag.id === currTag.id;

    return (
    <View style={styles.container}>
      <Text style={[styles.itemText, isSelected && styles.selectedTextStyle]}> {tag.tag_name} </Text>
    </View>
  )}

  return (
    <View style={styles.container}>
      <Dropdown
          style={styles.dropdown}
          containerStyle={styles.container}
          placeholderStyle={styles.itemText}
          selectedTextStyle={styles.selectedTextStyle}
          data={tagData}
          maxHeight={300}
          labelField="tag_name"
          valueField="id"
          placeholder={'Select relation'}
          value={currTag}
          onChange={tag => {onChange(tag);console.log(tag)} }
          renderItem={renderItem}
      />
    </View>
  );
};


export default DropdownComponent;


const styles = StyleSheet.create({
container: {
    backgroundColor: Colors.black,
    padding: 8,
},
itemText: {
    color: 'gray',
    fontSize: 16,
},
selectedTextStyle: {
    color: Colors.white,
    fontSize: 16,
},
dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
},
});
