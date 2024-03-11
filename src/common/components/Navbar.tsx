"use client";

import React from "react";

import { useToken } from "../hooks/useToken";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { removePenggunaToken } = useToken();

  const handleLogout = () => {
    removePenggunaToken();
    router.push("/login");
  };
  return (
    <nav className="bg-primary py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-gray-300">
              Home
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              About
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              Services
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              Contact
            </a>
          </div>
          <div>
            <button
              className="text-white hover:text-gray-300"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
