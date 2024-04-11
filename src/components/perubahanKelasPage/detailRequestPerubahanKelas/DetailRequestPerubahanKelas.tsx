"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { MuridRead, MuridSelect } from "../../../common/types/murid";
import Loading from "../../../common/components/Loading";
import { useAuthContext } from "../../../common/utils/authContext";
import SesiRescheduleRequest from "./SesiRescheduleRequest";
import SesiGantiPengajarRequest from "./SesiGantiPengajarRequest";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DetailRequestPerubahanKelas = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const searchParams = useSearchParams();

  const { pengguna: userLoggedIn } = useAuthContext();
  const router = useRouter();
  const [muridRendered, setMuridRendered] = useState(false);
  const { isLoading, error, data } = useQuery({
    queryKey: ["kelasDetail"],
    queryFn: () => fetchWithToken(`/kelas/${id}`).then((res) => res.json()),
    onSuccess: (data) => {
      if (data.status != "OK") {
        window.alert(data.message);
        router.push("/dashboard");
      }
      data.content.listMurid.forEach((e) => {
        muridSelected.push({
          value: e,
          label: e,
        });
      });
    },
  });

  const [muridSelected, setMuridSelected] = useState<MuridSelect[]>([]);

  useEffect(() => {
    if (muridSelected.length > 0) {
      setMuridRendered(true);
    }
  }, [muridSelected]);

  if (isLoading) return <Loading />;

  if (error || !data) {
    return <div>Error fetching class details.</div>;
  }

  const {
    programName,
    jenisKelasName,
    listSesi,
    tanggalMulai,
    tanggalSelesai,
    pengajarId,
    linkGroup,
    listMurid,
    level,
    platform,
    namaPengajar,
    status,
  } = data.content;

  const listMuridShow: MuridRead[] = listMurid;

  // Function to convert timestamps to readable dates
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US");
  };

  return (
    <div>
      <h1 className=" flex justify-center text-5xl font-bold text-neutral/100 my-10">
        {searchParams.get("tipe") == "reschedule"
          ? "Detail Request Reschedule"
          : "Detail Request  Ganti Pengajar"}
      </h1>
      <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg border">
        <div>
          <label className="block font-medium text-neutral/70">Id Kelas</label>
          <input
            disabled
            type="text"
            value={id}
            className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium text-neutral/70">Pengajar</label>
          <input
            disabled
            type="text"
            value={namaPengajar}
            className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
          />
        </div>

        <div className="flex flex-row gap-4  ">
          <div className="w-1/2">
            <label className="block font-medium text-neutral/70">Program</label>
            <input
              disabled
              type="text"
              value={programName}
              className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full  rounded-md"
            />
          </div>

          <div className="w-1/2">
            <label className="block font-medium text-neutral/70">
              Jenis Kelas
            </label>
            <input
              disabled
              type="text"
              value={jenisKelasName}
              className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-neutral/70">
            Link Group Kelas
          </label>
          <input
            disabled
            type="text"
            value={linkGroup}
            className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
          />
        </div>

        <div className="p-2">
          {searchParams.get("tipe") == "reschedule" && (
            <SesiRescheduleRequest />
          )}
          {searchParams.get("tipe") == "ganti-pengajar" && (
            <SesiGantiPengajarRequest />
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailRequestPerubahanKelas;
