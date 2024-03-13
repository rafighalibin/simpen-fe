"use client";

import { useEffect } from "react";
import { useToken } from "../hooks/useToken";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./authContext";

function IsLoggedIn(Component) {
  return function IsLoggedIn(props) {
    const { isAuthenticated } = useAuthContext();
    const router = useRouter();
    useEffect(() => {
      if (!isAuthenticated) {
        console.log("Not authenticated");
        router.replace("/login");
      }
    }, []);

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

export default IsLoggedIn;
