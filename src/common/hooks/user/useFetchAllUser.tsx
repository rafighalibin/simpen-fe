import { useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { User } from "../../types/user";
import { useQuery } from "react-query";

const useFetchAllUser = () => {
  const fetchWithToken = useFetchWithToken();
  const [listAllUser, setListAllUser] = useState<User[]>([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["listAllUser"],
    queryFn: () => fetchWithToken(`/user`).then((res) => res.json()),
    onSuccess: (data) => {
      const listUserTemp: User[] = data.content
        .map((role: any) => role.user)
        .flat();
      setListAllUser(listUserTemp);
    },
  });
  return { isLoading, error, listAllUser };
};

export default useFetchAllUser;
