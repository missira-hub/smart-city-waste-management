// OverflowReportsScreen.js (Resident)
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from 'react-native';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function OverflowReportsScreen() {
  const [binId, setBinId] = useState('');
  const [message, setMessage] = useState('');
  const [reports, setReports] = useState([]);

  const submitReport = async () => {
    if (!binId || !message) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'overflowReports'), {
        binId,
        message,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        noted: false,
      });
      setBinId('');
      setMessage('');
      Alert.alert('Success', 'Report submitted!');
    } catch (err) {
      console.error('Submit error:', err);
      Alert.alert('Error', 'Failed to submit report.');
    }
  };

  const fetchMyReports = async () => {
    try {
      const q = query(
        collection(db, 'overflowReports'),
        where('userId', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    } catch (err) {
      console.error('Fetch error:', err);
      Alert.alert('Error', 'Failed to load your reports.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Bin ID" value={binId} onChangeText={setBinId} style={styles.input} />
      <TextInput placeholder="Message" value={message} onChangeText={setMessage} style={styles.input} />
      <Button title="Submit Overflow Report" onPress={submitReport} />
      <Button title="Load My Reports" onPress={fetchMyReports} />

      <FlatList
        data={reports}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.report}>
            <Text>Bin: {item.binId}</Text>
            <Text>Message: {item.message}</Text>
            <Text>Status: {item.noted ? 'Seen by Staff ✅' : 'Pending ⏳'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 },
  report: { marginTop: 10, padding: 10, backgroundColor: '#eee' },
});
