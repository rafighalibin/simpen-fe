"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { redirect, useParams } from "next/navigation";
import { SesiDetail } from "../../../common/types/sesi";
import Loading from "../../../app/loading";
import styles from "./SesiAbsen.module.css";
import Link from "next/link";
import { Siemreap } from "next/font/google";

const SesiAbsen = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;
  const [formState, setFormState] = useState([]);
  const [sesiChanged, setSesiChanged] = useState(null);
  const [listIdSesi, setListIdSesi] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const queryClient = useQueryClient();

  const {
    isLoading: fetchDataIsLoading,
    error: fetchDataError,
    data: fetchData,
  } = useQuery({
    queryKey: ["sesiKelas"],
    queryFn: () => fetchWithToken(`/sesi/${id}`).then((res) => res.json()),
  });

  useEffect(() => {
    if (fetchData) {
      setFormState(fetchData.content.map((session) => session.listMuridSesi));
      setListIdSesi(fetchData.content.map((session) => session.sesi_id));
    }
  }, [fetchData]);

  const {
    mutateAsync: editAbsenMutation,
    isLoading: editAbsenIsLoading,
    data: editAbsenResponse,
    isSuccess: editAbsenSuccess,
    isError: editAbsenError,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(
        `/sesi/absen/${listIdSesi[sesiChanged]}`,
        "PUT",
        formState[sesiChanged]
      ).then((res) => res.json()),
    onSuccess: () => {
      setIsChanged(false);
      queryClient.invalidateQueries("sesiKelas");
    },
  });

  const {
    mutateAsync: absenPengajarMutation,
    isLoading: absenPengajarIsLoading,
    data: absenPengajarResponse,
    isSuccess: absenPengajarSuccess,
    isError: absenPengajarError,
  } = useMutation({
    mutationFn: (id) =>
      fetchWithToken(`/absen-pengajar`, "POST", { idSesiKelas: id }).then(
        (res) => res.json()
      ),
    onSuccess: () => {
      queryClient.invalidateQueries("sesiKelas");
    },
  });

  if (fetchDataIsLoading) return <Loading />;

  if (fetchData.content.length === 0) redirect("/kelas");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(fetchData.content.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (!isChanged) setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`${styles.paginatioan_tx} px-3 py-1 mx-1 ${
            currentPage === i
              ? `bg-[#215E9B] text-white`
              : "bg-[#FFFFFF] border border-[#DFE4EA] text-[#637381] hover:bg-[#A8D4FF] hover:text-white disabled:opacity-50"
          } rounded `}
          disabled={isChanged}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const listSesi: SesiDetail[] = fetchData.content;

  const handleInputChange = (sessionIndex, muridIndex, field, value) => {
    setFormState((current) =>
      current.map((sessionList, sIndex) => {
        if (sIndex === sessionIndex) {
          return sessionList.map((murid, mIndex) => {
            if (mIndex === muridIndex) {
              return { ...murid, [field]: value };
            }
            return murid;
          });
        }
        return sessionList;
      })
    );
    setIsChanged(true);
    setSesiChanged(sessionIndex);
  };

  const handleAbsenPengajar = (id, e) => {
    e.preventDefault();
    absenPengajarMutation(id);
    if (isChanged) {
      editAbsenMutation();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center my-5">
        <div className={` ${styles.heading} text-lg font-bold `}>
          Absensi Kelas
        </div>
        <button
          onClick={() => editAbsenMutation()}
          className={`${styles.button_tx} ${styles.edit_btn} disabled:opacity-50 relative`}
          disabled={!isChanged || editAbsenIsLoading}
        >
          {editAbsenIsLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
              <span>On Progress</span>
            </div>
          ) : (
            "Simpan Perubahan Sesi"
          )}
        </button>
      </div>
      <div className="my-5">
        {editAbsenSuccess && !isChanged && !absenPengajarSuccess && (
          <div className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2">
            Berhasil update absen
          </div>
        )}
        {absenPengajarSuccess && (
          <div className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2">
            Pengajar Berhasil Absen
            {editAbsenSuccess && !isChanged && " dan update absen"}
          </div>
        )}
        {editAbsenError && !isChanged && (
          <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
            Gagal update absen
          </div>
        )}
        {absenPengajarError && (
          <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
            Pengajar Gagal Absen
          </div>
        )}
        {fetchDataError && !isChanged && (
          <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
            gagal mengambil data sesi
          </div>
        )}
      </div>

      {listSesi
        .slice(indexOfFirstItem, indexOfLastItem)
        .map((sesi, sessionIndex) => (
          <div key={`div-${sessionIndex}`}>
            <div className="shadow-lg rounded-lg ">
              <form key={sessionIndex}>
                <table data-testid={id} className="table-auto w-full">
                  <thead className="bg-baseForeground rounded-t-lg">
                    <tr key={`th-${sesi.sesi_id}`}>
                      <th className={`px-6 py-6 text-left bg-baseForeground `}>
                        NO
                      </th>
                      <th className={`px-6 py-6 text-left bg-baseForeground `}>
                        NAMA MURID
                      </th>
                      <th className={`px-6 py-6 text-left bg-baseForeground `}>
                        NAMA PARENT
                      </th>
                      <th className={`px-6 py-6 text-left bg-baseForeground `}>
                        NO HP PARENT
                      </th>
                      <th className={`px-6 py-6 text-left bg-baseForeground `}>
                        KEHADIRAN
                      </th>
                      <th className={`px-6 py-6 text-left bg-baseForeground `}>
                        RATING
                      </th>
                      <th className={`px-6 py-6 text-left bg-baseForeground `}>
                        {sesi.status === "Scheduled" && (
                          <button
                            className={`bg-transparent hover:bg-warning text-warning  hover:text-white py-2 px-4 border border-warning hover:border-transparent rounded-full `}
                            onClick={(e) =>
                              handleAbsenPengajar(sesi.sesi_id, e)
                            }
                            disabled={absenPengajarIsLoading}
                          >
                            {absenPengajarIsLoading ? (
                              <div className="inset-0 flex items-center justify-center gap-2">
                                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
                                <span>On Progress</span>
                              </div>
                            ) : (
                              "Selesai"
                            )}
                          </button>
                        )}
                      </th>
                    </tr>
                  </thead>

                  <tbody className={styles.table_items_text}>
                    {sesi.listMuridSesi.map((murid, muridIndex) => (
                      <tr key={`sesi-${sesi.sesi_id}-murid-${muridIndex}`}>
                        <td className="border-b pl-10 px-6 py-6">
                          {muridIndex + 1}
                        </td>
                        <td className="border-b px-6 py-6">{murid.namaOrtu}</td>
                        <td className="border-b px-6 py-6">{murid.nama}</td>
                        <td className="border-b px-6 py-6">{murid.noHpOrtu}</td>

                        <td className="border-b pl-16 px-6 py-6 ">
                          <input
                            type="checkbox"
                            checked={
                              formState[sesi.nomorPertemuan - 1]?.[muridIndex]
                                ?.isPresent || false
                            }
                            onChange={(e) =>
                              handleInputChange(
                                sesi.nomorPertemuan - 1,
                                muridIndex,
                                "isPresent",
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td className="border-b mx-4 px-4 py-5">
                          <input
                            disabled={
                              formState[sesi.nomorPertemuan - 1]?.[muridIndex]
                                ?.isPresent
                                ? false
                                : true
                            }
                            type="number"
                            min="0"
                            max="5"
                            value={
                              formState[sesi.nomorPertemuan - 1]?.[muridIndex]
                                ?.rating || 0
                            }
                            onChange={(e) =>
                              handleInputChange(
                                sesi.nomorPertemuan - 1,
                                muridIndex,
                                "rating",
                                Number(e.target.value)
                              )
                            }
                            className={`${styles.placeholder} relative block px-5 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC]  focus:text-black focus:z-10 disabled:opacity-50`}
                          />
                        </td>
                        <td className="border-b pl-8 px-6 py-6">
                          <Link href={`/murid/${murid.muridId}`}>
                            <button
                              className={`bg-transparent hover:bg-[#215E9B] text-[#215E9B]  hover:text-white py-2 px-4 border border-[#215E9B] hover:border-transparent rounded-full `}
                            >
                              Detail
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>
            </div>
            <div className="pt-8  text-[#6B7280] flex flex-row justify-between">
              <div>
                <p>
                  Waktu Pelaksanaan:{" "}
                  {new Date(sesi.waktuPelaksanaan).toLocaleString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
                <p>Persentase Kehadiran: {sesi.persentaseKehadiran}%</p>
                <p>Average Rating: {sesi.averageRating}</p>
              </div>
              <div>
                {sesi.jadwalZoom && (
                  <a href={sesi.jadwalZoom.link}>
                    <button
                      className={`${styles.button_tx} ${styles.edit_btn} disabled:opacity-50 relative`}
                    >
                      {sesi.jadwalZoom.nama}
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

      <div className="flex flex-col space-y-1 justify-between items-center">
        <span className="text-[#6B7280]">Pertemuan Ke:</span>
        <div className={`flex justify-center pb-4`}>
          <div className={`${styles.pagination_container} p-2`}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1 || isChanged}
              className="px-3 py-1 mx-1 bg-white border border-[#DFE4EA] text-[#637381] rounded hover:bg-[#A8D4FF] hover:text-white disabled:opacity-50"
            >
              {"<"}
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || isChanged}
              className="px-3 py-1 mx-1 bg-white border border-[#DFE4EA] text-[#637381] rounded hover:bg-[#A8D4FF] hover:text-white disabled:opacity-50"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SesiAbsen;
