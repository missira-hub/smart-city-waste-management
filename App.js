import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoadingScreen from './src/screens/LoadingScreen';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import ResidentDashboard from './src/screens/ResidentDashboard';
import StaffDashboard from './src/screens/StaffDashboard';
import AdminDashboard from './src/screens/AdminDashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName="LoadingScreen">
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ResidentDashboard" component={ResidentDashboard}/>
        <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
