import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('patient'); // Default to patient
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { login, loginWithGoogle, loginWithFacebook } = useAuth();

  const handleLogin = async () => {
    // Basic input validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login(email, password, role); // Pass the role to the login function
      navigation.navigate('HomeTabs'); // Navigate to the main app flow after successful login
    } catch (err) {
      setError(err.message || 'An error occurred during login.'); // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Improved email validation regex
    return re.test(email);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/your_app_logo.png')} // Replace with your actual logo path
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[typography.h2, { color: colors.text }]}>Welcome Back!</Text>

      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <Text>Select your role:</Text>
        <TouchableOpacity onPress={() => setRole('patient')} style={[styles.roleButton, role === 'patient' && styles.selectedRole]}>
          <Text style={styles.roleText}>Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRole('doctor')} style={[styles.roleButton, role === 'doctor' && styles.selectedRole]}>
          <Text style={styles.roleText}>Doctor</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <Icon name="email" size={24} color={colors.text} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <Icon name="lock" size={24} color={colors.text} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Icon name={isPasswordVisible ? 'visibility-off' : 'visibility'} size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button title="Login" onPress={handleLogin} disabled={isLoading || !email || !password} color={colors.primary} />
      {isLoading && <ActivityIndicator style={styles.loader} color={colors.accent} />}

      <View style={styles.socialLoginContainer}>
        <Text style={styles.orText}>Or login with</Text>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={loginWithGoogle}>
            <Icon name="google" size={20} color={colors.text} style={styles.socialIcon} />
            <Text>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={loginWithFacebook}>
            <Icon name="facebook" size={20} color={colors.text} style={styles.socialIcon} />
            <Text>Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupLink}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  roleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: colors.lightBackground,
  },
  selectedRole: {
    backgroundColor: colors.primary,
  },
  roleText: {
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: colors.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loader: {
    marginTop: 10,
  },
  socialLoginContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  orText: {
    marginVertical: 10,
    color: colors.text,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  socialIcon: {
    marginRight: 5,
  },
  signupLink: {
    textAlign: 'center',
    color: colors.text,
    marginTop: 10,
  },
  forgotPasswordLink: {
    textAlign: 'center',
    color: colors.primary,
    marginTop: 10,
  },
});

export default LoginScreen;
