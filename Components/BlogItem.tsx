"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart, FaHeart, FaRegComments } from "react-icons/fa";
import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

type BlogItemProps = {
  title: string;
  imageURL: string;
  category: string;
  snippet: string;
  content: string;
  author: string;
  date: number;
  id: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  isLiked: boolean;
  isBookmarked: boolean;
  likesCount: number;
  bookmarksCount: number;
};

const BlogItem: React.FC<BlogItemProps> = ({
  title,
  imageURL,
  category,
  snippet,
  author,
  date,
  id,
  onLike,
  isLiked,
  likesCount,
  bookmarksCount,
  isBookmarked,
  onBookmark,
  onEdit,
  onDelete,
}) => {
  // Local state to handle comment input

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <Image
          src={imageURL}
          alt={title}
          fill
          style={{
            objectFit: "cover",
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="p-6">
        <div className="text-xs text-gray-500">
          {new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mt-2">{title}</h2>
        <p className="text-gray-700 mt-2">{snippet}</p>
        <Link
          href={`/blogs/${id}`}
          className="font-bold text-black hover:underline"
        >
          Read More...
        </Link>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <h2 className="">{author}</h2>
          <div>
            <h1 className="font-bold text-black">{category} </h1>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            aria-label="like"
            onClick={() => onLike(id)}
            className="flex items-center"
          >
            {isLiked ? (
              <FaHeart size={24} className="text-red-500" />
            ) : (
              <FaRegHeart size={24} />
            )}
            <span className="ml-1">{likesCount}</span>
          </button>

          <button
            aria-label="bookmark"
            onClick={() => onBookmark(id)}
            className="flex items-center"
          >
            {isBookmarked ? (
              <CiBookmarkCheck size={24} className="text-red-500" />
            ) : (
              <CiBookmark size={24} />
            )}
            <span className="ml-1">{bookmarksCount}</span>
          </button>
        </div>
        {onEdit && onDelete && (
          <div className="actions flex items-center justify-between mt-4">
            <button aria-label="edit" onClick={() => onEdit(id)} className="">
              <FaEdit color=" gray" size={24} />
            </button>
            <button
              aria-label="delete"
              onClick={() => onDelete(id)}
              className=""
            >
              <MdDelete color="red" size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogItem;
