"use client";
import React, { use, useEffect, useState } from "react";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useParams } from "next/navigation";
import { MuridSelect } from "../../../common/types/murid";
import { useMutation, useQuery } from "react-query";
import CalendarIcon from "../../../common/components/icons/CalendarIcon";
import Loading from "../../../common/components/Loading";
import SesiAbsen from "./SesiAbsen";
import Link from "next/link";

const Absen = () => {
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

  const {
    mutateAsync: updatePlaylistMutation,
    isSuccess: updatePlaylistSuccess,
    isError: updatePlaylistError,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/playlist/${id}`, "POST", {
        id: id,
        linkPlaylist: playlistKelas,
      }).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data.message);
    },
  });

  useEffect(() => {
    if (data) {
      setPlaylistKelas(data.content.linkPlaylist);
    }
  }, [data]);

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
    linkPlaylist,
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

  function isValidUrl(input) {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i" // fragment locator
    );
    return !!urlPattern.test(input);
  }

  const handleSubmitPlaylist = () => {
    if (!isValidUrl(playlistKelas)) {
      alert("Link Playlist tidak valid");
      return;
    }
    updatePlaylistMutation();
    setIsChanged(false);
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
            <Link href={"/error/construction"}>
              <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
                Zoom Kelas
              </button>
            </Link>
            <Link href={`reschedule`}>
              <button className="bg-warning text-white px-4 py-2 rounded-md hover:bg-warningHover">
                Ubah Jadwal
              </button>
            </Link>
            <Link href={"ganti-pengajar"}>
              <button className="bg-warning text-white px-4 py-2 rounded-md hover:bg-warningHover">
                Ganti Guru
              </button>
            </Link>
            <Link href={`/kelas/${id}`}>
              <button className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover">
                Detail Kelas
              </button>
            </Link>
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
            Link Playlist Kelas
          </label>
          <div className="flex space-x-4">
            <input
              type="search"
              value={playlistKelas || ""}
              placeholder="LInk Playlist Rekaman Kelas"
              name="linkPlaylist"
              onChange={(e) => {
                setIsChanged(true);
                setPlaylistKelas(e.target.value);
              }}
              className="bg-base  p-2 w-full border rounded-md"
            />
            <button
              className="bg-info text-white px-4  rounded-md hover:bg-infoHover"
              onClick={(e) => handleSubmitPlaylist()}
            >
              Update Playlist
            </button>
          </div>
          <div className="mt-5">
            {updatePlaylistSuccess && !isChanged && (
              <div className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2">
                Berhasil update Playlist
              </div>
            )}
            {updatePlaylistError && !isChanged && (
              <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
                Gagal update Playlist
              </div>
            )}
          </div>
        </div>

        <div>
          <SesiAbsen />
        </div>
      </div>
    </div>
  );
};

export default Absen;
