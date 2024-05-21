"use client";
import React, { useEffect, useRef, useState } from "react";

import IsLoggedIn from "../../common/utils/IsLoggedIn";
import { EstablishProfile } from "../../components/dashboard/establishProfile";
import { ListOfAnnouncement } from "../../components/dashboard/listOfAnnouncement";
import useFetchLoggedUser from "../../common/hooks/user/useFetchLoggedUser";
import { StatsPengajar } from "../../components/dashboard/statsPengajar";
import { Notification } from "../../components/dashboard/notificationDashboard";
import { StatsOps } from "../../components/dashboard/statsOps";
import { StatsAkad } from "../../components/dashboard/statsAkad";
import { StatsAdmin } from "../../components/dashboard/statsAdmin";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useRouter } from "next/navigation";
import { useToken } from "../../common/hooks/useToken";

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [userLogged, setUserLogged] = useState(null);
  const router = useRouter();
  const { removePenggunaToken } = useToken();
  const fetchWithToken = useFetchWithToken();
  const {
    isLoading: loggedUserLoading,
    error,
    loggedUser,
    refetch,
  } = useFetchLoggedUser();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (loggedUser) {
      const userNotifications = loggedUser.notifikasi || [];
      notifications.push(...userNotifications);
      setNotifications((prev) => [...prev, userNotifications]);
    }
  }, [loggedUser]);

  useEffect(() => {
    const fetchUserLoggedIn = async () => {
      try {
        const response = await fetchWithToken(`/auth/login`); // Use dynamic endpoint based on `id`
        const data = await response.json();
        if (response.ok) {
          setUserLogged(data.content);
        } else {
          throw new Error(data.message || "Failed to fetch data");
        }
      } catch (error) {
        removePenggunaToken();
        router.push(`/login`);
      }
    };

    fetchUserLoggedIn();
  }, []);

  const handleNotificationUpdate = async () => {
    try {
      refetch(); // Refetch logged user data
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="px-[8vw] py-8 flex-wrap grid grid-flow-row-dense grid-cols-3">
      <div className="mr-5 ml-5">
        <EstablishProfile data={loggedUser} />
        <br></br>
        <Notification data={notifications} onUpdate={handleNotificationUpdate} />
      </div>
      <div className="flex-wrap mr-5 ml-5 mb-12 col-span-2">
        <ListOfAnnouncement data={loggedUser} />
        <br></br>
        {loggedUser && loggedUser.role == "superadmin" && (
          <StatsAdmin />
        )}
        {loggedUser && loggedUser.role == "pengajar" && (
          <StatsPengajar />
        )}
        {loggedUser && loggedUser.role == "operasional" && (
          <StatsOps />
        )}
        {loggedUser && loggedUser.role == "akademik" && (
          <StatsAkad />
        )}
      </div>
    </div>
  );
};

export default IsLoggedIn(App);
