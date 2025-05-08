import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../CustomDrawerContent';

import HomeScreen from './HomeScreen';
import RequestPickupScreen from './BinRequestsScreen';
import ReportOverflowScreen from './OverflowReportsScreen';
import CollectionHistoryScreen from './CollectionHistoryScreen';
import SettingsScreen from './SettingsScreen';

const Drawer = createDrawerNavigator();

export default function ResidentDashboard() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#00BFFF' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#00BFFF',
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Request Pickup" component={RequestPickupScreen} />
      <Drawer.Screen name="Report Overflow" component={ReportOverflowScreen} />
      <Drawer.Screen name="Collection History" component={CollectionHistoryScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
