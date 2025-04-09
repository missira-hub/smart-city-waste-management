// screens/AdminDashboard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.text}>Welcome, Admin! You can manage user roles here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#d32f2f' },
  text: { fontSize: 16, color: '#333', textAlign: 'center' },
});
