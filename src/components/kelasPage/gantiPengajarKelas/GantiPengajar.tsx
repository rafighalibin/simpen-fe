"use client";
import React, { use, useEffect, useState } from "react";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useParams } from "next/navigation";
import { MuridSelect } from "../../../common/types/murid";
import { useMutation, useQuery } from "react-query";
import CalendarIcon from "../../../common/components/icons/CalendarIcon";
import Loading from "../../../common/components/Loading";
import SesiAbsen from "./SesiGantiPengajar";
import Link from "next/link";
import SesiReschedule from "./SesiGantiPengajar";

const GantiPengajar = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const [playlistKelas, setPlaylistKelas] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const { isLoading, error, data } = useQuery({
    queryKey: ["kelasDetail"],
    queryFn: () => fetchWithToken(`/kelas/${id}`).then((res) => res.json()),
    onSuccess: (data) => {
      setPlaylistKelas(data.content.linkPlaylist);
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error || !data) {
    return <div>Error fetching class details.</div>;
  }

  const { programName, jenisKelasName, linkGroup, namaPengajar } = data.content;

  return (
    <div>
      <h1 className=" flex justify-center text-5xl font-bold text-neutral/100 my-10">
        Request Ganti Pengajar
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

        <SesiReschedule />
      </div>
    </div>
  );
};

export default GantiPengajar;
