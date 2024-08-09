"use client";
import { BsFillChatDotsFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { fetchBookmarkedPosts } from "@/app/Services/postService";
import BlogItem from "./BlogItem";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  imageURL: string;
  category: string;
  snippet: string;
  author: string;
  date: number;
  isLiked: boolean;
  likesCount: number;
  isBookmarked: boolean;
  bookmarksCount: number;
  content: string;
};

type BookmarkedPostsProps = {
  currentUserId: string;
};

const BookmarkedPosts: React.FC<BookmarkedPostsProps> = ({ currentUserId }) => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 3;

  useEffect(() => {
    const loadBookmarkedPosts = async () => {
      const posts = await fetchBookmarkedPosts(currentUserId);
      setBookmarkedPosts(posts as Post[]);
    };

    loadBookmarkedPosts();
  }, [currentUserId]);

  const totalPages = Math.ceil(bookmarkedPosts.length / postsPerPage);

  const currentPosts = bookmarkedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-5 md:px-12 lg:px-28">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 md:space-x-6">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 p-3 bg-emerald-900 text-white rounded-md shadow-md hover:bg-emerald-700 transition-colors"
                data-testid="logo-link"
              >
                <BsFillChatDotsFill size={24} />
                <span className="text-2xl font-bold">Chatter</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Your Bookmarked Posts
        </h1>
        {currentPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPosts.map((post) => (
                <BlogItem
                  key={post.id}
                  {...post}
                  onLike={(id) => {}}
                  onBookmark={(id) => {}}
                />
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-8">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 mx-1 border rounded-md ${
                    currentPage === index + 1
                      ? "bg-emerald-900 text-white"
                      : "bg-white text-emerald-900 border-emerald-900"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">
            You haven't bookmarked any posts yet.
          </p>
        )}
      </div>
    </>
  );
};

export default BookmarkedPosts;