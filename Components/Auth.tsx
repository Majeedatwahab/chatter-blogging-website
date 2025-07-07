import Link from "next/link";

export default function Auth() {
    return (
      <>
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
        ;
      </>
    );
}