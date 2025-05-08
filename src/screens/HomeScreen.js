import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Button } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import moment from 'moment';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [region, setRegion] = useState({
    latitude: 35.3400, // Default Girne
    longitude: 33.3196,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [bins, setBins] = useState([]);
  const [nextCollection, setNextCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const binSnapshot = await getDocs(collection(db, 'bins'));
      const binList = binSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBins(binList);

      const scheduleDoc = await getDoc(doc(db, 'collectionSchedule', 'next'));
      if (scheduleDoc.exists()) {
        setNextCollection(scheduleDoc.data().nextCollection.toDate());
      } else {
        setNextCollection(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getBinColor = (level) => {
    if (level < 30) return 'green';
    if (level < 70) return 'yellow';
    return 'red';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Bin Status Overview</Text>

      <View style={styles.binSection}>
        <View style={[styles.iconColumn, { flexDirection: 'row' }]}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="trash" size={80} color="green" />
            <Text style={styles.binText}>Empty</Text>
          </View>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="trash" size={80} color="yellow" />
            <Text style={styles.binText}>Half-full</Text>
          </View>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="trash" size={80} color="red" />
            <Text style={styles.binText}>Full</Text>
          </View>
        </View>
      </View>

      <Text style={styles.header}>Nearby Bins Map</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00BFFF" />
      ) : (
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {bins.map((bin) => (
            <Marker
              key={bin.id}
              coordinate={{ latitude: bin.latitude, longitude: bin.longitude }}
            >
              <FontAwesome5 name="trash" size={30} color={getBinColor(bin.level)} />
              <Callout>
                <View>
                  <Text>Type: {bin.type}</Text>
                  <Text>Level: {bin.level}%</Text>
                  <Text>Status: {bin.status}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      <View style={styles.refreshContainer}>
        <Button title="🔄 Refresh" onPress={fetchData} color="#1E90FF" />
      </View>

      <Text style={styles.header}>Next Collection Timer</Text>
      <View style={styles.timer}>
        <Text>
          {nextCollection
            ? `⏰ ${moment(nextCollection).fromNow()} (${moment(nextCollection).format('HH:mm, MMM D')})`
            : 'No scheduled collection'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  binSection: {
    marginBottom: 20,
  },
  iconColumn: {
    flexDirection: 'row', // Ensures icons are in a row
    justifyContent: 'space-around', // Evenly spaces the icons
  },
  iconContainer: {
    alignItems: 'center', // Centers the icon and text
    marginBottom: 20,
  },
  binText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    color: '#444',
  },
  map: {
    width: width - 40,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  refreshContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  timer: {
    padding: 20,
    backgroundColor: '#00BFFF',
    borderRadius: 8,
    alignItems: 'center',
  },
});
