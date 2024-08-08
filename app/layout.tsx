import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import Header from "@/Components/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Chatter App | Elevate Your Voice & Connect with Like-Minded People",
    description: "Join Chatter, the ultimate blogging platform to share your voice, connect with a vibrant community, and engage with impactful content. Discover, create, and inspire.",
    keywords: "Chatter, blogging platform, content creation, online community, social engagement, voice your opinion, inspire, connect",
 
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Header /> 
        {children}
      </body>
    </html>
  );
}
