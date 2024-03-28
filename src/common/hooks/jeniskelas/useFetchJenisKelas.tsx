import { useState } from "react";
import { JenisKelasSelect } from "../../types/jeniskelas";
import useFetchWithToken from "../fetchWithToken";
import { useQuery } from "react-query";

const useFetchJenisKelas = () => {
  const fetchWithToken = useFetchWithToken();
  const [listJenisKelasExisting, setListJenisKelasExisting] = useState<
    JenisKelasSelect[]
  >([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["listJenisKelas"],
    queryFn: () => fetchWithToken(`/kelas/jenis`).then((res) => res.json()),
    onSuccess: (data) => {
      const listJenisKelasTemp: JenisKelasSelect[] = data.content[2].jeniskelas.map(
        (jeniskelas: any) => ({
          value: jeniskelas.id,
          label: jeniskelas.nama,
        })
      );
      listJenisKelasExisting.push(...listJenisKelasTemp);
    },
  });

  return { isLoading, error, listJenisKelasExisting };
};

export default useFetchJenisKelas;
