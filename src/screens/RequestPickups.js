// src/screens/RequestPickup.js

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { db, auth } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function RequestPickup() {
  const [location, setLocation] = useState("");
  const [binType, setBinType] = useState("");

  const handleRequest = async () => {
    try {
      const requestRef = collection(db, "pickup_requests");
      await addDoc(requestRef, {
        residentId: auth.currentUser.uid,
        location,
        binType,
        status: "Pending",
        createdAt: serverTimestamp(),
        assignedCollectorId: null, // Admin will assign later
      });
      alert("Pickup request submitted!");
      setLocation("");
      setBinType("");
    } catch (error) {
      console.error("Error submitting request: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Bin Pickup</Text>

      <TextInput
        placeholder="Enter your location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <TextInput
        placeholder="Bin Type (General, Recyclable, Organic)"
        value={binType}
        onChangeText={setBinType}
        style={styles.input}
      />

      <Button title="Submit Pickup Request" onPress={handleRequest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, justifyContent: "center",
  },
  title: {
    fontSize: 24, fontWeight: "bold", marginBottom: 20,
  },
  input: {
    borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5,
  },
});
