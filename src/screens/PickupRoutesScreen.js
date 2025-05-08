import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PickupRoutesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Pickup Routes</Text>
      <Text style={styles.route}>🛣️ Route A: City Center → North End</Text>
      <Text style={styles.route}>🛣️ Route B: Market Street → Bay Area</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#00BFFF',
  },
  route: {
    fontSize: 18,
    marginBottom: 10,
  },
});
