// src/navigation/HomeTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import EducationScreen from '../screens/EducationScreen';
import CustomTabButton from '../components/CustomTabButton'; // Import the custom button

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Camera"
        component={CustomTabButton}
        options={{ tabBarButton: () => <CustomTabButton /> }} // Use custom button
      />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Education" component={EducationScreen} />
    </Tab.Navigator>
  );
}

export default HomeTabs;
