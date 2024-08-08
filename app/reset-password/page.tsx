"use client";
import React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/firebaseConfig";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailValue = (e.target as HTMLFormElement).email.value;
    try {
      await sendPasswordResetEmail(auth, emailValue);
      alert("Password reset link has been sent to your email address.");
      router.push("/login");
    } catch (err) {
      alert("Error sending password reset email. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Forgot Password?
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Please enter your email address and we&rsquo;ll send you a password
          reset link.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <button
            type="submit"
            data-testid="reset-password-button"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
