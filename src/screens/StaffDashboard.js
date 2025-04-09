import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Ensure this path is correct


const StaffDashboard = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get the currently logged-in user's email
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("LoginScreen"); // Redirect to login screen after logout
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Staff Dashboard</Text>
      <Text style={styles.emailText}>Logged in as: {userEmail}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D3D3D3", // Light Grey background
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B0000", // Dark Red
    marginBottom: 20,
  },
  emailText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#8B0000", // Dark Red
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StaffDashboard;
