import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth, db } from '../firebaseConfig'; // ✅ Correct import
import { doc, getDoc } from 'firebase/firestore';

export default function StaffHomeScreen() {
  const [schedule, setSchedule] = useState('');
  const [frequency, setFrequency] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'userSettings', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSchedule(data.maintenanceSchedule || '');
          setFrequency(data.pickupFrequency || '');
        }
      } catch (err) {
        console.error('Failed to fetch user settings:', err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Staff Member!</Text>
      <Text style={styles.info}>Maintenance Schedule: {schedule || 'Loading...'}</Text>
      <Text style={styles.info}>Pickup Frequency: {frequency || 'Loading...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00BFFF',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});
