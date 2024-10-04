import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FadeIn } from '../components/FadeIn';
import { colors } from '../styles/colors';
import { responsive } from '../styles/responsive';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  return (
    <FadeIn>
      <View style={styles.container}>
        <Text style={styles.title}>DermaVision-AI</Text>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => navigation.navigate('Camera')}
          accessibilityLabel="Scan Now Button"
        >
          <Icon name="camera-alt" size={24} color="white" style={styles.buttonIcon} /> 
          <Text style={styles.buttonText}>Scan Now</Text>
        </TouchableOpacity>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('Analysis')}
            accessibilityLabel="Analyze Skin Condition Button"
          >
            <Icon name="search" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.optionText}>Analyze</Text> 
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('History')}
            accessibilityLabel="View Past Analyses Button"
          >
            <Icon name="history" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.optionText}>History</Text> 
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('Education')}
            accessibilityLabel="Educational Resources Button"
          >
            <Icon name="school" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.optionText}>Education</Text> 
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('Profile')}
            accessibilityLabel="Profile Button"
          >
            <Icon name="person" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.optionText}>Profile</Text>
          </TouchableOpacity>

          {/* Add navigation to DoctorListScreen for patients */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => navigation.navigate('DoctorList')} 
            accessibilityLabel="Find Dermatologist Button"
          >
            <Icon name="search" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.optionText}>Find Dermatologist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </FadeIn>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsive(20), 
  },
  title: {
    fontSize: responsive(32), 
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: responsive(40),
  },
  mainButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: responsive(50), 
    paddingVertical: responsive(15),
    borderRadius: responsive(30),
    marginBottom: responsive(30),
    flexDirection: 'row',
    alignItems: 'center', 
  },
  buttonText: {
    color: 'white',
    fontSize: responsive(20), 
    fontWeight: 'bold',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: colors.secondary,
    padding: responsive(15),
    borderRadius: responsive(10),
    marginBottom: responsive(15),
    alignItems: 'center',
    flexDirection: 'row', 
  },
  optionText: {
    color: 'white',
    fontSize: responsive(16),
  },
  buttonIcon: {
    marginRight: 10, 
  },
});

export { HomeScreen };