"use client";

import React, { useState } from "react";

import { useToken } from "../hooks/useToken";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../utils/authContext";
import IsLoggedIn from "../utils/IsLoggedIn";

const Navbar = () => {
  const router = useRouter();
  const { removePenggunaToken } = useToken();
  const [loggingOut, setLoggingOut] = useState(false);
  const { pengguna, isAuthenticated } = useAuthContext();

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
      <div className="mx-auto px-2">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-stretch gap-x-4">
            <a href="/dashboard" className="text-white text-4xl font-bold">
              Simpen
            </a>

            {pengguna.role === "superadmin" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a href="/user" className="text-white text-xl">
                  Akun
                </a>
                <a href="/#" className="text-white text-xl">
                  Program
                </a>
                <a href="/#" className="text-white text-xl">
                  Jenis Kelas
                </a>
                <a href="/kelas" className="text-white text-xl">
                  Kelas
                </a>
                <a href="/#" className="text-white text-xl">
                  Pengajar
                </a>
              </div>
            )}

            {pengguna.role === "operasional" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a href="/kelas" className="text-white text-xl">
                  Kelas
                </a>
                <a href="/#" className="text-white text-xl">
                  Pengajar
                </a>
                <a href="/#" className="text-white text-xl">
                  Profil
                </a>
              </div>
            )}

            {pengguna.role === "akademik" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a href="/kelas" className="text-white text-xl">
                  Kelas
                </a>
                <a href="/#" className="text-white text-xl">
                  Pengajar
                </a>
                <a href="/#" className="text-white text-xl">
                  Profil
                </a>
              </div>
            )}

            {pengguna.role === "pengajar" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a href="/kelas" className="text-white text-xl">
                  Kelas
                </a>
                <a href="/#" className="text-white text-xl">
                  Profil
                </a>
              </div>
            )}
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
