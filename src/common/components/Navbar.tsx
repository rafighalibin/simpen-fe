"use client";

import React, { useState } from "react";

import { useToken } from "../hooks/useToken";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "../utils/authContext";
import IsLoggedIn from "../utils/IsLoggedIn";

//import font
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";

const Navbar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { removePenggunaToken } = useToken();
  const [loggingOut, setLoggingOut] = useState(false);
  const { pengguna, isAuthenticated } = useAuthContext();
  const [navbar, setNavbar] = useState(false);
  const path = usePathname();

  const handleLogout = () => {
    setLoggingOut(true);
    removePenggunaToken();
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  if (!isAuthenticated) {
    return null;
  }
  return (
    <nav className="bg-primary py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div
          style={InterReguler.style}
          className="flex justify-between items-center "
        >
          <div className="flex space-x-4">
            <h1 style={PoppinsBold.style} className="text-white font-bold">
              <a href="/">Simpen</a>
            </h1>

            {pengguna.role === "superadmin" && (
              <div className="flex space-x-4">
                <a
                  href="/user"
                  className={`text-gray-300 hover:text-white ${
                    pathName == "/user" ? "text-white" : "text-gray-300"
                  }`}
                >
                  Akun
                </a>
              </div>
            )}

            {pengguna.role === "operasional" && (
              <div className="flex space-x-4">
                <a
                  href="/kelas"
                  className={`text-gray-300 hover:text-white ${
                    pathName == "/kelas" ? "text-white" : "text-gray-300"
                  }`}
                >
                  Kelas
                </a>
                <a
                  href="/pengajar"
                  className={`text-gray-300 hover:text-white ${
                    pathName == "/pengajar" ? "text-white" : "text-gray-300"
                  }`}
                >
                  Pengajar
                </a>
                <a
                  href="/perubahan-kelas"
                  className={`text-gray-300 hover:text-white ${
                    pathName == "/pengajar" ? "text-white" : "text-gray-300"
                  }`}
                >
                  Perubahan Kelas
                </a>
                <a
                  href="/user/profile"
                  className={`text-gray-300 hover:text-white ${
                    pathName == "/profil" ? "text-white" : "text-gray-300"
                  }`}
                >
                  Profil
                </a>
              </div>
            )}

            {pengguna.role === "akademik" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a href="/kelas" className="text-gray-300">
                  Kelas
                </a>
                <a href="/pengajar" className="text-gray-300 hover:text-white">
                  Pengajar
                </a>
                <a href="/user/profile" className="text-gray-300">
                  Profil
                </a>
              </div>
            )}

            {pengguna.role === "pengajar" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a href="/kelas" className="text-gray-300">
                  Kelas
                </a>
                <a href="/user/profile" className="text-gray-300">
                  Profil
                </a>
              </div>
            )}
          </div>

          <div>
            {loggingOut ? (
              <div className="flex items-center">
                <p className="text-gray-300 mr-2">Logging out...</p>
                <div className="loader"></div>
              </div>
            ) : (
              <button
                className="text-gray-300 hover:text-white"
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
