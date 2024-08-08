"use client";
import React, { useState, useEffect } from "react";
import { fetchSearchResults } from "@/app/Services/searchService";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  snippet: string;
}

interface ContentBrowserProps {
  searchQuery: string;
}

const ContentBrowser: React.FC<ContentBrowserProps> = ({ searchQuery }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchPosts = async () => {
      if (searchQuery) {
        setIsSearching(true);
        try {
          const results = await fetchSearchResults(searchQuery);
          setPosts(results as Post[]);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
        setIsSearching(false);
      } else {
        setPosts([]);
      }
    };

    searchPosts();
  }, [searchQuery]);

  return (
    <div>
      {isSearching && <p>Loading...</p>}
      {!isSearching && posts.length === 0 && searchQuery && (
        <p>No posts found</p>
      )}
      <div>
        {posts.map((post) => (
          <div
            key={post.id}
            className="post-item mb-4 border p-4 rounded shadow-sm"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-700 mt-2">{post.snippet}</p>
            <Link
              href={`/blogs/${post.id}`}
              className="block mt-2 text-blue-600 hover:underline"
            >
              Read More...
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentBrowser;
