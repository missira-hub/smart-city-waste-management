import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function BinsScreen({ navigation }) {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBins = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        console.log("No user logged in");
        return;
      }

      const binsRef = collection(db, 'bins');

      let binsQuery;
      
      // Check if staff or resident
      const userDoc = await getDocs(collection(db, 'users'));
      const userData = userDoc.docs.find(doc => doc.id === user.uid)?.data();

      if (!userData) {
        console.log("User data not found");
        return;
      }

      if (userData.role === 'staff') {
        // Staff: show only bins assigned to them
        binsQuery = query(binsRef, where('assignedCollectorId', '==', user.uid));
      } else {
        // Resident or Admin: show all bins
        binsQuery = query(binsRef);
      }

      const querySnapshot = await getDocs(binsQuery);
      const binsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBins(binsList);
    } catch (error) {
      console.error('Error fetching bins: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBins();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.binCard}>
            <Text style={styles.title}>Type: {item.type}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Location: {item.location.latitude}, {item.location.longitude}</Text>
            <Text>Last Collected: {new Date(item.lastCollectedAt.seconds * 1000).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 20 },
  binCard: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, borderColor: 'red', borderWidth: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: 'red', marginBottom: 5 },
});
