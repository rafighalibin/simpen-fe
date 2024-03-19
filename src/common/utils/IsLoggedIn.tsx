import { useEffect } from "react";
import { useToken } from "../hooks/useToken";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./authContext";
import Cookies from "js-cookie";

function IsLoggedIn(Component) {
  return function IsLoggedIn(props) {
    const { isAuthenticated } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
      if (!Cookies.get("Authorization")) {
        console.log("Not authenticated");
        router.replace("/login");
      }
    }, [isAuthenticated]); // Add isAuthenticated as a dependency

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

export default IsLoggedIn;
