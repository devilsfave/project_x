import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getApprovedDoctors } from '../services/FirestoreService';
import { colors } from '../styles/colors';
import { responsive } from '../styles/responsive';

const DoctorListScreen = ({ navigation }) => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsData = await getApprovedDoctors();
        setDoctors(doctorsData);
      } catch (err) {
        setError('Error fetching doctors. Please try again later.');
        console.error('Error fetching doctors:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorItem}
      onPress={() => navigation.navigate('BookAppointment', { doctor: item })} 
    >
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{item.name}</Text>
        <Text style={styles.doctorSpecialization}>Specialization: {item.specialization}</Text>
        <Text style={styles.doctorLocation}>Location: {item.location}</Text>
        {/* You can add more doctor details here (e.g., rating, experience) */}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Dermatologists</Text>
      <FlatList
        data={doctors}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} 
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsive(20),
    backgroundColor: colors.background,
  },
  title: {
    fontSize: responsive(24),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: responsive(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  doctorItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  doctorInfo: {
    // You can add styles for the doctorInfo container here if needed
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  doctorLocation: {
    fontSize: 14,
    color: 'gray',
  },
});

export default DoctorListScreen;
