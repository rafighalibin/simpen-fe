import { useEffect, useState } from "react";
import { PengajarDetail } from "../../types/pengajar";
import useFetchWithToken from "../fetchWithToken";
import { useQuery } from "react-query";
import { useQueryClient } from "react-query";
import { TagDetail } from "../../types/tag";

const useFetchPengajarDetail = (id: any) => {
  const fetchWithToken = useFetchWithToken();
  const queryClient = useQueryClient();
  const [pengajar, setPengajar] = useState<PengajarDetail>(null);
  const [formState, setFormState] = useState({
    id: "",
    listIdTag: [],
  });

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["listUser"],
    queryFn: () =>
      fetchWithToken(`/user/pengajar/${id}`).then((res) => res.json()),
    onSuccess(data) {
      if (data) {
        setPengajar(data.content);
      }
    },
  });
  return { isLoading, error, pengajar, refetch };
};

export default useFetchPengajarDetail;
