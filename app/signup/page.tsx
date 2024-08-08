"use client";
import React, { useState } from "react";
import { auth, realtimeDb } from "@/app/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { signInWithGoogle } from "@/Services/AuthService";
import { useRouter } from "next/navigation";
import { ref, set } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setError("Name, Email, and Password cannot be empty");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await set(ref(realtimeDb, "users/" + user.uid), {
        uid: user.uid,
        name,
        email,
      });

      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <p className="mb-2 text-center">Please enter your details below</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            data-testid="username-input"
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded mb-2 p-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            data-testid="email-input"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded mb-2 p-2"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              data-testid="password-input"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded mb-2 p-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              data-testid="confirm-password-input"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded mb-2 p-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button
            type="submit"
            data-testid="signup-button"
            className="bg-teal-600 text-white py-2 px-4 rounded w-full mt-5"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="bg-teal-600 text-white py-2 px-4 rounded w-full mt-5"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up With Google"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
        <p className="mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-600">
            Sign In
          </Link>
        </p>
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-center bg-black text-white rounded px-4 py-2"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
