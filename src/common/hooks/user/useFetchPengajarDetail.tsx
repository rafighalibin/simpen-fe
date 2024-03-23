import { useEffect, useState } from "react";
import { PengajarDetail } from "../../types/pengajar";
import useFetchWithToken from "../fetchWithToken";
import { useQuery } from "react-query";

const useFetchPengajarDetail = () => {
  const fetchWithToken = useFetchWithToken();
  const [listPengajarExisting, setListPengajarExisting] = useState<
  PengajarDetail[]
  >([]);

  const { isLoading, error, data, refetch} = useQuery({
    queryKey: ["listUser"],
    queryFn: () => fetchWithToken(`/user`).then((res) => res.json()),
    onSuccess(data) {
        if(data){
          data.content[2].user.forEach((element: PengajarDetail) => {
            listPengajarExisting.push(element);
          });
        }
    }
  });

  return { isLoading, error, listPengajarExisting, refetch };
};

export default useFetchPengajarDetail;
