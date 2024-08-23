"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/Services/AuthService";
import { getUser } from "@/app/Services/userService";
import { RxAvatar } from "react-icons/rx";
import { BsFillChatDotsFill } from "react-icons/bs";
import { FiMenu, FiX, FiSearch, FiXCircle } from "react-icons/fi";
import { IoCreateOutline } from "react-icons/io5";
import type { User } from "firebase/auth";
import ContentBrowser from "./ContentBrowser";
import { realtimeDb } from "@/app/firebaseConfig";
import { ref, get } from "firebase/database";
import { Avatar as defaultAvatar } from "@/Assets/assets";
import Image, { StaticImageData } from "next/image";

const Header = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUserName] = useState("");
  const [avatar, setAvatar] = useState<StaticImageData | string>(defaultAvatar);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        setUser(userData as User | null);
        if (userData) {
          const userRef = ref(realtimeDb, `users/${userData.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const userDetails = snapshot.val();
            setUserName(userDetails.username || "");
            setAvatar(userDetails.avatar || defaultAvatar);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleSearch = () => {};

  const handleClearSearch = () => {
    setSearchQuery("");
  };
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
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

              <div className="hidden md:flex relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Search posts..."
                  className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-80"
                  data-testid="search-input"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-2 top-2"
                    data-testid="clear-search-button"
                  >
                    <FiXCircle className="w-5 h-5 text-gray-500" />
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  className="absolute right-8 top-2"
                  data-testid="search-button"
                >
                  <FiSearch className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                  href="/createpost"
                  data-testid="create-post-link"
                >
                  <span>Write</span>
                  <IoCreateOutline size={24} />
                </Link>
                <div className="relative"></div>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center space-x-2 focus:outline-none"
                      data-testid="user-avatar-button"
                    >
                      {avatar && typeof avatar === "string" ? (
                        <Image
                          src={avatar}
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full border border-gray-300"
                          width={32}
                          height={32}
                          data-testid="user-avatar"
                        />
                      ) : (
                        <RxAvatar className="w-8 h-8 text-gray-700" />
                      )}
                    </button>
                    {isDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-10"
                        data-testid="dropdown-menu"
                      >
                        <h1 className="block px-4 py-2 text-gray-700 hover:underline cursor-text">
                          @{username}
                        </h1>
                        <Link
                          href="/userdashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          data-testid="dashboard-link"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/userposts"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          data-testid="my-posts-link"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          My Posts
                        </Link>
                        <Link
                          href="/bookmarks"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          My Bookmarks
                        </Link>

                        <Link
                          href="/login"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          <button
                            onClick={handleLogout}
                            data-testid="logout-button"
                          >
                            Logout
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <RxAvatar className="w-8 h-8 text-gray-700" />
                )}
              </div>
              <button
                className="md:hidden focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="mobile-menu-button"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  data-testid="search-input"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-2 top-2"
                    data-testid="clear-search-button"
                  >
                    <FiXCircle className="w-5 h-5 text-gray-500" />
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  className="absolute right-8 top-2"
                  data-testid="search-button"
                >
                  <FiSearch className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    {avatar && typeof avatar === "string" ? (
                      <Image
                        src={avatar}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full border border-gray-300"
                        width={32}
                        height={32}
                        data-testid="mobile-user-avatar"
                      />
                    ) : (
                      <RxAvatar className="w-8 h-8 text-gray-700" />
                    )}
                    <h1 className="text-gray-700 cursor-text">@{username}</h1>
                  </div>
                  <Link
                    href="/userdashboard"
                    className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                    data-testid="mobile-dashboard-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/userposts"
                    className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                    data-testid="mobile-my-posts-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Posts
                  </Link>
                  <Link href="/login">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                      data-testid="mobile-logout-button"
                    >
                      Logout
                    </button>
                  </Link>
                </>
              ) : (
                <RxAvatar className="w-8 h-8 text-gray-700" />
              )}
              <Link
                className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center space-x-2"
                href="/createpost"
                data-testid="mobile-create-post-link"
              >
                <span>Write</span>
                <IoCreateOutline size={24} />
              </Link>
            </div>
          )}
        </div>
      </header>
      <ContentBrowser searchQuery={searchQuery} />
    </>
  );
};

export default Header;
