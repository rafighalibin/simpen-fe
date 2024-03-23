"use client";
import React, { useEffect } from "react";

import IsLoggedIn from "../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../common/utils/authContext";

const App = () => {
  const { pengguna } = useAuthContext();

  useEffect(() => {
    // Fetch latest user data whenever authentication changes
    // This ensures that the dashboard updates with the latest user information
    // You may need to fetch the data from an API endpoint
    console.log("Fetching latest user data:", pengguna);
  }, [pengguna]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {pengguna.role}</p>
    </div>
  );
};

export default IsLoggedIn(App);
