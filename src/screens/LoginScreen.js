// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert('Email not verified', 'Please verify your email before logging in.');
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDocRef);
      
      if (!userSnapshot.exists()) {
        throw new Error('User document not found in Firestore.');
      }

      const userData = userSnapshot.data();
      const role = userData.role;

      if (role === 'resident') {
        navigation.replace('ResidentDashboard');
      } else if (role === 'staff') {
        navigation.replace('StaffDashboard');
      } else if (role === 'admin') {
        navigation.replace('AdminDashboard');
      } else {
        Alert.alert('Unknown Role', 'Your user role is not recognized.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <Text style={styles.linkText} onPress={() => navigation.navigate('SignupScreen')}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, 
  backgroundColor: '#f2f2f2', 
  justifyContent: 'center', 
  padding: 20 
},
  header: { 
  fontSize: 32, 
  fontWeight: 'bold', 
  color: 'red', 
  marginBottom: 30, 
  textAlign: 'center' 
},
  input: { height: 50, 
  borderColor: 'red',
  borderWidth: 1, 
  borderRadius: 10, 
  paddingHorizontal: 15, 
  marginBottom: 15, 
  backgroundColor: '#fff', 
  color: '#000' 
},
  button: { 
  backgroundColor: 'red', 
  paddingVertical: 15, 
  borderRadius: 10, 
  marginTop: 10, 
  alignItems: 'center' 
},
  buttonText: { 
  color: '#fff', 
  fontWeight: '600', 
  fontSize: 16 
},
  linkText: { 
  color: 'red', 
  textAlign: 'center', 
  marginTop: 20 
},
});
