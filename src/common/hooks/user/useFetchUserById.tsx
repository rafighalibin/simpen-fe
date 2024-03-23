import React, { useEffect, useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { User } from "../../types/user";
import { useQuery } from "react-query";

export const useFetchUserById = (id) => {
  const fetchWithToken = useFetchWithToken();
  const [user, setUser] = useState<User[]>([]);

  const { isLoading, error, data, refetch } = useQuery("user", () =>
    fetchWithToken(`/user/${id}`).then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const userTemp: User[] = data.content;
      setUser(userTemp);
    }
  }, [data]);

  return { isLoading, error, user, refetch };
};
