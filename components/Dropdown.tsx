import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

import { Colors } from "../constants/Colors";

interface Data {
  label: string, 
  value: Number
}

const data = [
{ label: 'Unspecified', value: 0 },
{ label: 'Vriend', value: 1 },
{ label: 'Collega', value: 2 }
];

//
const DropdownComponent = () => {
  const [value, setValue] = useState<null|Number>(null);

  const renderItem = (item: Data) => {
    const isSelected = item.value === value;

    return (
    <View style={styles.container}>
      <Text style={[styles.itemText, isSelected && styles.selectedTextStyle]}> {item.label} </Text>
    </View>
  )}

  return (
    <View style={styles.container}>
      <Dropdown
          style={styles.dropdown}
          containerStyle={styles.container}
          placeholderStyle={styles.itemText}
          selectedTextStyle={styles.selectedTextStyle}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={'Select relation'}
          value={value}
          onChange={item => {setValue(item.value)} }
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
