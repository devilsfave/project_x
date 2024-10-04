import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { responsive } from '../styles/responsive';

const Layout = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: responsive(20), // Adjust padding as needed
    paddingTop: responsive(20), // Add top padding if necessary
  },
});

export default Layout;