import { useEffect, useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { Program } from "../../types/program";
import { useQuery } from "react-query";

const useFetchAllProgram = () => {
  const fetchWithToken = useFetchWithToken();
  const [listAllProgram, setListAllProgram] = useState<Program[]>([]);

  const { isLoading, error, data, refetch } = useQuery("listAllProgram", () =>
    fetchWithToken("/kelas/program").then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const listProgramTemp: Program[] = data.content || [];
      setListAllProgram(listProgramTemp);
    }
  }, [data]);

  return { isLoading, error, listAllProgram, refetch };
};

export default useFetchAllProgram;
