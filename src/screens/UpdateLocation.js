import React, { useEffect, useState } from 'react';
import { View, Button, Text, PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { db, auth } from '../../firebaseConfig'; // adjust path if needed
import { doc, updateDoc } from 'firebase/firestore';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const UpdateLocation = () => {
  const [location, setLocation] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return result === RESULTS.GRANTED;
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot access location');
      return;
    }

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          const user = auth.currentUser;
          if (user) {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
              location: {
                lat: latitude,
                lng: longitude,
              },
            });
            Alert.alert('Success', 'Location updated successfully!');
          } else {
            Alert.alert('Error', 'No user logged in');
          }
        } catch (error) {
          console.error('Error updating location:', error);
          Alert.alert('Error', 'Failed to update location');
        }
      },
      (error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to get location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Update My Location" onPress={getLocation} />
      {location && (
        <Text>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      )}
    </View>
  );
};

export default UpdateLocation;
