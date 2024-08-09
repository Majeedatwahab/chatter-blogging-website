import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const fetchSearchResults = async (searchQuery: string) => {
  if (!searchQuery) {
    return [];
  }

  try {
    const normalizedQuery = searchQuery.toLowerCase();
    const blogsCollection = collection(db, "blogs");

    const querySnapshot = await getDocs(blogsCollection);

    const results = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          snippet: data.snippet,
        };
      })
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
