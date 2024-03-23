"use client";
import React, { useState } from "react";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useParams } from "next/navigation";
import { MuridSelect } from "../../../common/types/murid";
import { useMutation, useQuery } from "react-query";
import CalendarIcon from "../../../common/components/icons/CalendarIcon";
import Loading from "../../../common/components/Loading";
import SesiAbsen from "./SesiAbsen";

const Absen = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const { isLoading, error, data } = useQuery({
    queryKey: ["kelasDetail"],
    queryFn: () => fetchWithToken(`/kelas/${id}`).then((res) => res.json()),
    onSuccess: (data) => {
      data.content.listMurid.forEach((e) => {
        muridSelected.push({
          value: e,
          label: e,
        });
      });
    },
  });
  const [muridSelected, setMuridSelected] = useState<MuridSelect[]>([]);
  const [playlistKelas, setPlaylistKelas] = useState("");

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/${id}`, "DELETE").then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      await deleteMutation();
      // Redirect or handle post-delete logic here
    }
  };

  if (isLoading) {
    return <Loading />;
  }

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
  } = data.content;

  // Function to convert timestamps to readable dates
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US");
  };

  return (
    <div>
      <h1 className=" flex justify-center text-5xl font-bold text-neutral/100 my-10">
        Absensi Kelas
      </h1>
      <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg border">
        <div className="flex justify-between items-center">
          <h1 className=" flex justify-start text-3xl font-bold text-neutral/100 ">
            Informasi Kelas
          </h1>
          <div className="flex justify-end gap-4">
            <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
              <a href={"/error/construction"}>Zoom Kelas</a>
            </button>
            <button className="bg-warning text-white px-4 py-2 rounded-md hover:bg-warningHover">
              <a href={"/error/construction"}>Ubah Jadwal / Ganti Guru</a>
            </button>
            <button className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover">
              <a href={`/kelas/${id}`}>Detail Kelas</a>
            </button>
          </div>
        </div>

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

        <div className="flex flex-row gap-4">
          <div className="w-1/2 relative">
            <label className="block font-medium text-neutral/70">
              Tanggal Kelas Dimulai
            </label>
            <div className="flex mt-1 relative">
              <input
                disabled
                type="text"
                value={formatDate(tanggalMulai)}
                className="read-only:text-neutral/60 bg-neutral/5 p-2 pl-10 w-full rounded-md bg-gray-100 cursor-not-allowed"
                readOnly
              />
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <CalendarIcon className="text-neutral/80" />
              </div>
            </div>
          </div>

          <div className="w-1/2 relative">
            <label className="block font-medium text-neutral/70">
              Tanggal Kelas Selesai
            </label>
            <div className="flex mt-1 relative">
              <input
                disabled
                type="text"
                value={formatDate(tanggalSelesai)}
                className="read-only:text-neutral/60 bg-neutral/5 p-2 pl-10 w-full rounded-md bg-gray-100 cursor-not-allowed"
                readOnly
              />
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <CalendarIcon className="text-neutral/80" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium text-neutral/70">
            Link Group Kelas
          </label>
          <input
            type="text"
            value={playlistKelas}
            placeholder="LInk Playlist Rekaman Kelas"
            name="linkGroup"
            onChange={(e) => setPlaylistKelas(e.target.value)}
            className="bg-base mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div>
          <SesiAbsen />
        </div>
      </div>
    </div>
  );
};

export default Absen;