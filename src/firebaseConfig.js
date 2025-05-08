// firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// Only import AsyncStorage on mobile
let ReactNativeAsyncStorage;
if (Platform.OS !== 'web') {
  ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage').default;
}


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCMr4zCQg2konNz7hhZeJuRPA128fPAJRQ",
  authDomain: "sc-waste-management-app.firebaseapp.com",
  databaseURL: "https://sc-waste-management-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sc-waste-management-app",
  storageBucket: "sc-waste-management-app.firebasestorage.app",
  messagingSenderId: "716830739762",
  appId: "1:716830739762:web:0c965ea893a49a80235b2b",
  measurementId: "G-LMB1G56KBY"
};
// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Initialize Auth with persistence per platform
let auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch((err) =>
    console.error('Failed to set web persistence:', err)
  );
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// 🔥 Initialize Firestore (works for both platforms)
const db = getFirestore(app);

// 👇 Export everything
export { auth, db, app };