import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, ActivityIndicator, Platform, Alert } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext'; 
import { enableIndexedDbPersistence, getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore'; 
import { initializeApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA31h_KyFq8MbwzJt5NKZWZMTkFcqrI6nQ",
  authDomain: "dermaviosion-ai.firebaseapp.com",
  projectId: "dermaviosion-ai",
  storageBucket: "dermaviosion-ai.appspot.com",
  messagingSenderId: "537710907865",
  appId: "1:537710907865:android:a3fb336ef1826ecdd789c8",
  measurementId: "G-XXXXXXX"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err: any) => { 
    if (err.code === 'failed-precondition') {
      console.error('Firestore persistence failed: Multiple tabs open.');
    } else if (err.code === 'unimplemented') {
      console.error('Firestore persistence is not supported in this environment.');
    }
  });

// Add listeners for offline/online events
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    if (state.isConnected) {
      enableNetwork(db).catch((error: Error) => {
        console.error('Error enabling network:', error);
      });
    } else {
      disableNetwork(db).catch((error: Error) => {
        console.error('Error disabling network:', error);
      });
    }
  });

  return () => unsubscribe(); 
}, []);

// Handle notifications when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [isConsented, setIsConsented] = useState<boolean | null>(null);
  const isDarkMode = useColorScheme() === 'dark';
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const checkUserConsent = async () => {
      const consent = await AsyncStorage.getItem('userConsent');
      setIsConsented(consent === 'granted');
    };

    checkUserConsent();
  }, []);

  useEffect(() => {
    // Request permissions (iOS only)
    const requestPermissions = async () => {
      const settings = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: false,
          allowSound: false,
        },
      });

      if (settings.granted) {
        console.log('Notification permissions granted.');
      } else {
        console.log('Notification permissions denied.');
      }
    }

    if (Platform.OS === 'ios') {
      requestPermissions();
    }
  }, []);

  // Get the FCM token and set up listeners
  useEffect(() => {
    // Get the FCM token
    messaging()
      .getToken()
      .then((token: string | null) => { 
        if (token) { 
          console.log('FCM Token:', token);
          // TODO: Send this token to your backend server to store it for future use
        }
      });

    // Listen for incoming messages in the foreground
    notificationListener.current = messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => { 
      console.log('Received a message in the foreground!', remoteMessage);
      // You can display a local notification here if needed

      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title || 'New Notification',
          body: remoteMessage.notification?.body || 'You have a new notification!',
          // You can add more options here, such as sound or data
        },
        trigger: null, // Trigger immediately
      });
    });

    // Listen for notifications when the app is in the background or quit
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      // Handle the notification response here (e.g., navigate to a specific screen)
    });

    return () => {
      // Unsubscribe from the listeners when the component unmounts
      if (notificationListener.current) {
        notificationListener.current();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // Return loading indicator while checking consent
  if (isConsented === null) {
    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ActivityIndicator size="large" color="#0000ff" /> 
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <AuthProvider> 
        <AppNavigator /> 
      </AuthProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;