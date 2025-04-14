import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



const user = auth.currentUser;
if (user) {
  console.log("User is logged in: ", user);
} else {
  console.log("No user is logged in.");
}


  const handleLogin = async () => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential?.user;

      if (!user.emailVerified) {
        Alert.alert("🔒 Verify Email", "Please verify your email before logging in.");
        await auth.signOut();
        return;
      }

      // Fetch user data from Firestore
      const userDoc = await firestore.collection('users').doc(user.uid).get();

      if (!userDoc.exists) {
        Alert.alert("🚫 Error", "User data not found.");
        return;
      }

      const userData = userDoc.data();
      const userRole = userData.role;

      if (userRole === 'admin') {
        navigation.navigate('AdminDashboard');
      } else if (userRole === 'staff') {
        if (!userData.isApproved) {
          Alert.alert("⛔ Access Denied", "Your account is pending admin approval.");
          await auth.signOut();
          return;
        }
        navigation.navigate('StaffDashboard');
      } else {
        navigation.navigate('ResidentDashboard');
      }
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart City Waste Login</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Light grey background
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    color: '#cc0000', // Red
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#cc0000', // Red
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
