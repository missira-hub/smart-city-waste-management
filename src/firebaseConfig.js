// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {initializeAuth,getReactNativePersistence,} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';



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
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Set persistent auth state
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
const db = getFirestore(app);

export { app, auth, db };