// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);