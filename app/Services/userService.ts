import { getAuth, onAuthStateChanged } from "firebase/auth";

interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export const getUser = async (): Promise<User | null> => {
  const auth = getAuth();

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // Clean up the listener
        if (user) {
          resolve({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
          });
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
};
