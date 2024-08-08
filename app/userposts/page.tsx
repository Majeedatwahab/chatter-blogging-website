"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebaseConfig"; 
import BlogItem from "@/Components/BlogItem";
import Pagination from "@/Components/Pagination";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";

interface BlogPost {
  id: string;
  title: string;
  imageURL: string;
  content: string;
  snippet: string;
  category: string;
  author: string;
  authorId: string;
  date: number;
}

const UserPosts = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const postsPerPage = 6;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!currentUserId) return;
      try {
        const q = query(
          collection(db, "blogs"),
          where("authorId", "==", currentUserId)
        );
        const querySnapshot = await getDocs(q);
        const postsArray: BlogPost[] = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as BlogPost),
          id: doc.id,
        }));
        setPosts(postsArray);
      } catch (error) {
        setError("Failed to fetch user posts");
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [currentUserId]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          My Posts
        </h1>
        {posts.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {currentPosts.map((blog) => (
              <BlogItem
                key={blog.id}
                id={blog.id}
                title={blog.title}
                imageURL={blog.imageURL}
                content={blog.content}
                snippet={blog.snippet}
                category={blog.category}
                author={blog.author}
                date={blog.date}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onLike={function (id: string): void {
                  throw new Error("Function not implemented.");
                }}
                onBookmark={function (id: string): void {
                  throw new Error("Function not implemented.");
                }}
                isLiked={false}
                isBookmarked={false}
                likesCount={0}
                bookmarksCount={0}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">
            No posts are available for this user.
          </p>
        )}
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={posts.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </>
  );
};

export default UserPosts;
