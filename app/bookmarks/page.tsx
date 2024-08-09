"use client";
import BookmarkedPosts from "@/Components/BookMarkedPosts";
import { auth } from "@/app/firebaseConfig";

const BookmarkedPostsPage = () => {
  const { currentUser } = auth;

  return (
    <div className="container mx-auto p-4">
      {currentUser && <BookmarkedPosts currentUserId={currentUser.uid} />}
    </div>
  );
};

export default BookmarkedPostsPage;
