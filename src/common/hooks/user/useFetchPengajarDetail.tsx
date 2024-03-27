import { useEffect, useState } from "react";
import { PengajarDetail } from "../../types/pengajar";
import useFetchWithToken from "../fetchWithToken";
import { useQuery } from "react-query";
import { useQueryClient } from "react-query";
import { TagDetail } from "../../types/tag";

const useFetchPengajarDetail = () => {
  const fetchWithToken = useFetchWithToken();
  const queryClient = useQueryClient();
  const [listPengajarExisting, setListPengajarExisting] = useState<
    PengajarDetail[]
  >([]);
  const [formState, setFormState] = useState({
    id: "",
    listIdTag: [],
  });

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["listUser"],
    queryFn: () => fetchWithToken(`/user`).then((res) => res.json()),
    onSuccess(data) {
      if (data) {
        for (let i = 0; i < data.content.length; i++) {
          if (data.content[i].role === "pengajar") {
            data.content[i].user.forEach((element: PengajarDetail) => {
              listPengajarExisting.push(element);
            });
          }
        }
      }
      // setFormState((prev) => ({
      //   ...prev,
      //   listTag: data.content.listTag.map((tag: TagDetail) => tag.id),
      // }));

      // data.content.listTag.forEach((tag: TagDetail) => {
      //   setFormState((prev) => ({
      //     ...prev,
      //     listIdTag: [...prev.listIdTag, tag.id],
      //   }));
      // });
    },
  });
  return { isLoading, error, listPengajarExisting, refetch };
};

export default useFetchPengajarDetail;
