import { useEffect, useState } from "react";
import { PengajarDetail } from "../../types/pengajar";
import useFetchWithToken from "../fetchWithToken";
import { useQuery } from "react-query";
import { useQueryClient } from "react-query";


const useFetchPengajarDetail = () => {
  const fetchWithToken = useFetchWithToken();
  const queryClient = useQueryClient();
  const [listPengajarExisting, setListPengajarExisting] = useState<
  PengajarDetail[]
  >([]);

  const { isLoading, error, data, refetch} = useQuery({
    queryKey: ["listUser"],
    queryFn: () => fetchWithToken(`/user`).then((res) => res.json()),
    onSuccess(data) {
        if(data){
          for(let i = 0; i < data.content.length; i++){
            if(data.content[i].role === "pengajar"){
              data.content[i].user.forEach((element: PengajarDetail) => {
                listPengajarExisting.push(element);
              });
            }
          }
        }
    }
  });
  return { isLoading, error, listPengajarExisting, refetch };
};

export default useFetchPengajarDetail;
