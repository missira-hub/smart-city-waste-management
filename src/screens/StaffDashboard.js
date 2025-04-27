// src/screens/StaffDashboard.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function StaffDashboard() {
  const [assignedBins, setAssignedBins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedBins();
  }, []);

  const fetchAssignedBins = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const binsRef = collection(db, 'bins');
        const q = query(binsRef, where('assignedStaff', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const bins = [];
        querySnapshot.forEach((docSnap) => {
          bins.push({ id: docSnap.id, ...docSnap.data() });
        });

        setAssignedBins(bins);
      }
    } catch (error) {
      console.error('Error fetching bins:', error);
      Alert.alert('Error', 'Failed to load assigned bins.');
    } finally {
      setLoading(false);
    }
  };

  const updateCollectionStatus = async (binId, newStatus) => {
    try {
      const binRef = doc(db, 'bins', binId);
      await updateDoc(binRef, { collectionStatus: newStatus });

      Alert.alert('Success', `Collection status updated to "${newStatus}".`);
      fetchAssignedBins(); // Refresh after update
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update collection status.');
    }
  };

  const reportBinCondition = async (binId, condition) => {
    try {
      const binRef = doc(db, 'bins', binId);
      await updateDoc(binRef, { reportedCondition: condition });

      Alert.alert('Success', `Reported bin condition: "${condition}".`);
      fetchAssignedBins(); // Refresh after report
    } catch (error) {
      console.error('Error reporting condition:', error);
      Alert.alert('Error', 'Failed to report bin condition.');
    }
  };

  const renderBinItem = ({ item }) => {
    if (!item) return null;

    return (
      <View style={styles.binCard}>
        <Text style={styles.binText}>Bin ID: {item.id}</Text>
        <Text style={styles.binText}>
          Location: {item.location ? `${item.location.latitude}, ${item.location.longitude}` : 'Unknown'}
        </Text>
        <Text style={styles.binText}>Collection Status: {item.collectionStatus ?? 'Pending'}</Text>
        <Text style={styles.binText}>Reported Condition: {item.reportedCondition ?? 'None'}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateCollectionStatus(item.id, 'Collected')}
          >
            <Text style={styles.buttonText}>Mark as Collected</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => updateCollectionStatus(item.id, 'Not Collected')}
          >
            <Text style={styles.buttonText}>Mark Not Collected</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => reportBinCondition(item.id, 'Overflowing')}
          >
            <Text style={styles.buttonText}>Report Overflowing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => reportBinCondition(item.id, 'Damaged')}
          >
            <Text style={styles.buttonText}>Report Damaged</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Staff Dashboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <FlatList
          data={assignedBins.filter(bin => bin !== undefined && bin !== null)}
          keyExtractor={(item) => item.id}
          renderItem={renderBinItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No assigned bins found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  binCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'red',
  },
  binText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  reportButton: {
    backgroundColor: '#ff7f50',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: 'grey',
    marginTop: 30,
    fontSize: 18,
  },
});
