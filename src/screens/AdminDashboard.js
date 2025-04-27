// src/screens/AdminDashboard.js

import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminDashboard() {
  const [tab, setTab] = useState('stats'); // tabs: 'stats', 'users', 'requests'
  const [users, setUsers] = useState([]);
  const [pickupRequests, setPickupRequests] = useState([]);
  const [collectorIdInput, setCollectorIdInput] = useState("");
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchPickupRequests();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(usersList);
  };

  // Fetch all pending pickup requests
  const fetchPickupRequests = async () => {
    const q = query(collection(db, "pickup_requests"), where("status", "==", "Pending"));
    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPickupRequests(requests);
  };

  // Fetch system-wide stats
  const fetchStats = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const pickupsSnapshot = await getDocs(collection(db, "pickup_requests"));

    let collectors = 0, residents = 0;

    usersSnapshot.docs.forEach(doc => {
      const role = doc.data().role;
      if (role === 'collector') collectors++;
      if (role === 'resident') residents++;
    });

    setStats({
      totalUsers: usersSnapshot.size,
      collectors,
      residents,
      totalPickups: pickupsSnapshot.size,
    });
  };

  // Promote user to Collector
  const promoteToCollector = async (userId) => {
    await updateDoc(doc(db, "users", userId), { role: "collector" });
    alert("User promoted to Collector!");
    fetchUsers(); // Refresh
  };

  // Assign collector to pickup request
  const assignCollector = async (pickupId) => {
    await updateDoc(doc(db, "pickup_requests", pickupId), {
      assignedCollectorId: collectorIdInput,
      status: "Assigned",
    });
    alert("Collector assigned!");
    fetchPickupRequests(); // Refresh
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.card}>
      <Text>Name: {item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Role: {item.role}</Text>
      {item.role === 'resident' && (
        <Button title="Promote to Collector" onPress={() => promoteToCollector(item.id)} />
      )}
    </View>
  );

  const renderPickupItem = ({ item }) => (
    <View style={styles.card}>
      <Text>Location: {item.location}</Text>
      <Text>Bin Type: {item.binType}</Text>
      <Text>Request ID: {item.id}</Text>

      <TextInput
        placeholder="Enter Collector ID"
        value={collectorIdInput}
        onChangeText={setCollectorIdInput}
        style={styles.input}
      />

      <Button title="Assign Collector" onPress={() => assignCollector(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setTab('stats')} style={styles.tabButton}><Text>System Stats</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('users')} style={styles.tabButton}><Text>Manage Users</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('requests')} style={styles.tabButton}><Text>Pickup Requests</Text></TouchableOpacity>
      </View>

      {/* Tab Views */}
      {tab === 'stats' && (
        <View style={styles.statsContainer}>
          <Text>Total Users: {stats.totalUsers}</Text>
          <Text>Collectors: {stats.collectors}</Text>
          <Text>Residents: {stats.residents}</Text>
          <Text>Total Pickups: {stats.totalPickups}</Text>
        </View>
      )}

      {tab === 'users' && (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
        />
      )}

      {tab === 'requests' && (
        <FlatList
          data={pickupRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderPickupItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, backgroundColor: "#fff",
  },
  title: {
    fontSize: 26, fontWeight: "bold", marginBottom: 10,
  },
  tabContainer: {
    flexDirection: "row", justifyContent: "space-around", marginBottom: 20,
  },
  tabButton: {
    padding: 10, backgroundColor: "#ddd", borderRadius: 5,
  },
  card: {
    backgroundColor: "#f9f9f9", padding: 15, marginBottom: 10, borderRadius: 8,
  },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 10, marginBottom: 10, borderRadius: 5,
  },
  statsContainer: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
});
