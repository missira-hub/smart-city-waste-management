import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import LoadingScreen from "./src/screens/LoadingScreen";
import SignupScreen from "./src/screens/SignupScreen";
import LoginScreen from "./src/screens/LoginScreen";
import AdminDashboard from "./src/screens/AdminDashboard";
import StaffDashboard from "./src/screens/StaffDashboard";
import ResidentDashboard from "./src/screens/ResidentDashboard";


// Auth Context
import { AuthProvider } from "./src/context/AuthContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: true}}>
          <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
          <Stack.Screen name="ResidentDashboard" component={ResidentDashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
