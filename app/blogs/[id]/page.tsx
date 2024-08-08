"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db, auth } from "@/app/firebaseConfig";
import Header from "@/Components/Header";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";
import MarkdownRenderer from "@/Components/MarkdownRenderer";

const parseDate = (date: any) => {
  if (date && date.seconds) {
    return new Date(date.seconds * 1000);
  } else if (typeof date === "string") {
    return new Date(date);
  } else {
    return new Date();
  }
};

interface BlogData {
  id: string;
  title: string;
  content: string;
  imageURL: string;
  date: any;
  author: string;
  category: string;
  likes: string[];
  bookmarks: string[];
  views: number;
}

interface ReplyData {
  id: string;
  content: string;
  author: string;
  authorId: string;
  date: any;
}

interface CommentData {
  id: string;
  content: string;
  author: string;
  authorId: string;
  date: any;
  replies?: ReplyData[];
}

interface PageParams {
  id: string;
}

const Page = ({ params }: { params: PageParams }) => {
  const [data, setData] = useState<BlogData | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [newReply, setNewReply] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const blogId = params.id;
        if (!blogId) {
          setError("Invalid blog ID");
          setLoading(false);
          return;
        }

        const docRef = doc(db, "blogs", blogId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as BlogData);

          const hasIncremented = localStorage.getItem(
            `hasIncremented_${blogId}`
          );
          if (!hasIncremented) {
            await updateDoc(docRef, { views: increment(1) });
            localStorage.setItem(`hasIncremented_${blogId}`, "true");
          }
        } else {
          setError("Blog data not found");
        }
      } catch (error) {
        setError("Failed to fetch blog data");
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const q = query(
          collection(db, "comments"),
          where("postId", "==", params.id)
        );
        const querySnapshot = await getDocs(q);
        const commentsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const repliesSnapshot = await getDocs(
              collection(db, "comments", doc.id, "replies")
            );
            const repliesData = repliesSnapshot.docs.map((replyDoc) => ({
              id: replyDoc.id,
              ...replyDoc.data(),
              date: parseDate(replyDoc.data().date),
            }));

            return {
              id: doc.id,
              ...data,
              date: parseDate(data.date),
              replies: repliesData,
            };
          })
        );
        setComments(commentsData as CommentData[]);
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };

    fetchBlogData();
    fetchComments();
  }, [params.id]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user.displayName || user.email);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddComment = async () => {
    if (!currentUser || !newComment) return;
    try {
      await addDoc(collection(db, "comments"), {
        postId: params.id,
        content: newComment,
        author: currentUser,
        authorId: auth.currentUser?.uid,
        date: serverTimestamp(),
      });

      const updatedComments = await fetchComments(params.id);
      setComments(updatedComments as CommentData[]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "comments", commentId, "replies"), {
        author: currentUser,
        content: newReply[commentId],
        date: serverTimestamp(),
      });
      const updatedComments = await fetchComments(params.id);
      setComments(updatedComments as CommentData[]);
      setNewReply((prev) => ({ ...prev, [commentId]: "" }));
    } catch (error) {
      console.error("Error adding reply: ", error);
    }
  };

  const handleReplyChange = (commentId: string, value: string) => {
    setNewReply((prev) => ({ ...prev, [commentId]: value }));
  };

  const fetchComments = async (postId: string) => {
    const q = query(collection(db, "comments"), where("postId", "==", postId));
    const querySnapshot = await getDocs(q);
    const commentsData = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const repliesSnapshot = await getDocs(
          collection(db, "comments", doc.id, "replies")
        );
        const repliesData = repliesSnapshot.docs.map((replyDoc) => ({
          id: replyDoc.id,
          ...replyDoc.data(),
          date: parseDate(replyDoc.data().date),
        }));

        return {
          id: doc.id,
          ...data,
          date: parseDate(data.date),
          replies: repliesData,
        };
      })
    );
    return commentsData;
  };

  const handleLike = async () => {
    if (!currentUser || !data) return;

    const isLiked = data.likes && data.likes.includes(currentUser);
    const newLikes = isLiked
      ? arrayRemove(currentUser)
      : arrayUnion(currentUser);

    try {
      const docRef = doc(db, "blogs", data.id);
      await updateDoc(docRef, { likes: newLikes });

      setData((prev) =>
        prev
          ? {
              ...prev,
              likes: isLiked
                ? prev.likes.filter((like) => like !== currentUser)
                : [...(prev.likes || []), currentUser],
            }
          : prev
      );
    } catch (error) {
      console.error("Error updating likes: ", error);
    }
  };

  const handleBookmark = async () => {
    if (!currentUser || !data) return;

    const isBookmarked = data.bookmarks && data.bookmarks.includes(currentUser);
    const newBookmarks = isBookmarked
      ? arrayRemove(currentUser)
      : arrayUnion(currentUser);

    try {
      const docRef = doc(db, "blogs", data.id);
      await updateDoc(docRef, { bookmarks: newBookmarks });

      setData((prev) =>
        prev
          ? {
              ...prev,
              bookmarks: isBookmarked
                ? prev.bookmarks.filter((bookmark) => bookmark !== currentUser)
                : [...(prev.bookmarks || []), currentUser],
            }
          : prev
      );
    } catch (error) {
      console.error("Error updating bookmarks: ", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>No blog data available</div>;
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {data && (
        <main className="container mx-auto py-10 px-5 md:px-12 lg:px-28 bg-gray-100 shadow-md rounded-md mt-5">
          <div>
            <h1
              className="text-3xl sm:text-5xl font-semibold mb-4 text-center"
              data-testid="post-title"
            >
              {data.title}
            </h1>
            <div className="flex justify-between items-center">
              <div>
                <p
                  className="text-lg text-gray-600 mb-2"
                  data-testid="post-author"
                >
                  {data.author}
                </p>
                <p
                  className="text-sm mb-3 tracking-tight font-semibold"
                  data-testid="post-date"
                >
                  {parseDate(data.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-lg text-teal-500 mb-8">
                  Category: {data.category}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={handleLike}>
                  {data.likes &&
                  currentUser &&
                  data.likes.includes(currentUser) ? (
                    <FaHeart className="text-red-500" size={24} />
                  ) : (
                    <FaRegHeart className="text-gray-500" size={24} />
                  )}
                </button>
                <span>{data.likes?.length || 0}</span>
                <button onClick={handleBookmark}>
                  {data.bookmarks &&
                  currentUser &&
                  data.bookmarks.includes(currentUser) ? (
                    <CiBookmarkCheck className="text-teal-500" size={24} />
                  ) : (
                    <CiBookmark className="text-gray-500" size={24} />
                  )}
                </button>
                <span>{data.bookmarks?.length || 0}</span>
              </div>
            </div>
            <div className="relative w-full h-60 sm:h-96 mb-10 rounded-md overflow-hidden shadow-lg">
              <Image
                src={data.imageURL}
                alt="Post Image"
                data-testid="post-image"
                fill
                style={{
                  objectFit: "cover",
                }}
                priority
              />
            </div>
            <article className="prose max-w-none mb-10">
              <MarkdownRenderer
                markdownContent={data.content}
                data-testid="post-content"
              />
            </article>
            <div className="flex justify-between items-center mb-5">
              <span className="text-lg text-gray-500">
                Views: {data.views || 0}
              </span>
              <span className="text-lg text-gray-500">
                Comments: {comments.length}
              </span>
            </div>
            <hr className="my-5" />
            <section className="mt-10">
              <h2 className="text-2xl font-semibold mb-6">Comments</h2>
              {currentUser && (
                <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                  <textarea
                    data-testid="comment-input"
                    className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                  <button
                    data-testid="comment-submit-button"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onClick={handleAddComment}
                  >
                    Post Comment
                  </button>
                </div>
              )}
              {comments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                  >
                    <p className="text-gray-800 mb-2">{comment.content}</p>
                    <div className="text-sm text-gray-500 mb-4 flex items-center">
                      <span className="font-medium">{comment.author}</span>
                      <span className="ml-2">
                        {parseDate(comment.date).toLocaleString()}
                      </span>
                    </div>
                    {currentUser && (
                      <div className="mb-4">
                        <textarea
                          className="w-full border border-gray-300 rounded-lg p-3 mb-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Add a reply"
                          value={newReply[comment.id] || ""}
                          onChange={(e) =>
                            handleReplyChange(comment.id, e.target.value)
                          }
                        ></textarea>
                        <button
                          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          onClick={() => handleAddReply(comment.id)}
                        >
                          Post Reply
                        </button>
                      </div>
                    )}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-4 border-l border-gray-200">
                        {comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="mb-4 pl-4 border-l border-gray-300"
                          >
                            <p className="text-gray-700 mb-2">
                              {reply.content}
                            </p>
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">
                                {reply.author}
                              </span>
                              <span className="ml-2">
                                {parseDate(reply.date).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </section>
          </div>
        </main>
      )}
    </div>
  );
};

export default Page;
