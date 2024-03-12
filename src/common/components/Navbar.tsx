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
  const { parseToken } = useToken();
  if (parseToken() == null) {
    router.push("/login");
    return;
  }
  console.log(parseToken());
  const claims = parseToken();
  const role = claims["role"];

  return (
    <nav className="bg-primary py-4">
      <div className="mx-auto px-2">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-stretch gap-x-4">
            <a href="/dashboard" className="text-white text-4xl font-bold">
              Simpen
            </a>

            {role === "superadmin" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a href="/#" className="text-white text-xl">
                  Akun
                </a>
                <a href="/#" className="text-white text-xl">
                  Program
                </a>
                <a href="/#" className="text-white text-xl">
                  Jenis Kelas
                </a>
                <a href="/#" className="text-white text-xl">
                  Kelas
                </a>
                <a href="/#" className="text-white text-xl">
                  Pengajar
                </a>
              </div>
            )}

            {role === "operasional" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a href="/#" className="text-white text-xl">
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

            {role === "akademik" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a href="/#" className="text-white text-xl">
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

            {role === "pengajar" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a href="/#" className="text-white text-xl">
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
