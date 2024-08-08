import { ref, update } from "firebase/database";
import { realtimeDb } from "@/app/firebaseConfig";

export const updateUserData = async (userId: string, newData: any) => {
  try {
    const userRef = ref(realtimeDb, `users/${userId}`);
    await update(userRef, newData);
    console.log("User data updated");
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};
