import { useState } from "react";
import { ProgramSelect } from "../../types/program";
import useFetchWithToken from "../fetchWithToken";
import { useQuery } from "react-query";

const useFetchProgram = () => {
  const fetchWithToken = useFetchWithToken();
  const [listProgramExisting, setListProgramExisting] = useState<
    ProgramSelect[]
  >([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["listProgram"],
    queryFn: () => fetchWithToken(`/kelas/program`).then((res) => res.json()),
    onSuccess: (data) => {
      const listProgramTemp: ProgramSelect[] = data.content[2].program.map(
        (program: any) => ({
          value: program.id,
          label: program.nama,
        })
      );
      listProgramExisting.push(...listProgramTemp);
    },
  });

  return { isLoading, error, listProgramExisting };
};

export default useFetchProgram;
