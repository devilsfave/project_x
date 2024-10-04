// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

import HomeTabs from './HomeTabs'; 
import CameraScreen from '../screens/CameraScreen';
import ResultsScreen from '../screens/ResultsScreen';
import LoginScreen from '../screens/LoginScreen';
import HistoryScreen from '../screens/HistoryScreen';
import EducationScreen from '../screens/EducationScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ConsentScreen from '../screens/ConsentScreen';
import NearbyFacilitiesScreen from '../screens/NearbyFacilitiesScreen'; 
import AdminPanelScreen from '../screens/AdminPanelScreen'; 
import AppointmentBookingScreen from '../screens/AppointmentBookingScreen'; 
import DoctorListScreen from '../screens/DoctorListScreen'; 

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, role } = useAuth(); 

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'HomeTabs' : 'Login'}>
        {user ? (
          <>
            <Stack.Screen 
                name="HomeTabs" 
                component={HomeTabs} 
                options={{ headerShown: false }} 
            />

            {/* Other screens accessible after login */}
            <Stack.Screen name="Results" component={ResultsScreen} />
            <Stack.Screen name="Analysis" component={AnalysisScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="NearbyFacilities" component={NearbyFacilitiesScreen} />

            {/* Conditionally render DoctorListScreen for patients */}
            {role === 'patient' && (
              <Stack.Screen name="DoctorList" component={DoctorListScreen} />
            )}

            <Stack.Screen name="AppointmentBooking" component={AppointmentBookingScreen} /> 
            {role === 'admin' && (
              <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
            )}
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            {/* Allow unauthenticated users to book appointments */}
            <Stack.Screen name="AppointmentBooking" component={AppointmentBookingScreen} />
          </>
        )}
        {/* Show ConsentScreen only if the user has not consented */}
        {!user && <Stack.Screen name="Consent" component={ConsentScreen} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;