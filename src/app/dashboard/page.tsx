"use client";
import React from "react";

import { useToken } from "../../common/hooks/useToken";
import { User } from "../../common/types/user";
import IsLoggedIn from "../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../common/utils/authContext";

export default function App() {
  const { pengguna } = useAuthContext();
  if (pengguna.role) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {pengguna.role}</p>
      </div>
    );
  }
}
