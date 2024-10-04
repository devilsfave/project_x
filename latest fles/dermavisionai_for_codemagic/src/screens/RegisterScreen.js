import React, { useState } from 'react';
import { 
  View, TextInput, Button, StyleSheet, 
  Text, ActivityIndicator, TouchableOpacity, Alert 
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { colors } from '../styles/colors';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialization, setSpecialization] = useState(''); // New state for specialization
  const [location, setLocation] = useState(''); // New state for location
  const [role, setRole] = useState('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEmailPasswordRegister = async () => {
    // Enhanced input validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (role === 'doctor' && (!fullName || !licenseNumber || !specialization || !location)) {
      setError('Doctors must provide all required details.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) { 
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      // Store user details based on role
      if (role === 'doctor') {
        await firestore().collection('doctors').doc(userCredential.user.uid).set({
          fullName,
          email,
          licenseNumber,
          specialization, // Save specialization
          location, // Save location
          verified: false, // Initially set as not verified
        });
        Alert.alert('Success', 'Doctor registered successfully. Verification is pending.');
      } else {
        // Here you can store patient details if needed
        Alert.alert('Success', 'Patient registered successfully.');
      }

      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration error (Email/Password):', error);
      setError(error.message || 'An error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate email format
  const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register as {role === 'patient' ? 'Patient' : 'Doctor'}</Text>

      {/* Role Selection */}
      <View style={styles.roleToggle}>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'patient' && styles.selectedRole]} 
          onPress={() => setRole('patient')}
        >
          <Text style={styles.roleText}>Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'doctor' && styles.selectedRole]}
          onPress={() => setRole('doctor')}
        >
          <Text style={styles.roleText}>Doctor</Text>
        </TouchableOpacity>
      </View>

      {role === 'doctor' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="License Number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Specialization"
            value={specialization}
            onChangeText={setSpecialization}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button 
        title="Register" 
        onPress={handleEmailPasswordRegister} 
        disabled={isLoading} 
        color={colors.primary} 
      />
      {isLoading && <ActivityIndicator style={styles.loader} color={colors.accent} />}

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkButtonText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: colors.text,
  },
  roleToggle: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    padding: 10,
    backgroundColor: colors.gray,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedRole: {
    backgroundColor: colors.primary,
  },
  roleText: {
    color: colors.white,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: colors.accent,
    marginBottom: 10,
  },
  loader: {
    marginTop: 10,
  },
  linkButton: {
    marginTop: 10,
    padding: 10,
  },
  linkButtonText: {
    color: colors.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
