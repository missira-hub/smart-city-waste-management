import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, FlatList, Alert } from 'react-native';

// Mock Data for Assigned Routes and Bin Conditions
const collectionRoutes = [
  {
    routeId: 1,
    routeName: "Route A",
    staffName: "John Doe",
    bins: [
      { binId: "Bin 1", status: "Empty", condition: "Good" },
      { binId: "Bin 2", status: "Half-Full", condition: "Good" },
      { binId: "Bin 3", status: "Full", condition: "Needs Cleaning" },
    ],
  },
  {
    routeId: 2,
    routeName: "Route B",
    staffName: "Jane Smith",
    bins: [
      { binId: "Bin 4", status: "Empty", condition: "Good" },
      { binId: "Bin 5", status: "Full", condition: "Needs Repair" },
    ],
  },
];

const StaffDashboard = () => {
  const [binCondition, setBinCondition] = useState("");
  const [selectedBin, setSelectedBin] = useState("");

  // Handle Status Update
  const handleUpdateStatus = (binId) => {
    Alert.alert("Status Update", `Collection status for ${binId} updated!`);
  };

  // Handle Report Bin Condition
  const handleReportCondition = () => {
    if (binCondition.trim() === "") {
      Alert.alert("Error", "Please provide a condition description.");
    } else {
      Alert.alert("Report Submitted", `Condition for ${selectedBin} reported: ${binCondition}`);
      setBinCondition(""); // Reset input after submission
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Staff Dashboard</Text>
      
      {/* Assigned Collection Routes */}
      <FlatList
        data={collectionRoutes}
        keyExtractor={(item) => item.routeId.toString()}
        renderItem={({ item }) => (
          <View style={styles.routeContainer}>
            <Text style={styles.routeTitle}>{item.routeName} (Assigned to {item.staffName})</Text>
            <FlatList
              data={item.bins}
              keyExtractor={(bin) => bin.binId}
              renderItem={({ bin }) => (
                <View style={styles.binContainer}>
                  <Text style={styles.binInfo}>
                    {bin.binId}: {bin.status} - {bin.condition}
                  </Text>
                  <Button title="Mark as Collected" onPress={() => handleUpdateStatus(bin.binId)} />
                </View>
              )}
            />
          </View>
        )}
      />
      
      {/* Form to Report Bin Condition */}
      <View style={styles.reportForm}>
        <Text style={styles.formTitle}>Report Bin Condition</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Bin Condition"
          value={binCondition}
          onChangeText={setBinCondition}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Bin ID"
          value={selectedBin}
          onChangeText={setSelectedBin}
        />
        <Button title="Submit Report" onPress={handleReportCondition} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  routeContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  binContainer: {
    marginTop: 10,
  },
  binInfo: {
    fontSize: 16,
  },
  reportForm: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default StaffDashboard;
