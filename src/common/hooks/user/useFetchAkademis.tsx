import { useState } from "react";
import { AkademisSelect } from "../../types/akademis";
import useFetchWithToken from "../fetchWithToken";
import { useQuery } from "react-query";

const useFetchAkademis = () => {
  const fetchWithToken = useFetchWithToken();
  const [listAkademisExisting, setListAkademisExisting] = useState<
    AkademisSelect[]
  >([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["listUser"],
    queryFn: () => fetchWithToken(`/user`).then((res) => res.json()),
    onSuccess: (data) => {
      const listAkademisTemp: AkademisSelect[] = data.content[2].user.map(
        (user: any) => ({
          value: user.id,
          label: user.nama,
        })
      );
      listAkademisExisting.push(...listAkademisTemp);
    },
  });

  return { isLoading, error, listAkademisExisting };
};

export default useFetchAkademis;
