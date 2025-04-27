import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { functions } from "firebase/app";
import { httpsCallable } from "firebase/functions";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          // Check role using Firestore or Cloud Function (if needed)
          const checkRole = httpsCallable(functions, 'checkIfAdmin'); // Cloud Function Example
          const result = await checkRole();
          if (result.data.isAdmin) {
            setRole("Admin");
          } else {
            setRole("User");
          }
        } catch (error) {
          console.error("Error checking role:", error);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    // Optionally, redirect to the login page
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
