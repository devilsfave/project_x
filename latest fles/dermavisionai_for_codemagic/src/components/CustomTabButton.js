import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Or your preferred icon library
import { colors } from '../styles/colors';

const CustomTabButton = ({ onPress, accessibilityState }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={1} // Make the entire button area tappable
    style={[
      styles.container,
      { backgroundColor: accessibilityState.selected ? colors.accent : colors.primary } // Change color on selection
    ]}
    accessibilityRole="button"
    accessibilityLabel="Camera Button" // Add accessibility label
  >
    <View style={styles.button}>
      <Icon name="camera-alt" color={colors.white} size={26} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    top: -22.5, // Adjust to position the button above the tab bar
    justifyContent: 'center',
    alignItems: 'center',
    ...styles.shadow, // Apply shadow styles
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default CustomTabButton;