import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { firestore } from '../firebaseConfig';

const AdminDashboard = () => {
  const [pendingCollectors, setPendingCollectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingCollectors = async () => {
      try {
        const snapshot = await firestore
          .collection('users')
          .where('role', '==', 'staff')
          .where('isApproved', '==', false)
          .get();

        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingCollectors(users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collectors:', error);
      }
    };

    fetchPendingCollectors();
  }, []);

  const approveCollector = async (userId) => {
    await firestore.collection('users').doc(userId).update({ isApproved: true });
    setPendingCollectors(pendingCollectors.filter(user => user.id !== userId));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Pending Collector Approvals</Text>

      {loading ? <ActivityIndicator size="large" color="green" /> : (
        <FlatList
          data={pendingCollectors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>{item.email}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => approveCollector(item.id)}
              >
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f3f3f3' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 10 },
  text: { fontSize: 16 },
  button: { marginTop: 8, backgroundColor: 'green', padding: 10, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

export default AdminDashboard;
