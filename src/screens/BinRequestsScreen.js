import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function BinRequestsScreen() {
  const [MapView, setMapView] = useState(null);
  const [Marker, setMarker] = useState(null);
  const [location, setLocation] = useState(null);

  const [binType, setBinType] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [region, setRegion] = useState(null);

  const [previewData, setPreviewData] = useState(null); // State for preview

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const Maps = await import('react-native-maps');
        setMapView(() => Maps.default);
        setMarker(() => Maps.Marker);

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required.');
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        setLocation(loc.coords);
        setRegion(coords);
      }
    })();
  }, []);

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    setRegion((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));
  };

  const submitRequest = async () => {
    if (!location || !binType || !address || !paymentMethod) {
      Alert.alert('Incomplete', 'Please fill all fields and tap map to select location.');
      return;
    }

    const data = {
      location,
      binType,
      address,
      paymentMethod,
      level: 0,
      status: 'Pending',
      requestTime: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'pickupRequests'), data);
      Alert.alert('Success', 'Pickup request submitted!');
      setBinType('');
      setAddress('');
      setPaymentMethod('');
      setPreviewData(data); // Set the preview data after successful submission
    } catch (err) {
      console.error('Error saving request:', err);
      Alert.alert('Error', 'Failed to submit request.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Request Bin Pickup</Text>

      {MapView && Marker && region ? (
        <MapView style={styles.map} region={region} onPress={handleMapPress}>
          {location && <Marker coordinate={location} title="Pickup Location" />}
        </MapView>
      ) : (
        <Text>Map loading or not supported on web.</Text>
      )}

      <TextInput
        placeholder="Enter bin type (General, Organic, Recyclable)"
        value={binType}
        onChangeText={setBinType}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter your address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter payment method (e.g., Bank Card, Cash)"
        value={paymentMethod}
        onChangeText={setPaymentMethod}
        style={styles.input}
      />

      <Button title="Submit Request" onPress={submitRequest} />

      {previewData && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewHeader}>Request Preview:</Text>
          <Text>Location: {previewData.location ? `Lat: ${previewData.location.latitude}, Long: ${previewData.location.longitude}` : 'Not provided'}</Text>
          <Text>Bin Type: {previewData.binType}</Text>
          <Text>Address: {previewData.address}</Text>
          <Text>Payment Method: {previewData.paymentMethod}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  previewContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  previewHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
