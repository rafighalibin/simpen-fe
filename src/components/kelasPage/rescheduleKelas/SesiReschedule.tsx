"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useParams } from "next/navigation";
import Loading from "../../../app/loading";
import styles from "./SesiAbsen.module.css";
import {
  CreateRescheduleForm,
  CreateReschedulePayload,
  ReadReschedule,
  ReadSesiReschedule,
} from "../../../common/types/reschedule";

const SesiReschedule = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const [isChanged, setIsChanged] = useState(false);
  const [formState, setFormState] = useState([] as CreateRescheduleForm[]);
  const [payload, setPayload] = useState([] as CreateReschedulePayload[]);
  const [alasan, setAlasan] = useState("");
  const [detailNumber, setDetailNumber] = useState(0);
  const queryClient = useQueryClient();

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
      fetchData.content.listSesiReschedule.map(
        (sesiReschedule: ReadSesiReschedule) => {
          let listReschedule: ReadReschedule[] = sesiReschedule.listReschedule;
          let latestReschedule = new Date(
            listReschedule[listReschedule.length - 1]?.waktuBaru
          );

          let createRescheduletemp: CreateRescheduleForm = {
            sesiKelasId: sesiReschedule.sesiKelas.sesi_id,
            tanggalBaru: "",
            waktuBaru: "",
            alasan: "",
            ischanged: false,
          };
          formState.push(createRescheduletemp);
        }
      );
    }
  }, [fetchData]);

  const handleInputChange = (sessionIndex, field, value) => {
    formState[sessionIndex][field] = value;
    setFormState([...formState]);
    setIsChanged(true);
    for (let index = 0; index < formState.length; index++) {
      if (formState[index].ischanged) {
        setIsChanged(true);
        return;
      }
    }
    console.log(
      "formState[sessionIndex][field]",
      formState[sessionIndex][field]
    );
    setIsChanged(false);
  };

  const {
    mutateAsync: createRescheduleMutation,
    isLoading: createRescheduleIsLoading,
    data: createRescheduleResponse,
    isSuccess: createRescheduleSuccess,
    isError: createRescheduleError,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/reschedule/create/${id}`, "POST", payload).then((res) =>
        res.json()
      ),
    onSuccess: () => {
      setIsChanged(false);
      queryClient.invalidateQueries("rescheduleKelas");
    },
  });

  if (fetchDataIsLoading) return <Loading />;

  const listSesiReschedule: ReadSesiReschedule[] =
    fetchData.content.listSesiReschedule;

  const handleSubmit = () => {
    setPayload([]);
    let payloadListTemp: CreateReschedulePayload[] = [];

    formState.forEach((element) => {
      if (element.ischanged) {
        console.log(
          "element",
          combineDateTime(element.tanggalBaru, element.waktuBaru)
        );
        let payloadTemp: CreateReschedulePayload = {
          sesiKelasId: element.sesiKelasId,
          waktuBaru: combineDateTime(element.tanggalBaru, element.waktuBaru),
          alasan: alasan,
          ischanged: element.ischanged,
        };
        payloadListTemp.push(payloadTemp);
      }
    });
    payload.push(...payloadListTemp);
    createRescheduleMutation();
  };

  function combineDateTime(dateString, timeString) {
    // Parse tanggalBaru into a Date object
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    // Parse waktuBaru into hours and minutes
    const timeParts = timeString.split(":");
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    // Format the components into the desired format
    const formattedDateTime = `${pad(month, 2)}-${pad(day, 2)}-${year} ${pad(
      hours,
      2
    )}:${pad(minutes, 2)}:00`;

    return formattedDateTime;
  }

  function pad(number, length) {
    return (number < 10 ? "0" : "") + number;
  }
  return (
    <div>
      <div className="my-5">
        {createRescheduleSuccess && !isChanged && (
          <div className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2">
            Berhasil membuat permintaan reschedule
          </div>
        )}
        {createRescheduleError && !isChanged && (
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
                    Reschedule
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
                    <td className="border-b pl-16 px-6 py-6 ">
                      <input
                        type="checkbox"
                        disabled={
                          sesiReschedule.sesiKelas.status !== "Scheduled"
                        }
                        checked={formState[sessionIndex]?.ischanged || false}
                        onChange={(e) => {
                          handleInputChange(
                            sessionIndex,
                            "ischanged",
                            e.target.checked
                          );
                        }}
                      />
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
                        onChange={(e) =>
                          handleInputChange(
                            sessionIndex,
                            "tanggalBaru",
                            e.target.value
                          )
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
                        onChange={(e) =>
                          handleInputChange(
                            sessionIndex,
                            "waktuBaru",
                            e.target.value
                          )
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
                  </tr>
                  {detailNumber == sessionIndex &&
                    sesiReschedule.listReschedule[
                      sesiReschedule.listReschedule.length - 1
                    ] && (
                      <>
                        <tr>
                          <td className="py-2 px-8">
                            <span>Waktu Permintaan</span>
                          </td>
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
                                <span>{reschedule.waktuPermintaan}</span>
                              </td>
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
                </tbody>
              ))}
            </table>
          </div>
        </div>
        <div className="pt-8">
          <label className="block font-medium text-neutral/70">
            Alasan Reschedule
          </label>
          <textarea
            required={isChanged}
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder="Masukkan alasan reschedule"
            className="h-24 bg-base mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="flex justify-center gap-4 pt-12">
          <button
            type="submit"
            className={`${styles.button_tx} ${styles.edit_btn} disabled:opacity-50 relative`}
            disabled={!isChanged || createRescheduleIsLoading}
          >
            {createRescheduleIsLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
                <span>On Progress</span>
              </div>
            ) : (
              "Buat Permintaan Reschedule"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SesiReschedule;
