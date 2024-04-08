"use client";

import React, { useState } from "react";

import { useToken } from "../hooks/useToken";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "../utils/authContext";
import IsLoggedIn from "../utils/IsLoggedIn";
import { PoppinsBold, InterReguler, InterMedium } from "../../font/font";
import styles from "./Navbar.module.css";
import { FaBars, FaTimes } from "react-icons/fa";

const getRootPath = (path: String) => {
  const rootPath = path.split("/")[1];
  return rootPath;
};

const Navbar = () => {
  const router = useRouter();
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
      <div className="mx-auto px-4">
        <div className="md:flex md:justify-between md:items-center">
          <div className="flex justify-between items-stretch gap-x-4">
            <a
              href="/dashboard"
              className={`${styles.logo_tx} px-4 text-[20px] flex items-center`}
              style={PoppinsBold.style}
            >
              Simpen
            </a>
            <span className="md:hidden block">
              {navbar ? (
                <button
                  aria-label="close icon"
                  className={`p-2 rounded-md ${styles.navbar_logo}`}
                  onClick={() => setNavbar(!navbar)}
                >
                  <FaTimes />
                </button>
              ) : (
                <button
                  aria-label="drawer icon"
                  className={`p-2 rounded-md ${styles.navbar_logo}`}
                  onClick={() => setNavbar(!navbar)}
                >
                  <FaBars />
                </button>
              )}
            </span>
          </div>

          <ul
            className={`md:flex md:flex-grow md:items-center md:space-x-2  md:pl-7 text-[16px] right-7 absolute md:static md:z-auto z-[1] ${
              styles.nav_items_tx
            } ${navbar ? `top-[80px] ${styles.card} w-28` : "top-[-490px]"}`}
            style={InterReguler.style}
          >
            {pengguna.role === "superadmin" && (
              <>
                <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent hover:bg-[#efefef]">
                  <a
                    href="/user"
                    className={`${
                      getRootPath(path) === "user"
                        ? "md:text-primaryForeground"
                        : "md:text-info"
                    }  md:hover:text-primaryForeground`}
                  >
                    Akun
                  </a>
                </li>

                <li className="p-2 hover:bg-[#efefef] md:hidden block">
                  <div
                    className={`text-[16px] ${styles.logout_tx} md:hidden block `}
                    style={InterMedium.style}
                  >
                    {loggingOut ? (
                      <div className="flex items-center">
                        <p className="mr-2">Logging out...</p>
                        <div className="loader"></div>
                      </div>
                    ) : (
                      <button
                        className=" md:hover:text-white"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    )}
                  </div>
                </li>
              </>
            )}

            {pengguna.role === "operasional" && (
              <>
                <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent hover:bg-[#efefef]">
                  <a
                    href="/kelas"
                    className={`${
                      getRootPath(path) === "kelas"
                        ? "md:text-primaryForeground"
                        : "md:text-info"
                    }  md:hover:text-primaryForeground`}
                  >
                    Kelas
                  </a>
                </li>
                <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent hover:bg-[#efefef]">
                  <a
                    href="/pengajar"
                    className={`${
                      getRootPath(path) === "pengajar"
                        ? "md:text-primaryForeground"
                        : "md:text-info"
                    }  md:hover:text-primaryForeground`}
                  >
                    Pengajar
                  </a>
                </li>
                <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent hover:bg-[#efefef]">
                  <a
                    href="/perubahan-kelas"
                    className={`${
                      getRootPath(path) === "user"
                        ? "md:text-primaryForeground"
                        : "md:text-info"
                    }  md:hover:text-primaryForeground`}
                  >
                    Perubahan Kelas
                  </a>
                </li>
                <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent  hover:bg-[#efefef]">
                  <a
                    href="/user/profile"
                    className={`${
                      getRootPath(path) === "murid"
                        ? "md:text-primaryForeground"
                        : "md:text-info"
                    }  md:hover:text-primaryForeground`}
                  >
                    Profil
                  </a>
                </li>
                <li className="p-2 hover:bg-[#efefef] md:hidden block">
                  <div
                    className={`text-[16px] ${styles.logout_tx} md:hidden block `}
                    style={InterMedium.style}
                  >
                    {loggingOut ? (
                      <div className="flex items-center">
                        <p className="mr-2">Logging out...</p>
                        <div className="loader"></div>
                      </div>
                    ) : (
                      <button
                        className=" md:hover:text-white"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    )}
                  </div>
                </li>
              </>
            )}

            {pengguna.role === "akademik" && (
              <>
                <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent hover:bg-[#efefef]">
                  <a
                    href="/kelas"
                    className={`${
                      getRootPath(path) === "kelas"
                        ? "md:text-primaryForeground"
                        : "md:text-info"
                    }  md:hover:text-primaryForeground`}
                  >
                    Kelas
                  </a>
                </li>
                <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent hover:bg-[#efefef]">
                  <a
                    href="/pengajar"
                    className={`${
                      getRootPath(path) === "user"
                        ? "md:text-primaryForeground"
                        : "md:text-info"
                    }  md:hover:text-primaryForeground`}
                  >
                    Pengajar
                  </a>
                </li>
                <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent  hover:bg-[#efefef]">
                  <a
                    href="/user/profile"
                    className={`${
                      getRootPath(path) === "user"
                        ? "md:text-primaryForeground"
                        : "md:text-info"
                    }  md:hover:text-primaryForeground`}
                  >
                    Profil
                  </a>
                </li>
                <li className="p-2 hover:bg-[#efefef] md:hidden block">
                  <div
                    className={`text-[16px] ${styles.logout_tx} md:hidden block `}
                    style={InterMedium.style}
                  >
                    {loggingOut ? (
                      <div className="flex items-center">
                        <p className="mr-2">Logging out...</p>
                        <div className="loader"></div>
                      </div>
                    ) : (
                      <button
                        className=" md:hover:text-white"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    )}
                  </div>
                </li>
              </>
            )}

            {pengguna.role === "pengajar" && (
              <>
                <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent hover:bg-[#efefef]">
                  <a
                    href="/kelas"
                    className="md:text-info md:hover:text-primaryForeground"
                  >
                    Kelas
                  </a>
                </li>
                <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent hover:bg-[#efefef]">
                  <a
                    href="/user/profile"
                    className="md:text-info md:hover:text-primaryForeground"
                  >
                    Profil
                  </a>
                </li>

                <li className="p-2 hover:bg-[#efefef] md:hidden block">
                  <div
                    className={`text-[16px] ${styles.logout_tx} md:hidden block `}
                    style={InterMedium.style}
                  >
                    {loggingOut ? (
                      <div className="flex items-center">
                        <p className="mr-2">Logging out...</p>
                        <div className="loader"></div>
                      </div>
                    ) : (
                      <button
                        className=" md:hover:text-white"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    )}
                  </div>
                </li>
              </>
            )}
          </ul>

          <div
            className={`px-4 text-[16px] ${styles.nav_items_tx} md:block hidden`}
            style={InterReguler.style}
          >
            {loggingOut ? (
              <div className="flex items-center">
                <p className="text-white mr-2">Logging out...</p>
                <div className="loader"></div>
              </div>
            ) : (
              <button
                className="text-info hover:text-white"
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
