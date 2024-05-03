import { useState } from "react";
import { PengajarSelect } from "../../types/pengajar";
import useFetchWithToken from "../fetchWithToken";
import { useQuery } from "react-query";

const useFetchPengajar = () => {
  const fetchWithToken = useFetchWithToken();
  const [listPengajarExisting, setListPengajarExisting] = useState<
    PengajarSelect[]
  >([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["listUser"],
    queryFn: () => fetchWithToken(`/user/pengajar`).then((res) => res.json()),
    onSuccess: (data) => {
      const listPengajarTemp: PengajarSelect[] = data.content.map(
        (user: any) => ({
          value: user.id,
          label: user.nama,
        })
      );
      setListPengajarExisting(listPengajarTemp);
    },
  });

  return { isLoading, error, listPengajarExisting };
};

export default useFetchPengajar;
