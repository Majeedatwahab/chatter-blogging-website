import React from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { BsFillChatDotsFill } from "react-icons/bs";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 p-4 bg-emerald-900 text-white rounded-md shadow-lg hover:bg-emerald-700 transition-colors"
            >
              <BsFillChatDotsFill size={24} />
              <span className="text-3xl font-extrabold">Chatter</span>
            </Link>
            <p className="text-gray-400 mt-2">
              Elevate Your Voice – Where Every Word Matters.
            </p>
          </div>
          {/* Navigation Section */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-12">
            <div className="mb-6 lg:mb-0">
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/createpost"
                    className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <span>Write</span>
                    <IoCreateOutline size={24} />
                  </Link>
                </li>
              </ul>
            </div>
            {/* Social Media Section */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-12">
              <h3 className="text-xl font-semibold mb-4 lg:mb-0">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/majeedahwahab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://www.linkedin.com/in/majeedat-abdulwahab-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <FaLinkedinIn size={24} />
                </a>
                <a
                  href="https://github.com/Majeedatwahab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <FaGithub size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p className="text-sm">
            © {new Date().getFullYear()} Chatter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
