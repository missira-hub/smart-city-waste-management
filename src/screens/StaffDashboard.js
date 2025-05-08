import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../CustomDrawerContent';

import StaffHomeScreen from './StaffHomeScreen';
import StaffOverflowReportsScreen from './StaffOverflowReportsScreen';
import PickupRoutesScreen from './PickupRoutesScreen';
import LiveTrackingScreen from './LiveTrackingScreen';
import SettingsScreen from './SettingsScreen';

const Drawer = createDrawerNavigator();

export default function StaffDashboard() {
  return (
    <Drawer.Navigator
      initialRouteName="Staff Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#00BFFF' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#00BFFF',
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen name="Staff Home" component={StaffHomeScreen} />
      <Drawer.Screen name="Overflow Reports" component={StaffOverflowReportsScreen} />
      <Drawer.Screen name="Pickup Routes" component={PickupRoutesScreen} />
      <Drawer.Screen name="Live Tracking" component={LiveTrackingScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
