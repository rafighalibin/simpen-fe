import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-primary py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
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
            <div className="w-5 h-5 bg-gray-300"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
