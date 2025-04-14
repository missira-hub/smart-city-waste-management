import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Initialize Firebase App
const firebaseConfig = {
  apiKey: "AIzaSyCMr4zCQg2konNz7hhZeJuRPA128fPAJRQ",
  authDomain: "sc-waste-management-app.firebaseapp.com",
  databaseURL: "https://sc-waste-management-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sc-waste-management-app",
  storageBucket: "sc-waste-management-app.firebasestorage.app",
  messagingSenderId: "716830739762",
  appId: "1:716830739762:web:05956922010da019235b2b",
  measurementId: "G-Q7KGVFB6DZ"
};
const app = initializeApp(firebaseConfig);

// 👇 Auth with persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

// Initialize Firebase Authentication and Firestore

export { auth, db };
export default app;
