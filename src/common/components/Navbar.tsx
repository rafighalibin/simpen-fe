"use client";

import React, { useState } from "react";

import { useToken } from "../hooks/useToken";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "../utils/authContext";
import IsLoggedIn from "../utils/IsLoggedIn";

const getRootPath = (path: String) => {
  const rootPath = path.split("/")[1];
  return rootPath;
};

const Navbar = () => {
  const router = useRouter();
  const { removePenggunaToken } = useToken();
  const [loggingOut, setLoggingOut] = useState(false);
  const { pengguna, isAuthenticated } = useAuthContext();
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
      <div className="mx-auto px-2">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-stretch gap-x-4">
            <a href="/dashboard" className="text-white text-4xl font-bold px-4">
              Simpen
            </a>

            {pengguna.role === "superadmin" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a
                  href="/user"
                  className={`${
                    getRootPath(path) == "user"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  User
                </a>
                <a
                  href="/program"
                  className={`${
                    getRootPath(path) == "program"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  Program
                </a>
                <a
                  href="/jenis-kelas"
                  className={`${
                    getRootPath(path) == "jenis-kelas"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  Jenis Kelas
                </a>
                <a
                  href="/kelas"
                  className={`${
                    getRootPath(path) == "kelas"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  Kelas
                </a>
                <a
                  href="/pengajar"
                  className={`${
                    getRootPath(path) == "pengajar"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  Pengajar
                </a>
              </div>
            )}

            {pengguna.role === "operasional" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a
                  href="/kelas"
                  className={`${
                    getRootPath(path) == "kelas"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  Kelas
                </a>
                <a
                  href="/#"
                  className={`${
                    getRootPath(path) == "pengajar"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  Pengajar
                </a>
                <a
                  href="/user/profile"
                  className={`${
                    getRootPath(path) == "user"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  Profil
                </a>
                <a
                  href="/murid"
                  className={`${
                    getRootPath(path) == "murid"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  Murid
                </a>
              </div>
            )}

            {pengguna.role === "akademik" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a
                  href="/kelas"
                  className={`${
                    getRootPath(path) == "kelas"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  Kelas
                </a>
                <a
                  href="/#"
                  className={`${
                    getRootPath(path) == "user"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  Pengajar
                </a>
                <a
                  href="/user/profile"
                  className={`${
                    getRootPath(path) == "user"
                      ? "text-primaryForeground"
                      : "text-info"
                  }  hover:text-primaryForeground text-xl`}
                >
                  Profil
                </a>
              </div>
            )}

            {pengguna.role === "pengajar" && (
              <div className="flex space-x-4 pt-2 pl-7">
                <a
                  href="/kelas"
                  className="text-info hover:text-primaryForeground text-xl"
                >
                  Kelas
                </a>
                <a
                  href="/user/profile"
                  className="text-info hover:text-primaryForeground text-xl"
                >
                  Profil
                </a>
              </div>
            )}
          </div>

          <div className="px-4">
            {loggingOut ? (
              <div className="flex items-center">
                <p className="text-white mr-2">Logging out...</p>
                <div className="loader"></div>
              </div>
            ) : (
              <button
                className="text-info hover:text-primaryForeground"
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
