"use client";

import React, { useState } from "react";

import { useToken } from "../hooks/useToken";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { removePenggunaToken } = useToken();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    removePenggunaToken();

    setTimeout(() => {
      router.push("/login");
    }, 1000);
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
            {loggingOut ? (
              <div className="flex items-center">
                <p className="text-white mr-2">Logging out...</p>
                <div className="loader"></div>
              </div>
            ) : (
              <button
                className="text-white hover:text-gray-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
