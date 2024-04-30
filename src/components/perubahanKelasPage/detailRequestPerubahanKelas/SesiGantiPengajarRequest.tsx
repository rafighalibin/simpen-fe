"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useParams } from "next/navigation";
import Loading from "../../../app/loading";
import styles from "./DetailPerubahanKelas.module.css";
import {
  CreateGantiPengajarForm,
  CreateGantiPengajarPayload,
  ReadGantiPengajar,
  ReadGantiPengajarSesi,
} from "../../../common/types/gantiPengajar";
import { PengajarSelect } from "../../../common/types/pengajar";
import useFetchPengajar from "../../../common/hooks/user/useFetchPengajar";
import Select from "react-select";

const SesiGantiPengajarRequest = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const [isChanged, setIsChanged] = useState(false);
  const [formState, setFormState] = useState([] as CreateGantiPengajarForm[]);
  const [payload, setPayload] = useState([] as CreateGantiPengajarPayload[]);
  const [alasan, setAlasan] = useState("");
  const [detailNumber, setDetailNumber] = useState(null);
  const [alasanNumber, setAlasanNumber] = useState(null);
  const [pengajarSelected, setPengajarSelected] =
    useState<PengajarSelect>(null);
  const queryClient = useQueryClient();

  const { isLoading: listUserLoading, listPengajarExisting } =
    useFetchPengajar();
  const {
    isLoading: fetchDataIsLoading,
    error: fetchDataError,
    data: fetchData,
  } = useQuery({
    queryKey: ["gantiPengajarKelas"],
    queryFn: () =>
      fetchWithToken(`/ganti-pengajar/${id}`).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const {
    mutateAsync: updateGantiPengajarMutation,
    isLoading: updateGantiPengajarIsLoading,
    data: updateGantiPengajarResponse,
    isSuccess: updateGantiPengajarSuccess,
    isError: updateGantiPengajarError,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/ganti-pengajar/${id}`, "PUT", payload).then((res) =>
        res.json()
      ),
    onSuccess: () => {
      setIsChanged(false);
      queryClient.invalidateQueries("gantiPengajarKelas");
    },
  });

  useEffect(() => {
    if (fetchData) {
      setFormState([]);
      fetchData.content.listSesiGantiPengajar.map(
        (sesiGantiPengajar: ReadGantiPengajarSesi) => {
          let createGantiPengajartemp: CreateGantiPengajarForm = {
            id: sesiGantiPengajar.activeGantiPengajar?.id,
            sesiKelasId: sesiGantiPengajar.sesiKelas.sesi_id,
            alasan: "",
            ischanged: false,
            pengajarPenggantiId: "",
          };
          setFormState((prev) => [...prev, createGantiPengajartemp]);
        }
      );
    }
  }, [fetchData]);

  const handleChangePengajar = (e, sessionIndex) => {
    const { value } = e;
    setIsChanged(true);
    let CreateGantiPengajarFormTemp: CreateGantiPengajarForm =
      formState[sessionIndex];
    CreateGantiPengajarFormTemp.pengajarPenggantiId = e.value;
    CreateGantiPengajarFormTemp.ischanged = true;
    setFormState((prev) => {
      prev[sessionIndex] = CreateGantiPengajarFormTemp;
      return [...prev];
    });
  };
  if (fetchDataIsLoading) return <Loading />;

  const listSesiGantiPengajar: ReadGantiPengajarSesi[] =
    fetchData.content.listSesiGantiPengajar;

  const handleSubmit = (isApproved: Boolean) => {
    setPayload([]);
    let payloadListTemp: CreateGantiPengajarPayload[] = [];

    formState.forEach((element) => {
      if (element.id) {
        let payloadTemp: CreateGantiPengajarPayload = {
          id: element.id,
          sesiKelasId: element.sesiKelasId,
          pengajarPenggantiId: isApproved ? element.pengajarPenggantiId : null,
          alasan: alasan,
        };
        payloadListTemp.push(payloadTemp);
      }
    });
    payload.push(...payloadListTemp);
    console.log(payload);
    updateGantiPengajarMutation();
  };

  return (
    <div>
      <div className="my-5">
        {updateGantiPengajarSuccess && !isChanged && (
          <div className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2">
            Berhasil update permintaan ganti pengajar
          </div>
        )}
        {updateGantiPengajarError && !isChanged && (
          <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
            Gagal update permintaan ganti pengajar
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
                  <th className={`px-4 py-6 text-left bg-baseForeground `}>
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

                  <th className={`px-10 py-6 text-left bg-baseForeground `}>
                    Riwayat
                  </th>
                  <th className={`px-10 py-6 text-left bg-baseForeground `}>
                    Pengajar Penganti
                  </th>
                </tr>
              </thead>

              {listSesiGantiPengajar.map((sesiGantiPengajar, sessionIndex) => (
                <tbody
                  key={`sesi-tbody-${sesiGantiPengajar.sesiKelas.sesi_id}`}
                  className={styles.table_items_text}
                >
                  <tr key={`sesi-${sesiGantiPengajar.sesiKelas.sesi_id}`}>
                    <td className="border-b pl-10 px-6 py-6 ">
                      {sessionIndex + 1}
                    </td>
                    <td className="border-b px-6 py-6">
                      {new Date(
                        sesiGantiPengajar.sesiKelas.waktuPelaksanaan
                      ).toLocaleDateString()}
                    </td>
                    <td className="border-b px-6 py-6">
                      {new Date(
                        sesiGantiPengajar.sesiKelas.waktuPelaksanaan
                      ).toLocaleTimeString([], { timeStyle: "short" })}
                    </td>
                    <td className="border-b px-6 py-6">
                      {sesiGantiPengajar.sesiKelas.status.indexOf(
                        "Requested"
                      ) >= 0 ? (
                        <span className="text-warning">
                          {sesiGantiPengajar.sesiKelas.status}
                        </span>
                      ) : sesiGantiPengajar.sesiKelas.status == "Finished" ? (
                        <span className="text-success">
                          {sesiGantiPengajar.sesiKelas.status}
                        </span>
                      ) : (
                        <span>{sesiGantiPengajar.sesiKelas.status}</span>
                      )}
                    </td>

                    <td className="border-b pl-8 px-6 py-6">
                      <button
                        disabled={
                          !(sesiGantiPengajar.listGantiPengajar.length >= 1)
                        }
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
                        isDisabled={!sesiGantiPengajar.activeGantiPengajar}
                        defaultValue={pengajarSelected}
                        name="colors"
                        onChange={(e) => handleChangePengajar(e, sessionIndex)}
                        options={listPengajarExisting}
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
                    </td>
                  </tr>
                  {detailNumber == sessionIndex &&
                    sesiGantiPengajar.listGantiPengajar[
                      sesiGantiPengajar.listGantiPengajar.length - 1
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
                          <td className="py-2 border-x">
                            <span>Alasan</span>
                          </td>
                          <td className="py-2 border-x">
                            <span>Status</span>
                          </td>
                          <td className="py-2 border-l">
                            <span>
                              <p>Pengajar</p>
                              <p>Pengganti</p>
                            </span>
                          </td>
                        </tr>
                        {sesiGantiPengajar.listGantiPengajar.map(
                          (gantiPengajar: ReadGantiPengajar) => (
                            <tr
                              aria-colspan={4}
                              key={`tr-${gantiPengajar.id}`}
                              className="text-center border-b"
                            >
                              <td className="py-2 border-r">
                                <span>
                                  {gantiPengajar.waktuPermintaan.split(" ")[0]}
                                </span>
                              </td>
                              <td />
                              <td />
                              <td className="py-2 border-x">
                                <span>{gantiPengajar.alasan}</span>
                              </td>
                              <td className="py-2 border-x">
                                {gantiPengajar.status == "Requested" ? (
                                  <span className="text-warning py-1 px-4">
                                    {gantiPengajar.status}
                                  </span>
                                ) : gantiPengajar.status == "Approved" ? (
                                  <span className="text-success py-1 px-4">
                                    {gantiPengajar.status}
                                  </span>
                                ) : gantiPengajar.status == "Rejected" ? (
                                  <span className="text-error py-1 px-4">
                                    {gantiPengajar.status}
                                  </span>
                                ) : (
                                  <span>{gantiPengajar.status}</span>
                                )}
                              </td>
                              <td className="py-2 border-l">
                                <span>
                                  {gantiPengajar.namaPengajarPenggati && (
                                    <a
                                      className={`bg-transparent hover:bg-[#215E9B] text-[#215E9B]  hover:text-white py-1 px-4 border border-[#215E9B] hover:border-transparent rounded-full disabled:opacity-50 relative`}
                                      href={`/pengajar/${gantiPengajar.idPengajarPengganti}`}
                                    >
                                      {gantiPengajar.namaPengajarPenggati}
                                    </a>
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
              disabled={!isChanged || updateGantiPengajarIsLoading}
              className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover disabled:opacity-50"
            >
              {updateGantiPengajarIsLoading ? (
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
              disabled={isChanged || updateGantiPengajarIsLoading}
            >
              {updateGantiPengajarIsLoading ? (
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

export default SesiGantiPengajarRequest;
