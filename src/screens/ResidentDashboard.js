import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ResidentDashboard = () => {
  const [bins, setBins] = useState([]);
  const [location, setLocation] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'bins'), (snapshot) => {
      const binData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBins(binData);
    });

    const unsubDrivers = onSnapshot(collection(db, 'drivers'), (snapshot) => {
      const driverData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDrivers(driverData);
    });

    return () => {
      unsubscribe();
      unsubDrivers();
    };
  }, []);

  const getColor = (status) => {
    switch (status) {
      case 'empty': return 'green';
      case 'half-full': return 'yellow';
      case 'full': return 'red';
      default: return 'grey';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Resident Dashboard</Text>

      <Text style={styles.sectionTitle}>Dustbin Status</Text>
      <FlatList
        data={bins}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.binBox, { backgroundColor: getColor(item.status) }]}>
            <Text style={styles.binText}>Bin at {item.location}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Enter Your Location or Bin Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location..."
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.sectionTitle}>Driver Tracking</Text>
      <FlatList
        data={drivers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={styles.driverText}>{item.name} is at {item.currentLocation}</Text>
        )}
      />

      <Text style={styles.sectionTitle}>Payment Method</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. MTN Mobile Money, Card..."
        value={paymentMethod}
        onChangeText={setPaymentMethod}
      />

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.buttonText}>Submit Info</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  header: { fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#8B0000'
  },
  sectionTitle: { fontSize: 18, 
    marginTop: 15, 
    fontWeight: 'bold' },
  binBox: { padding: 15, 
    borderRadius: 8, 
    marginTop: 10 },
  binText: { fontWeight: 'bold', 
    color: '#fff' },
  input: { height: 45, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    marginTop: 10, 
    paddingHorizontal: 10 },
  driverText: { fontSize: 16, marginTop: 5 },
  submitButton: { backgroundColor: '#8B0000', padding: 15, borderRadius: 10, marginTop: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});

export default ResidentDashboard;
