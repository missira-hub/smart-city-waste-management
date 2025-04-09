import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// import { collection, onSnapshot } from 'firebase/firestore'
// import { db } from '../firebaseConfig';
// import { auth } from '../firebaseConfig';

const firebaseConfig = {
  apiKey: "AIzaSyBSkkrUhG6cGrd1QvWgjLw_XNefLjN4mzM",
  authDomain: "my-management-app-6f3f8.firebaseapp.com",
  projectId: "my-management-app-6f3f8",
  storageBucket: "my-management-app-6f3f8.firebasestorage.app",
  messagingSenderId: "1060963915780",
  appId: "1:1060963915780:web:8bf42d9b1446da616dfd51",
  measurementId: "G-LY88G0V2M0"
};

const db = getFirestore(app);
export { auth, db };
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };