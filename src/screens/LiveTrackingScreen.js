import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LiveTrackingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Tracker</Text>
      <Text>Tracking collection trucks and bin locations...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00BFFF',
  },
});
