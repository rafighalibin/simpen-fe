import { useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { JenisKelas } from "../../types/jeniskelas";
import { useQuery } from "react-query";

const useFetchAllJenisKelas = () => {
  const fetchWithToken = useFetchWithToken();
  const [listAllJenisKelas, setListAllJenisKelas] = useState<JenisKelas[]>([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["listAllJenisKelas"],
    queryFn: () => fetchWithToken(`/kelas/jenis`).then((res) => res.json()),
    onSuccess: (data) => {
      const listJenisKelasTemp: JenisKelas[] = data.content
        .map((role: any) => role.user)
        .flat();
      setListAllJenisKelas(listJenisKelasTemp);
    },
  });
  return { isLoading, error, listAllJenisKelas };
};

export default useFetchAllJenisKelas;
