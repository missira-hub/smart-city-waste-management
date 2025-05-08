import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure you import your Firebase config here

export default function StaffOverflowReportsScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  // Fetch all overflow reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'overflowReports'));
      const data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setReports(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'Failed to fetch overflow reports.');
      setLoading(false);
    }
  };

  // Mark a report as noted (when staff acknowledges it)
  const markAsNoted = async (reportId) => {
    try {
      const ref = doc(db, 'overflowReports', reportId);
      await updateDoc(ref, { noted: true });
      Alert.alert('Marked as noted!');
      fetchReports(); // Refresh list after marking as noted
    } catch (err) {
      console.error('Error marking report as noted:', err);
      Alert.alert('Error', 'Could not mark report as noted.');
    }
  };

  const renderReport = ({ item }) => (
    <View style={styles.report}>
      <Text style={styles.reportText}>Location: {item.location || 'N/A'}</Text>
      <Text style={styles.reportText}>Message: {item.message || 'No message provided'}</Text>
      <Text style={styles.reportText}>Noted: {item.noted ? '✅ Yes' : '❌ No'}</Text>

      {/* Display button to mark as noted if the report is not yet marked */}
      {!item.noted && (
        <Button
          title="Mark as Noted"
          onPress={() => markAsNoted(item.id)}
        />
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading reports...</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderReport}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  report: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 2,
  },
  reportText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
