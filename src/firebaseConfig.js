// src/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCMr4zCQg2konNz7hhZeJuRPA128fPAJRQ",
  authDomain: "sc-waste-management-app.firebaseapp.com",
  databaseURL: "https://sc-waste-management-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sc-waste-management-app",
  storageBucket: "sc-waste-management-app.appspot.com",
  messagingSenderId: "716830739762",
  appId: "1:716830739762:web:0c965ea893a49a80235b2b",
  measurementId: "G-LMB1G56KBY"
};

const app = initializeApp(firebaseConfig);

// ✅ Important: Only call getAuth *after* initializeAuth
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app); // fallback for hot reload
}

const db = getFirestore(app);

export { app, auth, db };
