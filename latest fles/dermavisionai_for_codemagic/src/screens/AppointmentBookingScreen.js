import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import RNCalendarEvents from 'react-native-calendar-events';
import * as Notifications from 'expo-notifications';
import { colors } from '../styles/colors';
import { responsive } from '../styles/responsive';

const AppointmentBookingScreen = ({ navigation, route }) => {
  const { user, expoPushToken } = useAuth();
  const { doctor } = route.params; // Fetch doctor details from route params
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const q = query(collection(db, 'appointments'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedAppointments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(fetchedAppointments);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchAppointments();
  }, []);

  const handleBookAppointment = async () => {
    if (!date || !time) {
      Alert.alert('Error', 'Please select both date and time.');
      return;
    }

    try {
      const appointmentData = {
        doctorId: doctor.id,
        patientId: user.uid,
        date: date.toISOString().split('T')[0],
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date(),
      };

      // Save appointment to Firestore
      const docRef = await addDoc(collection(db, 'appointments'), appointmentData);

      // Add appointment to device calendar
      await RNCalendarEvents.saveEvent('Appointment', {
        startDate: new Date(date.setHours(time.getHours(), time.getMinutes())).toISOString(),
        endDate: new Date(date.setHours(time.getHours() + 1)).toISOString(),
        description: `Appointment with Dr. ${doctor.name}`,
      });

      // Send push notification if expoPushToken is available
      if (expoPushToken) {
        sendPushNotification(expoPushToken, 'Appointment Booked', `Your appointment with Dr. ${doctor.name} is scheduled on ${date.toLocaleDateString()} at ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`);
      }

      Alert.alert('Success', `Appointment booked with Dr. ${doctor.name} on ${date.toLocaleDateString()} at ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment.');
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      Alert.alert('Success', 'Appointment canceled successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel appointment.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  // Define the sendPushNotification function
  const sendPushNotification = async (expoPushToken, title, body) => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data: { data: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Appointment with Dr. {doctor.name}</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Select Date"
          value={date.toLocaleDateString()}
          editable={false}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          onChange={handleDateChange}
        />
      )}
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Select Time"
          value={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          editable={false}
        />
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          onChange={handleTimeChange}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleBookAppointment}>
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>

      {/* Render existing appointments */}
      <Text style={styles.subtitle}>Your Appointments:</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.appointmentContainer}>
            <Text>{`${new Date(item.date).toLocaleDateString()} at ${item.time} with Dr. ${item.doctorId}`}</Text>
            <TouchableOpacity onPress={() => handleCancelAppointment(item.id)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  appointmentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cancelButton: {
    color: 'red',
    marginTop: 5,
  },
});

export default AppointmentBookingScreen;