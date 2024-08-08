"use client";
import { useState, useEffect } from "react";
import { uploadFile } from "@/Services/FileService";
import { useRouter } from "next/navigation";
import { logout } from "@/Services/AuthService";
import React from "react";
import { Avatar as defaultAvatar } from "@/Assets/assets";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { FaEdit, FaSave, FaCommentDots, FaHeart, FaEye } from "react-icons/fa";
import { CiBookmarkCheck } from "react-icons/ci";
import Link from "next/link";
import { BsFillChatDotsFill } from "react-icons/bs";
import { IoCreateOutline } from "react-icons/io5";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ref, set, get } from "firebase/database";
import { auth, realtimeDb } from "@/app/firebaseConfig";
import { db } from "@/app/firebaseConfig";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { updateUserData } from "@/Services/UserService";

interface Post {
  id: string;
  title?: string;
  views?: number;
  likes?: string[];
  bookmarks?: string[];
}

interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  createdAt: number;
}

const UserDashboard = () => {
  const router = useRouter();
  const [avatar, setAvatar] = useState<StaticImageData | string>(defaultAvatar);
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isAnalyticsVisible, setIsAnalyticsVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [postAnalytics, setPostAnalytics] = useState<
    {
      id: string;
      title: string;
      views: number;
      likes: number;
      comments: number;
      bookmarks: number;
      commentsData: Comment[];
    }[]
  >([]);

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userRef = ref(realtimeDb, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setName(userData.name || "");
            setUserName(userData.username || "");
            setEmail(userData.email || "");
            setAvatar(userData.avatar || defaultAvatar);
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };

      const fetchPostsAndComments = async () => {
        try {
          // Fetch posts
          const postsCollection = collection(db, "blogs");
          const q = query(postsCollection, where("authorId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const posts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];

          // Fetch all comments
          const commentsCollection = collection(db, "comments");
          const commentsSnapshot = await getDocs(commentsCollection);
          const allComments = commentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Comment[];

          // Process posts and comments
          const analyticsData = posts.map((post) => {
            const postId = post.id;

            // Filter comments related to this post
            const postComments = allComments.filter(
              (comment) => comment.postId === postId
            );

            return {
              id: postId,
              title: post.title || "Untitled",
              views: post.views || 0,
              likes: Array.isArray(post.likes) ? post.likes.length : 0,
              comments: postComments.length,
              bookmarks: Array.isArray(post.bookmarks)
                ? post.bookmarks.length
                : 0,
              commentsData: postComments,
            };
          });

          setPostAnalytics(analyticsData);
        } catch (error) {
          console.error("Error fetching posts and comments: ", error);
        }
      };

      fetchUserData();
      fetchPostsAndComments();
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const avatarURL = await uploadFile(
          file,
          `avatars/${user?.uid}/${file.name}`
        );
        setAvatar(avatarURL);

        // Update avatar URL in Realtime Database
        if (user) {
          await set(ref(realtimeDb, `users/${user.uid}/avatar`), avatarURL);
        }
      } catch (error) {
        console.error("Error uploading avatar: ", error);
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("updating profile...");
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match");
      return;
    }

    // Update user data in Realtime Database
    if (user) {
      try {
        // Re-authenticate user if password is provided
        if (password) {
          const credential = EmailAuthProvider.credential(
            user.email!,
            password
          );
          await reauthenticateWithCredential(user, credential);
        }

        // Update user password if new password is provided
        if (newPassword) {
          await updatePassword(user, newPassword);
        }

        // Update user data in Realtime Database
        await updateUserData(user.uid, {
          username,
          name,
          email,
          avatar,
        });
        console.log("Profile updated successfully");
        alert("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
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
                className="flex items-center justify-between space-x-2 p-3 bg-emerald-900 text-white rounded-md shadow-md hover:bg-emerald-700 transition-colors"
                data-testid="logo-link"
              >
                <BsFillChatDotsFill size={24} />
                <span className="text-2xl font-bold">Chatter</span>
              </Link>
            </div>
            <Link
              className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
              href="/createpost"
              data-testid="create-post-link"
            >
              <span>Write</span>
              <IoCreateOutline size={24} />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-64 border-r border-gray-300 bg-gray-800 text-white p-6">
          <h2 className="text-2xl font-bold mb-4 text-emerald-400">
            User Dashboard
          </h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className={`text-lg w-full py-2 px-4 rounded-md transition-colors ${
                  isFormVisible ? "bg-emerald-500" : "bg-gray-700"
                } hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
              >
                {isFormVisible ? "Hide" : "Update"} Details
              </button>
            </li>
            <li>
              <button
                onClick={() => setIsAnalyticsVisible(!isAnalyticsVisible)}
                className={`text-lg w-full py-2 px-4 rounded-md transition-colors ${
                  isAnalyticsVisible ? "bg-emerald-500" : "bg-gray-700"
                } hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400`}
              >
                {isAnalyticsVisible ? "Hide" : "View"} Analytics
              </button>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="text-lg w-full py-2 px-4 rounded-md transition-colors bg-gray-700 hover:bg-emerald-600"
              >
                Logout
              </button>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="profile-details w-full max-w-md mb-6 bg-white rounded-lg shadow-lg p-4">
              <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24 ">
                  <div className="flex items-center justify-center w-full h-full rounded">
                    {avatar && typeof avatar === "string" ? (
                      <Image
                        src={avatar}
                        alt="Avatar"
                        fill
                        data-testid="profile-avatar"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw)"
                        style={{ objectFit: "cover" }}
                        priority
                        className="w-24 h-24 rounded-full object-cover border-4 border-emerald-400"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-full border-4 border-emerald-400">
                        <span className="text-white">No Image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <label
                    htmlFor="avatar"
                    className="bg-emerald-400 text-white text-lg absolute right-0 bottom-0 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-emerald-500"
                  >
                    <FaEdit />
                  </label>
                </div>
              </div>
              <h2
                className="text-2xl font-semibold mt-4"
                data-testid="profile-name"
              >
                {name}
              </h2>
              <p
                className="text-gray-500 font-bold"
                data-testid="profile-username"
              >
                @{username}
              </p>
            </div>

            {isAnalyticsVisible && (
              <div className="user-analytics w-full">
                <h2 className="text-xl font-bold mb-4">Post Analytics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                  {postAnalytics.map((blog) => (
                    <div
                      key={blog.id}
                      className="bg-gray-100 p-4 rounded-md shadow-md hover:bg-emerald-600 hover:text-white"
                    >
                      <h3 className="text-lg font-bold mb-2">{blog.title}</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4 ">
                        <div className="text-gray-700 flex  flex-col items-center">
                          <FaEye size={24} />
                          <p>Views</p>
                          <p className="text-2xl font-bold">{blog.views}</p>
                        </div>
                        <div className="text-gray-700 flex  flex-col items-center">
                          <FaHeart className="text-red-500" size={24} />

                          <p>Likes</p>
                          <p className="text-2xl font-bold">{blog.likes}</p>
                        </div>
                        <div className="text-gray-700 flex  flex-col items-center">
                          <FaCommentDots size={24} />
                          <p>Comments</p>
                          <p className="text-2xl font-bold">{blog.comments}</p>
                        </div>
                        <div className="text-gray-700 flex  flex-col items-center">
                          <CiBookmarkCheck
                            className="text-black font-bold "
                            size={24}
                          />
                          <p>Bookmarks</p>
                          <p className="text-2xl font-bold">{blog.bookmarks}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isFormVisible && (
              <div className="update-details w-full max-w-md mt-6 bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                  Update Details
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="name" className="text-left text-gray-600">
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="username"
                      className="text-left text-gray-600"
                    >
                      Username:
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      data-testid="username-input"
                      onChange={(e) => setUserName(e.target.value)}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="text-left text-gray-600">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      data-testid="email-input"
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="password"
                      className="text-left text-gray-600"
                    >
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="newPassword"
                      className="text-left text-gray-600"
                    >
                      New Password:
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="confirmNewPassword"
                      className="text-left text-gray-600"
                    >
                      Confirm New Password:
                    </label>
                    <input
                      type="password"
                      id="confirmNewPassword"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <button
                    type="submit"
                    data-testid="update-profile-button"
                    className="flex items-center justify-center space-x-2 p-3 bg-emerald-600 text-white rounded-md w-full hover:bg-emerald-700"
                  >
                    <FaSave className="mr-2" />
                    <span>Save</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default UserDashboard;
