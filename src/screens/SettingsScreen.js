import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Ensure this is correctly imported from your firebase config
import { doc, setDoc } from 'firebase/firestore'; // Ensure you're using Firestore's methods correctly

const SettingsScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [maintenanceSchedule, setMaintenanceSchedule] = useState('');
  const [pickupFrequency, setPickupFrequency] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is logged in
  const user = auth.currentUser;

  const changePassword = () => {
    if (user && newPassword.length >= 6) {
      setLoading(true);
      user.updatePassword(newPassword)
        .then(() => {
          setLoading(false);
          Alert.alert('Success', 'Your password has been updated!');
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert('Error', error.message);
        });
    } else {
      Alert.alert('Error', 'Please enter a valid password (at least 6 characters).');
    }
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        Alert.alert('Logged out', 'You have been logged out successfully.');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  const saveSettings = () => {
    if (!user) return;

    const userSettingsRef = doc(db, 'userSettings', user.uid); // Correct Firestore reference

    setDoc(userSettingsRef, {
      maintenanceSchedule,
      pickupFrequency,
    }, { merge: true })
      .then(() => {
        Alert.alert('Settings Saved', 'Your settings have been updated.');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Please log in to access settings.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Settings</Text>

      {/* Change Password Section */}
      <Text style={{ marginBottom: 10 }}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button
        title={loading ? 'Updating...' : 'Change Password'}
        onPress={changePassword}
        disabled={loading}
      />

      {/* Maintenance Schedule Section */}
      <Text style={{ marginVertical: 20 }}>Maintenance Schedule</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Every Monday at 10AM"
        value={maintenanceSchedule}
        onChangeText={setMaintenanceSchedule}
      />

      {/* Minimum Pickup Frequency Section */}
      <Text style={{ marginVertical: 20 }}>Minimum Pickup Frequency</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Every 3 days"
        value={pickupFrequency}
        onChangeText={setPickupFrequency}
      />

      {/* Save Button */}
      <Button title="Save Settings" onPress={saveSettings} />

      {/* Logout */}
      <View style={{ marginTop: 20 }}>
        <Button title="Log Out" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
};

export default SettingsScreen;
