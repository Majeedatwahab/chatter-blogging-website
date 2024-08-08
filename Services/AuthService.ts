import { auth, realtimeDb } from "@/app/firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { signOut } from "firebase/auth";
import { set, ref as dbRef } from "firebase/database";

const provider = new GoogleAuthProvider();

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Store user data in Realtime Database
    await set(dbRef(realtimeDb, "users/" + user.uid), {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      createdAt: new Date().toISOString(),
      profilePictureURL: user.photoURL,
    });

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);

    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPassword");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export { logout };
