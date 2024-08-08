"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-markdown-editor-lite/lib/index.css";
import { useRouter } from "next/navigation";
import { db, storage, auth } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Markdown from "react-markdown";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { BsFillChatDotsFill } from "react-icons/bs";
import MarkdownRenderer from "@/Components/MarkdownRenderer";
import Header from "@/Components/Header";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [snippet, setSnippet] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideo(e.target.files[0]);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const validateForm = () => {
    if (!title || !snippet || !author || !date || !content) {
      setError("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!category) {
      setError("Please select a tag.");
      return;
    }

    if (!userId) {
      setError("No user is signed in");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageURL = "";
      let videoURL = "";

      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        const imageSnapshot = await uploadBytes(imageRef, image);
        imageURL = await getDownloadURL(imageSnapshot.ref);
      }

      if (video) {
        const videoRef = ref(storage, `videos/${video.name}`);
        const videoSnapshot = await uploadBytes(videoRef, video);
        videoURL = await getDownloadURL(videoSnapshot.ref);
      }

      const newPost = {
        title,
        content,
        snippet,
        author,
        date,
        category,
        imageURL,
        videoURL,
        authorId: userId,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "blogs"), newPost);
      router.push("/dashboard");
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
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

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-emerald-700">Create a New Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              data-testid="title-input"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Snippet"
              data-testid="snippet-input"
              value={snippet}
              onChange={(e) => setSnippet(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Author"
              data-testid="author-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="date"
              value={date}
              data-testid="date-input"
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <MdEditor
            value={content}
            data-testid="markdown-input"
            style={{ height: "400px", borderRadius: "0.375rem", border: "1px solid #D1D5DB" }}
            renderHTML={(text) => <MarkdownRenderer markdownContent={text} />}
            onChange={handleEditorChange}
          />

          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded p-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Health and wellness">Health and Wellness</option>
            <option value="Nature">Nature</option>
            <option value="Food">Food</option>
            <option value="Education">Education</option>
            <option value="Others">Others</option>
          </select>

          <div className="mt-4">
  <label className="block text-gray-700 font-medium mb-2" htmlFor="image-upload">
    Upload an Image
  </label>
  <input
    id="image-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="w-full border border-gray-300 rounded p-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
  />
</div>

<div className="mt-4">
  <label className="block text-gray-700 font-medium mb-2" htmlFor="video-upload">
    Upload a Video
  </label>
  <input
    id="video-upload"
    type="file"
    accept="video/*"
    onChange={handleVideoChange}
    className="w-full border border-gray-300 rounded p-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
  />
</div>

          <button
            type="submit"
            data-testid="create-post-button"
            className={`bg-emerald-700 text-white py-2 px-6 rounded-md font-semibold transition-colors duration-200 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-800"}`}
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default CreatePost;
