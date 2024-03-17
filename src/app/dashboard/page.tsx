"use client";
import React from "react";

import IsLoggedIn from "../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../common/utils/authContext";

const App = () => {
  const { pengguna } = useAuthContext();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {pengguna.role}</p>
    </div>
  );
};

export default IsLoggedIn(App);
