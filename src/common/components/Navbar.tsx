"use client";

import React, { useEffect, useRef, useState } from "react";

import { useToken } from "../hooks/useToken";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "../utils/authContext";
import IsLoggedIn from "../utils/IsLoggedIn";
import { PoppinsBold, InterReguler, InterMedium } from "../../font/font";
import styles from "./Navbar.module.css";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import Link from "next/link";
import useFetchLoggedUser from "../hooks/user/useFetchLoggedUser";
import { Notification } from "./Notification";
import { useMutation } from "react-query";
import useFetchWithToken from "../hooks/fetchWithToken";

const getRootPath = (path: String) => {
  const rootPath = path.split("/")[1];
  return rootPath;
};

const Navbar = () => {
  const fetchWithToken = useFetchWithToken();
  const router = useRouter();
  const { removePenggunaToken } = useToken();
  const [loggingOut, setLoggingOut] = useState(false);
  const { pengguna, isAuthenticated } = useAuthContext();
  const [navbar, setNavbar] = useState(false);
  const [dropdownKelas, setDropdownKelas] = useState(false);

  const path = usePathname();
  const {
    isLoading: loggedUserLoading,
    error,
    loggedUser,
    refetch,
  } = useFetchLoggedUser();
  const [notifications, setNotifications] = useState([]);
  const [expandNotif, setExpandNotif] = useState(false);
  const unreadNotifications = notifications.filter(
    (notification) => !notification.opened
  );
  const notificationRef = useRef(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const { mutateAsync: logoutMutation } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/auth/logout`, "PUT").then((res) => res.json),
    onSuccess: () => {
      removePenggunaToken();
    },
  });

  const handleNotificationUpdate = async () => {
    try {
      refetch(); // Refetch logged user data
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (loggedUser) {
      const userNotifications = loggedUser.notifikasi || [];
      setNotifications(userNotifications);
    }
  }, [loggedUser]);

  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setExpandNotif(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutMutation();
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  const handleNotification = () => {
    setExpandNotif(!expandNotif);
  };

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div>
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
                    <div className="relative">
                      {/* Main link for Kelas */}
                      <span
                        className={`${
                          getRootPath(path) === "kelas"
                            ? "md:text-primaryForeground"
                            : "md:text-info"
                        }  md:hover:text-primaryForeground`}
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownKelas(!dropdownKelas);
                        }}
                      >
                        Kelas
                      </span>
                      {dropdownKelas && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-primary border border-[#DFE4EA] rounded-md shadow-lg z-10">
                          <ul>
                            <li className="p-2">
                              <a
                                href="/kelas"
                                className="text-sm md:text-base text-info hover:text-primaryForeground"
                              >
                                Daftar Kelas
                              </a>
                            </li>
                            <li className="p-2">
                              <a
                                href="/kelas/add"
                                className="text-sm md:text-base text-info hover:text-primaryForeground"
                              >
                                Tambah Kelas
                              </a>
                            </li>
                            <li className="p-2">
                              <a
                                href="/perubahan-kelas"
                                className="text-sm md:text-base text-info hover:text-primaryForeground"
                              >
                                Perubahan Kelas
                              </a>
                            </li>
                            <li className="p-2">
                              <a
                                href="/kelas/program"
                                className="text-sm md:text-base text-info hover:text-primaryForeground"
                              >
                                Program
                              </a>
                            </li>
                            <li className="p-2">
                              <a
                                href="/kelas/jenis"
                                className="text-sm md:text-base text-info hover:text-primaryForeground"
                              >
                                Jenis Kelas
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
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
                  </li>{" "}
                  <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent hover:bg-[#efefef]">
                    <a
                      href="/murid"
                      className={`${
                        getRootPath(path) === "murid"
                          ? "md:text-primaryForeground"
                          : "md:text-info"
                      }  md:hover:text-primaryForeground`}
                    >
                      Murid
                    </a>
                  </li>
                  <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent  hover:bg-[#efefef]">
                    <a
                      href="/profile"
                      className={`${
                        getRootPath(path) === "profile"
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
                      href="/profile"
                      className={`${
                        getRootPath(path) === "profile"
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
                      href="/profile"
                      className="md:text-info md:hover:text-primaryForeground"
                    >
                      Profil
                    </a>
                  </li>
                  <li className="md:border-0 border-b-[1px] p-2 md:hover:bg-transparent hover:bg-[#efefef]">
                    <a
                      href="/profile/availability"
                      className="md:text-info md:hover:text-primaryForeground"
                    >
                      Availability
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
            {loggedUser && loggedUser.role != "superadmin" && (
              <div
                className={`px-4 text-[16px] ${styles.nav_items_tx} md:block hidden`}
                style={InterReguler.style}
              >
                <div className={`${styles.navbar_logo}`}>
                  {notifications.length > 0 ? (
                    <button onClick={handleNotification}>
                      <div
                        className="flex items-center"
                        style={{ fontSize: "24px" }}
                      >
                        <FaBell />
                        {unreadNotifications.length > 0 && (
                          <span className="top-2 right-48 bg-red-500 text-white rounded-full px-1 py-1 text-xs">
                            {unreadNotifications.length}
                          </span>
                        )}
                      </div>
                    </button>
                  ) : (
                    <div
                      className="flex items-center"
                      style={{ fontSize: "24px", cursor: "not-allowed" }}
                    >
                      <FaBell />
                    </div>
                  )}
                </div>
              </div>
            )}

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
      {expandNotif && (
        <div ref={notificationRef}>
          <Notification
            data={notifications}
            onUpdate={handleNotificationUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
