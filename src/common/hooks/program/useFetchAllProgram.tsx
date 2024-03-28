import { useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { Program } from "../../types/program";
import { useQuery } from "react-query";

const useFetchAllProgram = () => {
  const fetchWithToken = useFetchWithToken();
  const [listAllProgram, setListAllProgram] = useState<Program[]>([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["listAllProgram"],
    queryFn: () => fetchWithToken(`/kelas/program`).then((res) => res.json()),
    onSuccess: (data) => {
      const listProgramTemp: Program[] = data.content
        .map((role: any) => role.user)
        .flat();
      setListAllProgram(listProgramTemp);
    },
  });
  return { isLoading, error, listAllProgram };
};

export default useFetchAllProgram;
