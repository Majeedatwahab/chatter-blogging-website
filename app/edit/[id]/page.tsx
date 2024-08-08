"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "@/app/firebaseConfig";
import dynamic from "next/dynamic";
import "react-markdown-editor-lite/lib/index.css";
import { onAuthStateChanged } from "firebase/auth";
import Header from "@/Components/Header";
import MarkdownRenderer from "@/Components/MarkdownRenderer";
import Image from "next/image";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  snippet: string;
  date: string;
  image: string;
  video: string;
  userId: string;
}

const EditBlog = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [snippet, setSnippet] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "blogs", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const blogData = docSnap.data() as BlogPost;
          setData(blogData);
          setTitle(blogData.title);
          setContent(blogData.content);
          setCategory(blogData.category);
          setSnippet(blogData.snippet);
          setAuthor(blogData.author);
          setDate(blogData.date);
          setLoading(false);
        } else {
          setError("Blog post not found");
        }
      } catch (error) {
        setError("Failed to fetch blog post");
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
      console.log("Selected image file:", e.target.files[0]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideo(e.target.files[0]);
      console.log("Selected video file:", e.target.files[0]);
    }
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setContent(text);
  };

  const handleUpdate = async () => {
    if (!id) return;

    if (!category) {
      setError("Please select a tag.");
      return;
    }

    if (!userId) {
      setError("No user is signed in");
      return;
    }

    try {
      let imageURL = data?.image || "";
      let videoURL = data?.video || "";

      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        const imageSnapshot = await uploadBytes(imageRef, image);
        imageURL = await getDownloadURL(imageSnapshot.ref);
        console.log("New image URL:", imageURL);
      }

      if (video) {
        const videoRef = ref(storage, `videos/${video.name}`);
        const videoSnapshot = await uploadBytes(videoRef, video);
        videoURL = await getDownloadURL(videoSnapshot.ref);
        console.log("New video URL:", videoURL);
      }

      const docRef = doc(db, "blogs", id as string);
      const updatedPost = {
        title,
        content,
        snippet,
        author,
        date,
        category,
        imageURL,
        videoURL,
        userId,
        updatedAt: new Date(),
      };

      console.log("Updating blog post with:", updatedPost);
      await updateDoc(docRef, updatedPost);
      console.log("Blog post updated successfully");

      // Fetch the updated data to ensure the component state is updated
      const updatedDocSnap = await getDoc(docRef);
      if (updatedDocSnap.exists()) {
        const updatedBlogData = updatedDocSnap.data() as BlogPost;
        setData(updatedBlogData);
      }

      router.push("/userposts");
    } catch (error) {
      console.error("Error updating blog post:", error);
      setError("Failed to update blog post");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Blog Post</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="space-y-6"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded mb-2 p-2"
          />
          <input
            type="text"
            placeholder="Snippet"
            value={snippet}
            onChange={(e) => setSnippet(e.target.value)}
            className="w-full border border-gray-300 rounded mb-2 p-2"
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-300 rounded mb-2 p-2"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded mb-2 p-2"
          />

          <MdEditor
            value={content}
            style={{ height: "500px" }}
            renderHTML={(text) => <MarkdownRenderer markdownContent={text} />}
            onChange={handleEditorChange}
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded mb-2 p-2"
          >
            <option value="">Select a tag</option>
            <option value="Uncategorized">Uncategorized</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Health and wellness">Health and Wellness</option>
            <option value="Nature">Nature</option>
            <option value="Food">Food</option>
          </select>
          <input type="file" onChange={handleImageChange} accept="image/*" />
          <input type="file" onChange={handleVideoChange} accept="video/*" />

          {data?.image && (
            <div>
              <p>Current Image:</p>
              <Image src={data.image} alt="Current" width={500} height={300} />
            </div>
          )}
          {data?.video && (
            <div>
              <p>Current Video:</p>
              <video controls style={{ maxWidth: "100%" }}>
                <source src={data.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <button
            type="submit"
            className="bg-emerald-900 text-white rounded py-2 px-4 hover:bg-blue-600"
          >
            Update Post
          </button>
        </form>
      </div>
    </>
  );
};

export default EditBlog;
