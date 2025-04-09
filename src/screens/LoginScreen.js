import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Your Firebase config file

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        // ✅ Navigate to Resident Dashboard (you can change this route)
        navigation.navigate("ResidentDashboard");
      } else {
        Alert.alert(
          "⚠️ Verify Email",
          "Please verify your email before logging in.",
          [{ text: "OK", style: "destructive" }]
        );
      }
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert(
        "❌ Login Failed",
        error.message,
        [{ text: "OK", style: "destructive" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2", // light grey background
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#b22222", // red
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#e0e0e0", // light grey input
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#d3d3d3", // lighter grey button
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#b22222", // red text
    fontWeight: "bold",
    fontSize: 16,
  },
});
