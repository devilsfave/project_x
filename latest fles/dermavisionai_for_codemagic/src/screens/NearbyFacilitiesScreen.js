import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getCurrentLocation, findNearbyFacilities } from '../services/GeolocationService';
import { colors } from '../styles/colors';
import { responsive } from '../styles/responsive';
import * as Location from 'expo-location'; // Import Expo Location

const NearbyFacilitiesScreen = () => {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNearbyFacilities = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync(); // Request location permission
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const nearbyFacilities = await findNearbyFacilities(latitude, longitude);
        setFacilities(nearbyFacilities);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching nearby facilities.');
        console.error('Error fetching facilities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyFacilities();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.facilityItem}>
      <Text style={styles.facilityName}>{item.name}</Text>
      <Text style={styles.facilityAddress}>{item.address}</Text>
      <Text style={styles.facilityDistance}>Distance: {item.distance}</Text>
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
      <Text style={styles.title}>Nearby Health Facilities</Text>
      <FlatList
        data={facilities}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
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
  facilityItem: {
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
  facilityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  facilityAddress: {
    fontSize: 14,
    color: 'gray',
  },
  facilityDistance: {
    fontSize: 14,
    marginTop: 5
  }
});

export default NearbyFacilitiesScreen;