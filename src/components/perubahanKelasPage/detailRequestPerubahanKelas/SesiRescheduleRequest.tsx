"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
import { ZoomSelect } from "../../../common/types/platform";
import Select from "react-select";

const SesiRescheduleRequest = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const [isChanged, setIsChanged] = useState(false);
  const [formState, setFormState] = useState([] as CreateRescheduleForm[]);
  const [payload, setPayload] = useState([] as CreateReschedulePayload[]);
  const [hasWarning, setHasWarning] = useState([] as Boolean[]);
  const [alasan, setAlasan] = useState("");
  const [detailNumber, setDetailNumber] = useState(null);
  const [listZoomAvalaible, setListZoomAvalaible] = useState<ZoomSelect[][]>(
    []
  );
  const [listZoomSelected, setListZoomSelected] = useState<ZoomSelect[]>([]);
  const queryClient = useQueryClient();

  const {
    isLoading: fetchZoomAvalaibleIsLoading,
    error: fetchZoomAvalaibleError,
    isSuccess: fetchZoomAvalaibleIsSuccess,
    data: fetchZoomAvalaible = [] as ZoomSelect[][],
  } = useQuery({
    queryKey: ["zoomAvalaible"],
    queryFn: () =>
      fetchWithToken(`/platform?zoom&kelasId=${id}`).then((res) => res.json()),

    onSuccess: (data) => {
      data.content.map((platform: any, index: number) => {
        let temp: ZoomSelect[] = [];
        platform.map((zoom: any) => {
          temp.push({
            value: zoom.id,
            label: zoom.nama,
          });
        });
        setListZoomAvalaible((prev) => [...prev, temp]);
      });
    },
  });

  const {
    isLoading: fetchDataIsLoading,
    isSuccess: fetchDataIsSuccess,
    error: fetchDataError,
    data: fetchData,
  } = useQuery({
    queryKey: ["rescheduleKelas"],
    queryFn: () =>
      fetchWithToken(`/reschedule/${id}`).then((res) => res.json()),
    onSuccess: (data) => {
      data.content.listSesiReschedule.map(
        (sesiReschedule: ReadRescheduleSesi, index: number) => {
          let selectedZoom: ZoomSelect = {
            value: sesiReschedule.sesiKelas.zoom.id,
            label: sesiReschedule.sesiKelas.zoom.nama,
          };

          setListZoomSelected((prev) => [...prev, selectedZoom]);
        }
      );
    },
  });

  const checkZoomAvalaible = (zoomSelect: ZoomSelect, index: number) => {
    let found: boolean = false;

    if (!listZoomAvalaible[index]) return false;

    listZoomAvalaible[index].forEach((zoom) => {
      if (zoom.value == zoomSelect.value) {
        found = true;
      }
    });
    return found;
  };

  const {
    mutateAsync: updateRescheduleMutation,
    isLoading: updateRescheduleIsLoading,
    data: updateRescheduleResponse,
    isSuccess: updateRescheduleSuccess,
    isError: updateRescheduleError,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/reschedule/${id}`, "PUT", payload).then((res) =>
        res.json()
      ),
    onSuccess: () => {
      setIsChanged(false);
      setListZoomSelected([]);
      queryClient.invalidateQueries("rescheduleKelas");
    },
  });

  useEffect(() => {
    if (fetchData && listZoomAvalaible.length > 0) {
      setFormState([]);
      fetchData.content.listSesiReschedule.map(
        (sesiReschedule: ReadRescheduleSesi, index: number) => {
          let createRescheduletemp: CreateRescheduleForm = {
            id: sesiReschedule.activeReschedule?.id,
            sesiKelasId: sesiReschedule.sesiKelas.sesi_id,
            tanggalBaru: sesiReschedule.activeRescheduleDate,
            waktuBaru: sesiReschedule.activeRescheduleTime,
            zoomId: checkZoomAvalaible(listZoomSelected[index], index)
              ? listZoomSelected[index].value
              : null,
            alasan: "",
            ischanged: false,
          };
          setFormState((prev) => [...prev, createRescheduletemp]);
        }
      );

      listZoomSelected.map((zoomSelect, index) => {
        if (
          !checkZoomAvalaible(zoomSelect, index) &&
          listZoomAvalaible[index] &&
          listZoomAvalaible[index].length > 0
        ) {
          setHasWarning((prev) => {
            prev[index] = true;
            return [...prev];
          });
        }
      });
    }
  }, [fetchData, listZoomAvalaible]);

  if (fetchDataIsLoading) return <Loading />;

  const listSesiReschedule: ReadRescheduleSesi[] =
    fetchData.content.listSesiReschedule;

  function pad(number, length) {
    return (number < 10 ? "0" : "") + number;
  }

  const handleChangeZoom = (e, sessionIndex) => {
    const { value } = e;
    setIsChanged(true);
    let CreateGantiPengajarFormTemp: CreateRescheduleForm =
      formState[sessionIndex];
    CreateGantiPengajarFormTemp.zoomId = e.value;
    CreateGantiPengajarFormTemp.ischanged = true;
    setFormState((prev) => {
      prev[sessionIndex] = CreateGantiPengajarFormTemp;
      return [...prev];
    });

    listZoomSelected.map((e, index) => {
      if (
        !checkZoomAvalaible(e, index) &&
        listZoomAvalaible[index] &&
        listZoomAvalaible[index].length > 0
      ) {
        setHasWarning((prev) => {
          prev[index] = false;
          return [...prev];
        });
      }
    });
  };

  const handleSubmit = (isApproved: Boolean) => {
    setPayload([]);
    let payloadListTemp: CreateReschedulePayload[] = [];

    formState.forEach((element, index) => {
      if (element.id) {
        if (element.zoomId == null && isApproved) {
          setHasWarning((prev) => {
            prev[index] = true;
            return [...prev];
          });
          return;
        }
        let payloadTemp: CreateReschedulePayload = {
          id: element.id,
          sesiKelasId: element.sesiKelasId,
          zoomId: isApproved ? element.zoomId : null,
          alasan: alasan,
        };
        payloadListTemp.push(payloadTemp);
      }
    });
    payload.push(...payloadListTemp);
    updateRescheduleMutation();
  };

  return (
    <div>
      <div className="my-5">
        {updateRescheduleSuccess && !isChanged && (
          <div className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2">
            Berhasil update permintaan reschedule
          </div>
        )}
        {updateRescheduleError && !isChanged && (
          <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
            Gagal update permintaan reschedule
          </div>
        )}{" "}
        {hasWarning.some((warning) => warning) && !isChanged && (
          <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
            Terdapat Konflik Platform
          </div>
        )}
        {fetchDataError && !isChanged && (
          <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
            gagal mengambil data sesi
          </div>
        )}
      </div>

      <form>
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
                      {sesiReschedule.sesiKelas.status.indexOf("Requested") >=
                      0 ? (
                        <span className="text-warning">
                          {sesiReschedule.sesiKelas.status}
                        </span>
                      ) : sesiReschedule.sesiKelas.status == "Finished" ? (
                        <span className="text-success">
                          {sesiReschedule.sesiKelas.status}
                        </span>
                      ) : (
                        <span>{sesiReschedule.sesiKelas.status}</span>
                      )}
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
                      <Select
                        isDisabled={!sesiReschedule.activeReschedule}
                        defaultValue={listZoomSelected[sessionIndex]}
                        name="colors"
                        onChange={(e) => handleChangeZoom(e, sessionIndex)}
                        options={listZoomAvalaible[sessionIndex]}
                        className="bg-base mt-1 p-2 w-full border rounded-md"
                        classNamePrefix="select"
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            border: "none",
                            boxShadow: "none",
                            backgroundColor: "none",
                          }),
                          multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: "#EDF6FF",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected
                              ? "#215E9B"
                              : provided.backgroundColor,
                            color: state.isSelected ? "white" : provided.color,
                            fontWeight: state.isSelected
                              ? "bold"
                              : provided.fontWeight,
                          }),
                        }}
                      />
                      {hasWarning[sessionIndex] && (
                        <p className="text-xs text-red-500">
                          *Platform Konflik, silahkan pilih platform lain
                        </p>
                      )}
                    </td>
                  </tr>
                  {detailNumber == sessionIndex &&
                    sesiReschedule.listReschedule[
                      sesiReschedule.listReschedule.length - 1
                    ] && (
                      <>
                        <tr className="text-center font-bold border-b ">
                          <td className="py-2 border-r">
                            <span>
                              <p>Tanggal</p>
                              <p>Permintaan</p>
                            </span>
                          </td>
                          <td />
                          <td />
                          <td />
                          <td className="py-2 border-x">
                            <span>Alasan</span>
                          </td>
                          <td className="py-2 border-x">
                            <span>Status</span>
                          </td>
                          <td className="py-2 border-l">
                            <span>Tanggal Baru</span>
                          </td>
                          <td className="py-2 border-l">
                            <span>Waktu Baru</span>
                          </td>
                        </tr>
                        {sesiReschedule.listReschedule.map(
                          (reschedule: ReadReschedule) => (
                            <tr
                              aria-colspan={4}
                              key={`tr-${reschedule.id}`}
                              className="text-center border-b"
                            >
                              <td className="py-2 border-r">
                                <span>
                                  {reschedule.waktuPermintaan.split(" ")[0]}
                                </span>
                              </td>
                              <td />
                              <td />
                              <td />
                              <td className="py-2 border-x">
                                <span>{reschedule.alasan}</span>
                              </td>
                              <td className="py-2 border-x">
                                {reschedule.status == "Requested" ? (
                                  <span className="text-warning py-1 px-4">
                                    {reschedule.status}
                                  </span>
                                ) : reschedule.status == "Approved" ? (
                                  <span className="text-success py-1 px-4">
                                    {reschedule.status}
                                  </span>
                                ) : reschedule.status == "Rejected" ? (
                                  <span className="text-error py-1 px-4">
                                    {reschedule.status}
                                  </span>
                                ) : (
                                  <span>{reschedule.status}</span>
                                )}
                              </td>
                              <td className="py-2 border-x">
                                <span>
                                  {reschedule.waktuBaru && (
                                    <span>
                                      {new Date(
                                        reschedule.waktuBaru
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </span>
                              </td>
                              <td className="py-2 border-l">
                                <span>
                                  {reschedule.waktuBaru && (
                                    <span>
                                      {new Date(
                                        reschedule.waktuBaru
                                      ).toLocaleTimeString([], {
                                        timeStyle: "short",
                                      })}
                                    </span>
                                  )}
                                </span>
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

        <div>
          <div className="flex justify-center py-7 gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(true);
              }}
              disabled={!isChanged || updateRescheduleIsLoading}
              className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover disabled:opacity-50"
            >
              {updateRescheduleIsLoading ? (
                <div className="inset-0 flex items-center justify-center gap-2">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
                  <span>On Progress</span>
                </div>
              ) : (
                "Terima"
              )}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(false);
              }}
              className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover disabled:opacity-50"
              disabled={isChanged || updateRescheduleIsLoading}
            >
              {updateRescheduleIsLoading ? (
                <div className="inset-0 flex items-center justify-center gap-2">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
                  <span>On Progress</span>
                </div>
              ) : (
                "Tolak"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SesiRescheduleRequest;
