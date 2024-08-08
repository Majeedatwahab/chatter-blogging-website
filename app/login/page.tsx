"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmail, signInWithGoogle } from "@/Services/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let valid = true;
    setEmailError(null);
    setPasswordError(null);

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    return valid;
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signInWithEmail(email, password);

      if (rememberMe) {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPassword", password);
      } else {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userPassword");
      }
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleReset = () => {
    router.push("/reset-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2
          className="text-2xl font-bold mb-4 text-center"
          data-testid="sign-in-heading"
        >
          Sign In
        </h2>
        <p className="mb-2 text-center">
          Please enter your login details below
        </p>
        <form onSubmit={handleSignIn}>
          <div className="mb-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              data-testid="email-input"
            />
            {emailError && <p className="text-red-500">{emailError}</p>}
          </div>
          <div className="relative w-full border border-gray-300 rounded mb-2 p-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              data-testid="password-input"
            />
            <button
              aria-label="Toggle password visibility"
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          {passwordError && <p className="text-red-500">{passwordError}</p>}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
              data-testid="remember-me-checkbox"
            />
            <label htmlFor="rememberMe" className="text-gray-700">
              Remember Me
            </label>
          </div>
          <button
            aria-label="Sign in with Email"
            type="submit"
            className="bg-teal-600 text-white py-2 px-4 rounded w-full mt-5"
            data-testid="email-sign-in-button"
          >
            Sign In
          </button>
          <button
            aria-label="Sign in with Google"
            type="button"
            onClick={handleGoogleSignIn}
            className="bg-teal-600 text-white py-2 px-4 rounded w-full mt-5"
            data-testid="google-sign-in-button"
          >
            Sign In with Google
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            type="button"
            onClick={handleReset}
            className="text-red-300 px-4 rounded w-full mt-5"
            data-testid="reset-password-button"
          >
            Forgot Password?
          </button>
        </form>
        <p className="mt-4">
          Don&rsquo;t have an account?{" "}
          <a href="/signup" className="text-teal-600">
            Sign Up
          </a>
        </p>
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-center bg-black text-white rounded px-4 py-2"
            data-testid="go-home-link"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
