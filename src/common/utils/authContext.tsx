"use client";
import { useToken } from "../hooks/useToken";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/user";
interface AuthContextValues {
  pengguna: User; // Assuming User is imported and defined elsewhere
  isAuthenticated: boolean;
  checkPermission: (
    operasional: boolean,
    akademik: boolean,
    pengajar: boolean
  ) => boolean;
}
const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [pengguna, setPengguna] = useState<User>({} as User);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const { getPenggunaToken } = useToken();

  const setPenggunaData = () => {
    const decodedToken: User = jwtDecode(getPenggunaToken());
    setPengguna(decodedToken);
  };

  useEffect(() => {
    if (getPenggunaToken()) {
      setPenggunaData();
      setIsAuthenticated(true);
    } else {
      setPengguna(undefined);
      setIsAuthenticated(false);
    }
  }, [isAuthenticated, getPenggunaToken()]);

  const checkPermission = (
    operasional: boolean,
    akademik: boolean,
    pengajar: boolean
  ) => {
    if (pengguna.role === "pengajar" && pengajar) {
      return true;
    } else if (pengguna.role === "operasional" && operasional) {
      return true;
    } else if (pengguna.role === "akademik" && akademik) {
      return true;
    } else if (pengguna.role === "superadmin") {
      return true;
    } else {
      router.replace("/error/unauthorized");
      return null;
    }
  };

  const values = {
    pengguna,
    isAuthenticated,
    checkPermission,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext) as AuthContextValues;
};
