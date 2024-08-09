import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";

// Fetch Bookmarked Posts
export const fetchBookmarkedPosts = async (currentUserId: string) => {
  if (!currentUserId) return [];

  const q = query(
    collection(db, "blogs"),
    where("bookmarks", "array-contains", currentUserId)
  );

  try {
    const querySnapshot = await getDocs(q);
    const bookmarkedPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return bookmarkedPosts;
  } catch (error) {
    console.error("Error fetching bookmarked posts:", error);
    return [];
  }
};
