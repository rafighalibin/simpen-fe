"use client";

import { useEffect } from "react";
import { useToken } from "../hooks/useToken";
import { useRouter } from "next/navigation";

/**
 * @param {React.ComponentType} Component
 */
function IsLoggedIn(Component) {
  return function IsLoggedIn(props) {
    const { getPenggunaToken, parseToken } = useToken();
    const router = useRouter();

    useEffect(() => {
      if (!getPenggunaToken) {
        router.replace("/login");
      }
    }, []);

    console.log(parseToken);
    if (!getPenggunaToken) {
      return;
    }

    return <Component {...props} />;
  };
}

export default IsLoggedIn;
