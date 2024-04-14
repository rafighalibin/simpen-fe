import { useEffect, useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { User } from "../../types/user";
import { useQuery } from "react-query";
import { useAuthContext } from "../../utils/authContext";

const useFetchLoggedUser = () => {
  const fetchWithToken = useFetchWithToken();
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  const { isLoading, error, data, refetch } = useQuery("loggedUser", () =>
    fetchWithToken("/auth/login").then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const user: User = data.content;
      setLoggedUser(user);
    }
  }, [data]);

  return { isLoading, error, loggedUser, refetch };
};

export default useFetchLoggedUser;
