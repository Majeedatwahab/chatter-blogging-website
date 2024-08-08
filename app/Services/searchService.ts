import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const fetchSearchResults = async (searchQuery: string) => {
  try {
    const normalizedQuery = searchQuery.toLowerCase();
    const blogsCollection = collection(db, "blogs");

    const q = query(blogsCollection);
    const querySnapshot = await getDocs(q);

    const results = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        snippet: doc.data().snippet,
      }))
      .filter(
        (doc) =>
          doc.title.toLowerCase().includes(normalizedQuery) ||
          doc.snippet.toLowerCase().includes(normalizedQuery)
      );

    return results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};
