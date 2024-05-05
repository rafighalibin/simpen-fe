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

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const {
    isLoading: loggedUserLoading,
    error,
    loggedUser,
    refetch,
  } = useFetchLoggedUser();

  useEffect(() => {
    refetch();
  }, [refetch]);

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
      notifications.push(...userNotifications);
      setNotifications((prev) => [...prev, userNotifications]);
    }
  }, [loggedUser]);

  return (
    <div className="px-[8vw] py-8 flex">
      <div className="mr-8">
        <EstablishProfile data={loggedUser} />
        <br></br>
        <Notification data={notifications} onUpdate={handleNotificationUpdate} />
      </div>
      <div>
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
