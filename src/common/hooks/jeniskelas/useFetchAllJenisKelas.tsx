import { useEffect, useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { JenisKelas } from "../../types/jeniskelas";
import { useQuery } from "react-query";

const useFetchAllJenisKelas = () => {
  const fetchWithToken = useFetchWithToken();
  const [listAllJenisKelas, setListAllJenisKelas] = useState<JenisKelas[]>([]);

  const { isLoading, error, data, refetch } = useQuery("listAllJenisKelas", () =>
    fetchWithToken("/kelas/jenis").then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const listJenisKelasTemp: JenisKelas[] = data.content || [];
      setListAllJenisKelas(listJenisKelasTemp);
    }
  }, [data]);

  return { isLoading, error, listAllJenisKelas, refetch };
};

export default useFetchAllJenisKelas;
