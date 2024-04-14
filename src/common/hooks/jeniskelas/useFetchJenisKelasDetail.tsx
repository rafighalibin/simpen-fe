import React, { useEffect, useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { JenisKelas } from "../../types/jeniskelas";
import { useQuery } from "react-query";

export const useFetchJenisKelasDetail = (id) => {
  const fetchWithToken = useFetchWithToken();
  const [jeniskelas, setJenisKelas] = useState<JenisKelas[]>([]);

  const { isLoading, error, data, refetch } = useQuery("jeniskelas", () =>
    fetchWithToken(`/kelas/jenis/${id}`).then((res) => res.json())
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      const jenisKelasTemp: JenisKelas[] = data.content;
      setJenisKelas(jenisKelasTemp);
    }
  }, [data]);

  return { isLoading, error, jeniskelas, refetch };
};