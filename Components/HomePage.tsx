import Image from "next/image";
import Link from "next/link";
import { BackgroundImage } from "@/Assets/assets";

const HomePage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <Image
        src={BackgroundImage}
        alt="Background"
        fill
        style={{
          objectFit: "cover",
        }}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="z-0"
      />
      <div className="relative z-10 text-center bg-gray-400 bg-opacity-50 p-6 rounded-lg">
        <h1 className="text-4xl font-bold mb-4 text-black">
          Welcome to Chatter!
        </h1>
        <p className="text-lg mb-8 text-black font-bold">
          Elevate Your Voice - Where Every Word Matters.
        </p>
        <div className="flex space-x-4 justify-center">
          <Link
            href="/login"
            className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-black"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-black text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
