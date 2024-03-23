import { useEffect, useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { User } from "../../types/user";
import { useQuery } from "react-query";

const useFetchAllUser = () => {
  const fetchWithToken = useFetchWithToken();
  const [listAllUser, setListAllUser] = useState<User[]>([]);

  const { isLoading, error, data, refetch } = useQuery("listAllUser", () =>
    fetchWithToken("/user").then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const listUserTemp: User[] = data.content
        .map((role: any) => role.user)
        .flat();
      setListAllUser(listUserTemp);
    }
  }, [data]);

  return { isLoading, error, listAllUser, refetch };
};

export default useFetchAllUser;
