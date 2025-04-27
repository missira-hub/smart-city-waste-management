// src/firebaseConfig.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
export default app;