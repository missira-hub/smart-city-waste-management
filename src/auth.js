// auth.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const signUp = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user in Firestore with 'resident' role by default
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "resident", // Default role
    });

    return user;
  } catch (error) {
    console.error("Sign-up error:", error);
    throw error;
  }
};

export { signUp };
