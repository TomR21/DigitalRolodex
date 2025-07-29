import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { Tag } from '@/constants/Types';
import { Colors } from "../constants/Colors";

// Input property types
interface inputProps {
  tagData: Array<Tag>,   
  onChange: React.Dispatch<React.SetStateAction<Tag>>
}

/** Component which displays all tag names and saves the chosen option. Default is the first option. */
const DropdownComponent = ({ tagData, onChange }: inputProps) => {

  const [value, setValue] = useState<Tag>(tagData[0])

  // Change color to white of currently selected tag
  const renderItem = (tag: Tag) => {
    const isSelected = tag.id === value.id;

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
          value={value}
          onChange={tag => {setValue(tag);onChange(tag);console.log(tag)} }
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
