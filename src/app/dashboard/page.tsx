"use client";
import React, { useEffect } from "react";

import IsLoggedIn from "../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../common/utils/authContext";
import { EstablishProfile } from "../../components/dashboard/establishProfile";
import { ListOfAnnouncement } from "../../components/dashboard/listOfAnnouncement";
import useFetchLoggedUser from "../../common/hooks/user/useFetchLoggedUser";

const App = () => {
  const { pengguna } = useAuthContext();
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
    // Fetch latest user data whenever authentication changes
    // This ensures that the dashboard updates with the latest user information
    // You may need to fetch the data from an API endpoint
    console.log("Fetching latest user data:", pengguna);
  }, [pengguna]);

  return (
    <div className="px-[8vw] py-8 flex">
      <div className="mr-8">
        <EstablishProfile data={loggedUser} />
      </div>
      <div>
        {loggedUser && loggedUser.role != "superadmin" && (
          <ListOfAnnouncement data={loggedUser} />
        )}
      </div>
    </div>
  );
};

export default IsLoggedIn(App);
