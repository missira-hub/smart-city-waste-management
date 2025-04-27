import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import * as Location from 'expo-location';
import { db } from '../firebaseConfig'; // your firebase config

export default function ResidentDashboard() {
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
  const [locationExists, setLocationExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collectionSchedule, setCollectionSchedule] = useState([]);

  useEffect(() => {
    fetchUserLocation();
    fetchCollectionSchedule();
  }, []);

  const fetchUserLocation = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const locationData = userSnap.data().location;
          if (locationData) {
            setUserLocation(locationData);
            setLocationExists(true);
          } else {
            setLocationExists(false);
          }
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        Alert.alert('Failed to fetch location');
      }
    }
    setLoading(false);
  };

  const updateLocationInFirestore = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          location: { latitude, longitude },
        });

        setUserLocation({ latitude, longitude });
        setLocationExists(true);

        Alert.alert('Location updated successfully!');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      Alert.alert('Failed to update location');
    }
  };

  const requestBinPickup = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        await addDoc(collection(db, 'pickupRequests'), {
          userId: user.uid,
          location: userLocation,
          status: 'pending',
          timestamp: new Date(),
        });

        Alert.alert('Pickup Requested', 'Your bin pickup has been requested.');
      }
    } catch (error) {
      console.error('Error requesting pickup:', error);
      Alert.alert('Failed to request pickup');
    }
  };

  const reportOverflowingBin = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        await addDoc(collection(db, 'overflowReports'), {
          userId: user.uid,
          location: userLocation,
          status: 'reported',
          timestamp: new Date(),
        });

        Alert.alert('Overflow Reported', 'An overflowing bin has been reported.');
      }
    } catch (error) {
      console.error('Error reporting overflow:', error);
      Alert.alert('Failed to report overflowing bin');
    }
  };

  const fetchCollectionSchedule = async () => {
    try {
      const scheduleSnapshot = await getDocs(collection(db, 'collectionSchedules'));
      const scheduleList = scheduleSnapshot.docs.map(doc => doc.data());
      setCollectionSchedule(scheduleList);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      Alert.alert('Failed to fetch collection schedule');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : locationExists ? (
        <View style={styles.section}>
          <Text style={styles.title}>Your Location</Text>
          <Text>Latitude: {userLocation.latitude}</Text>
          <Text>Longitude: {userLocation.longitude}</Text>
          <TouchableOpacity style={styles.button} onPress={updateLocationInFirestore}>
            <Text style={styles.buttonText}>Update My Location</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.title}>Your location is not set yet.</Text>
          <TouchableOpacity style={styles.button} onPress={updateLocationInFirestore}>
            <Text style={styles.buttonText}>Set My Location</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.title}>Bin Services</Text>
        <TouchableOpacity style={styles.button} onPress={requestBinPickup}>
          <Text style={styles.buttonText}>Request Bin Pickup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={reportOverflowingBin}>
          <Text style={styles.buttonText}>Report Overflowing Bin</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Collection Schedule</Text>
        {collectionSchedule.length > 0 ? (
          collectionSchedule.map((schedule, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text>📅 {schedule.day}: {schedule.time}</Text>
            </View>
          ))
        ) : (
          <Text>No collection schedule available yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scheduleItem: {
    paddingVertical: 5,
  },
});
