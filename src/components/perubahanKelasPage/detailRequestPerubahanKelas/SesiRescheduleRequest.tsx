"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useParams } from "next/navigation";
import Loading from "../../../app/loading";
import styles from "./DetailPerubahanKelas.module.css";
import {
  CreateRescheduleForm,
  CreateReschedulePayload,
  ReadReschedule,
  ReadRescheduleSesi,
} from "../../../common/types/reschedule";

const SesiRescheduleRequest = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const [isChanged, setIsChanged] = useState(false);
  const [formState, setFormState] = useState([] as CreateRescheduleForm[]);
  const [payload, setPayload] = useState([] as CreateReschedulePayload[]);
  const [alasan, setAlasan] = useState("");
  const [detailNumber, setDetailNumber] = useState(0);
  const [alasanNumber, setAlasanNumber] = useState(0);

  const {
    isLoading: fetchDataIsLoading,
    error: fetchDataError,
    data: fetchData,
  } = useQuery({
    queryKey: ["rescheduleKelas"],
    queryFn: () =>
      fetchWithToken(`/reschedule/${id}`).then((res) => res.json()),
  });

  useEffect(() => {
    if (fetchData) {
      setFormState([]);
      fetchData.content.listSesiReschedule.map(
        (sesiReschedule: ReadRescheduleSesi) => {
          let createRescheduletemp: CreateRescheduleForm = {
            sesiKelasId: sesiReschedule.sesiKelas.sesi_id,
            tanggalBaru: sesiReschedule.activeRescheduleDate,
            waktuBaru: sesiReschedule.activeRescheduleTime,
            alasan: "",
            ischanged: false,
          };
          setFormState((prev) => [...prev, createRescheduletemp]);
        }
      );
    }
  }, [fetchData]);

  if (fetchDataIsLoading) return <Loading />;

  const listSesiReschedule: ReadRescheduleSesi[] =
    fetchData.content.listSesiReschedule;

  function pad(number, length) {
    return (number < 10 ? "0" : "") + number;
  }
  const handleSubmit = () => {
    console.log("SUBMIT");
  };

  return (
    <div>
      <div className="my-5">
        {true && !isChanged && (
          <div className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2">
            Berhasil membuat permintaan reschedule
          </div>
        )}
        {true && !isChanged && (
          <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
            Gagal membuat permintaan reschedule
          </div>
        )}
        {fetchDataError && !isChanged && (
          <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
            gagal mengambil data sesi
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <div className="shadow-lg rounded-lg ">
            <table data-testid={id} className="table-auto w-full">
              <thead className="bg-baseForeground rounded-t-lg">
                <tr>
                  <th className={`px-6 py-6 text-left bg-baseForeground `}>
                    Pertemuan
                  </th>
                  <th className={`px-6 py-6 text-left bg-baseForeground `}>
                    Tanggal Awal
                  </th>
                  <th className={`px-6 py-6 text-left bg-baseForeground `}>
                    Waktu Awal
                  </th>
                  <th className={`px-6 py-6 text-left bg-baseForeground `}>
                    Status
                  </th>
                  <th className={`px-6 py-6 text-left bg-baseForeground `}>
                    Tanggal Baru
                  </th>
                  <th className={`px-6 py-6 text-left bg-baseForeground `}>
                    Waktu Baru
                  </th>
                  <th className={`px-10 py-6 text-left bg-baseForeground `}>
                    Riwayat
                  </th>
                  <th className={`px-10 py-6 text-left bg-baseForeground `}>
                    Alasan
                  </th>
                  <th className={`px-10 py-6 text-left bg-baseForeground `}>
                    Platform
                  </th>
                </tr>
              </thead>

              {listSesiReschedule.map((sesiReschedule, sessionIndex) => (
                <tbody
                  key={`sesi-tbody-${sesiReschedule.sesiKelas.sesi_id}`}
                  className={styles.table_items_text}
                >
                  <tr key={`sesi-${sesiReschedule.sesiKelas.sesi_id}`}>
                    <td className="border-b pl-10 px-6 py-6">
                      {sessionIndex + 1}
                    </td>
                    <td className="border-b px-6 py-6">
                      {new Date(
                        sesiReschedule.sesiKelas.waktuPelaksanaan
                      ).toLocaleDateString()}
                    </td>
                    <td className="border-b px-6 py-6">
                      {new Date(
                        sesiReschedule.sesiKelas.waktuPelaksanaan
                      ).toLocaleTimeString([], { timeStyle: "short" })}
                    </td>
                    <td className="border-b px-6 py-6">
                      {sesiReschedule.sesiKelas.status}
                    </td>

                    <td className="border-b mx-4 px-4 py-5">
                      <input
                        type="date"
                        required={formState[sessionIndex]?.ischanged}
                        disabled={
                          sesiReschedule.sesiKelas.status !== "Scheduled" ||
                          !formState[sessionIndex]?.ischanged
                        }
                        value={
                          formState[sessionIndex]?.tanggalBaru
                            ? formState[sessionIndex].tanggalBaru
                            : ""
                        }
                        className={`${styles.placeholder} relative block px-5 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC]  focus:text-black focus:z-10 disabled:opacity-50`}
                      />
                    </td>
                    <td className="border-b mx-4 px-4 py-5">
                      <input
                        required={formState[sessionIndex]?.ischanged}
                        type="time"
                        disabled={
                          sesiReschedule.sesiKelas.status !== "Scheduled" ||
                          !formState[sessionIndex]?.ischanged
                        }
                        value={
                          formState[sessionIndex]?.waktuBaru
                            ? formState[sessionIndex].waktuBaru
                            : ""
                        }
                        className={`${styles.placeholder} relative block px-5 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC]  focus:text-black focus:z-10 disabled:opacity-50`}
                      />
                    </td>
                    <td className="border-b pl-8 px-6 py-6">
                      <button
                        disabled={sesiReschedule.listReschedule.length == 0}
                        onClick={(e) => {
                          e.preventDefault();
                          setDetailNumber(
                            detailNumber == sessionIndex ? -1 : sessionIndex
                          );
                        }}
                        className={`bg-transparent hover:bg-[#215E9B] text-[#215E9B]  hover:text-white py-2 px-4 border border-[#215E9B] hover:border-transparent rounded-full disabled:opacity-50 relative`}
                      >
                        Riwayat
                      </button>
                    </td>
                    <td className="border-b pl-8 px-6 py-6">
                      <button
                        disabled={sesiReschedule.listReschedule.length == 0}
                        onClick={(e) => {
                          e.preventDefault();
                          setAlasanNumber(
                            alasanNumber == sessionIndex ? -1 : sessionIndex
                          );
                        }}
                        className={`bg-transparent hover:bg-[#215E9B] text-[#215E9B]  hover:text-white py-2 px-4 border border-[#215E9B] hover:border-transparent rounded-full disabled:opacity-50 relative`}
                      >
                        Alasan
                      </button>
                    </td>
                    <td className="border-b pl-8 px-6 py-6">
                      <button
                        disabled={sesiReschedule.listReschedule.length == 0}
                        className={`bg-transparent hover:bg-[#215E9B] text-[#215E9B]  hover:text-white py-2 px-4 border border-[#215E9B] hover:border-transparent rounded-full disabled:opacity-50 relative`}
                      >
                        Zoom1
                      </button>
                    </td>
                  </tr>
                  {detailNumber == sessionIndex &&
                    sesiReschedule.listReschedule[
                      sesiReschedule.listReschedule.length - 1
                    ] && (
                      <>
                        <tr>
                          <td className="py-2 px-8">
                            <span>Tanngal Permintaan</span>
                          </td>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />

                          <td className="py-2 px-12">
                            <span>Status</span>
                          </td>
                        </tr>
                        {sesiReschedule.listReschedule.map(
                          (reschedule: ReadReschedule) => (
                            <tr aria-colspan={4} key={`tr-${reschedule.id}`}>
                              <td className="py-2 px-8">
                                <span>
                                  {reschedule.waktuPermintaan.split(" ")[0]}
                                </span>
                              </td>
                              <td />
                              <td />
                              <td />
                              <td />
                              <td></td>
                              <td className="py-2 px-16">
                                <span>
                                  {new Date(
                                    reschedule.waktuBaru
                                  ).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="py-2 px-8">
                                <span>
                                  {new Date(
                                    reschedule.waktuBaru
                                  ).toLocaleTimeString([], {
                                    timeStyle: "short",
                                  })}
                                </span>
                              </td>

                              <td className="py-2 px-8">
                                <span>{reschedule.status}</span>
                              </td>
                            </tr>
                          )
                        )}
                      </>
                    )}
                  {alasanNumber == sessionIndex &&
                    sesiReschedule.listReschedule[
                      sesiReschedule.listReschedule.length - 1
                    ] && (
                      <>
                        <tr>
                          <td colSpan={8} className="py-2 px-8">
                            <span>Alasan</span>
                          </td>
                        </tr>

                        <tr>
                          <td colSpan={8} className="py-2 px-8 ">
                            <span>
                              {sesiReschedule.activeReschedule != null
                                ? sesiReschedule.activeReschedule.alasan
                                : ""}
                            </span>
                          </td>
                        </tr>
                      </>
                    )}
                </tbody>
              ))}
            </table>
          </div>
        </div>

        <div>
          <div className="flex justify-center py-7 gap-4">
            <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
              Terima
            </button>
            <button className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover">
              Tolak
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SesiRescheduleRequest;
