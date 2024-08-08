"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../app/firebaseConfig"; // Ensure this path is correct
import { onAuthStateChanged } from "firebase/auth";
import BlogItem from "./BlogItem";
import Pagination from "./Pagination";

interface BlogPost {
  id: string;
  title: string;
  imageURL: string;
  content: string;
  snippet: string;
  category: string;
  author: string;
  date: number;
  documentId: number;
  likes: string[];
  isLiked: boolean;
  comments: { userId: string; text: string }[];
  commentsCount: number;
  likesCount: number;
  bookmarks: string[];
  isBookmarked: boolean;
  bookmarksCount: number;
}

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [menu, setMenu] = useState<string>("All");
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
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const postsArray: BlogPost[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as BlogPost;
          return {
            ...data,
            id: doc.id,
            likes: data.likes || [],
            comments: data.comments || [],
            bookmarks: data.bookmarks || [],
            isLiked: currentUserId
              ? (data.likes || []).includes(currentUserId)
              : false,
            isBookmarked: currentUserId
              ? (data.bookmarks || []).includes(currentUserId)
              : false,
            commentsCount: (data.comments || []).length,
            likesCount: (data.likes || []).length,
            bookmarksCount: (data.bookmarks || []).length,
          };
        });
        setPosts(postsArray);
      } catch (error) {
        setError("Failed to fetch posts");
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId !== null) {
      fetchPosts();
    }
  }, [currentUserId]);

  const handleLike = async (id: string) => {
    if (!currentUserId) return;

    const postRef = doc(db, "blogs", id);
    const post = posts.find((post) => post.id === id);

    if (post) {
      const isLiked = post.likes.includes(currentUserId);

      try {
        if (isLiked) {
          await updateDoc(postRef, {
            likes: arrayRemove(currentUserId),
          });
        } else {
          await updateDoc(postRef, {
            likes: arrayUnion(currentUserId),
          });
        }

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  likes: isLiked
                    ? post.likes.filter((like) => like !== currentUserId)
                    : [...post.likes, currentUserId],
                  isLiked: !isLiked,
                }
              : post
          )
        );
      } catch (error) {
        console.error("Error updating likes:", error);
      }
    }
  };

  const handleComment = async (id: string, commentText: string) => {
    if (!currentUserId || !commentText.trim()) return;

    const postRef = doc(db, "blogs", id);
    const newComment = { userId: currentUserId, text: commentText };

    try {
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id
            ? {
                ...post,
                comments: [...post.comments, newComment],
                commentsCount: post.commentsCount + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleBookmark = async (id: string) => {
    if (!currentUserId) return;
    const postRef = doc(db, "blogs", id);
    const post = posts.find((post) => post.id === id);
    if (post) {
      const isBookmarked = post.bookmarks.includes(currentUserId);
      try {
        if (isBookmarked) {
          await updateDoc(postRef, {
            bookmarks: arrayRemove(currentUserId),
            bookmarksCount: post.bookmarksCount - 1,
          });
        } else {
          await updateDoc(postRef, {
            bookmarks: arrayUnion(currentUserId),
            bookmarksCount: post.bookmarksCount + 1,
          });
        }
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === id
              ? {
                  ...post,
                  bookmarks: isBookmarked
                    ? post.bookmarks.filter(
                        (bookmark) => bookmark !== currentUserId
                      )
                    : [...post.bookmarks, currentUserId],
                  isBookmarked: !isBookmarked,
                }
              : post
          )
        );
      } catch (error) {
        console.error("Error updating bookmarks:", error);
      }
    }
  };

  const filteredPosts =
    menu === "All" ? posts : posts.filter((post) => post.category === menu);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 mt-8 text-center">
        Blog Posts
      </h1>
      <div className="flex justify-center gap-4 flex-wrap my-10">
        {[
          "All",
          "Uncategorized",
          "Technology",
          "Food",
          "Nature",
          "Sports",
          "Health and wellness",
          "Education",
          "Others",
        ].map((category) => (
          <button
            key={category}
            className={`text-sm py-2 px-4 rounded-lg transition duartion-300 ${
              menu === category
                ? "bg-emerald-700 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-emerald-700 hover:text-white"
            }`}
            onClick={() => {
              setMenu(category);
              setCurrentPage(1);
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredPosts.length > 0 ? (
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
                onBookmark={handleBookmark}
                likesCount={blog.likesCount}
                onLike={handleLike}
                isLiked={blog.isLiked}
                isBookmarked={blog.isBookmarked}
                bookmarksCount={blog.bookmarksCount}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">
            No posts are available for this selected category.
          </p>
        )}
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={filteredPosts.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </>
  );
};

export default BlogList;
