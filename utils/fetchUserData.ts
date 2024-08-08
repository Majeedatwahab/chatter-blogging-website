import { getDatabase, ref as dbRef, get } from "firebase/database";
import { realtimeDb } from "@/app/firebaseConfig";

// password reset mail

const fetchUserData = async (userId: string) => {
  try {
    const userRef = dbRef(realtimeDb, "users/" + userId);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No user data found!");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export default fetchUserData;
