import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ConsentScreen({ navigation }) {
  const [hasConsented, setHasConsented] = useState(null); // Track user consent state

  const grantConsent = async () => {
    await AsyncStorage.setItem('userConsent', 'granted');
    navigation.replace('Home');
  };

  const declineConsent = () => {
    setHasConsented(false); // Show decline message
  };

  if (hasConsented === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Consent Declined</Text>
        <Text style={styles.text}>
          You have declined the consent agreement. Please note that some features of the app may not be available without consent.
        </Text>
        <TouchableOpacity style={styles.linkButton} onPress={() => setHasConsented(null)}>
          <Text style={styles.linkButtonText}>Back to Consent Agreement</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consent Agreement</Text>
      <Text style={styles.text}>
        By using this app, you agree to:
        {"\n"}1. Local storage and processing of your images
        {"\n"}2. Data transmission to our secure servers
        {"\n"}3. Use of Google AI Gemini for advanced analysis
        {"\n"}4. Anonymous data collection for app improvement
      </Text>
      
      <Button title="I Agree" onPress={grantConsent} />
      <TouchableOpacity style={styles.declineButton} onPress={declineConsent}>
        <Text style={styles.declineButtonText}>I Decline</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('TermsOfService')}>
        <Text style={styles.linkButtonText}>Terms of Service</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('PrivacyPolicy')}>
        <Text style={styles.linkButtonText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  declineButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  declineButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 10,
  },
  linkButtonText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default ConsentScreen;
