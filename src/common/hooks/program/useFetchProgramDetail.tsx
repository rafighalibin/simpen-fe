import React, { useEffect, useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { Program } from "../../types/program";
import { useQuery } from "react-query";

export const useFetchProgramDetail = (id) => {
  const fetchWithToken = useFetchWithToken();
  const [program, setProgram] = useState<Program[]>([]);

  const { isLoading, error, data, refetch } = useQuery("program", () =>
    fetchWithToken(`/kelas/program/${id}`).then((res) => res.json())
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (data) {
      const programTemp: Program[] = data.content;
      setProgram(programTemp);
    }
  }, [data]);

  return { isLoading, error, program, refetch };
};