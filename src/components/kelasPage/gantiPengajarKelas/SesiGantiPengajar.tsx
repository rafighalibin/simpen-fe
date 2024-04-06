"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useParams } from "next/navigation";
import Loading from "../../../app/loading";
import styles from "./GantiPengajar.module.css";
import {
  ReadGantiPengajar,
  ReadGantiPengajarSesi,
  CreateGantiPengajarForm,
  CreateGantiPengajarPayload,
} from "../../../common/types/gantiPengajar";

const SesiGantiPengajar = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const [isChanged, setIsChanged] = useState(false);
  const [formState, setFormState] = useState([] as CreateGantiPengajarForm[]);
  const [payload, setPayload] = useState([] as CreateGantiPengajarPayload[]);
  const [alasan, setAlasan] = useState("");
  const [detailNumber, setDetailNumber] = useState(0);
  const queryClient = useQueryClient();

  const {
    isLoading: fetchDataIsLoading,
    error: fetchDataError,
    data: fetchData,
  } = useQuery({
    queryKey: ["gantiPengajarKelas"],
    queryFn: () =>
      fetchWithToken(`/ganti-pengajar/${id}`).then((res) => res.json()),
  });

  useEffect(() => {
    if (fetchData) {
      setFormState([]);
      fetchData.content.listSesiGantiPengajar.map(
        (gantiPengajarSesi: ReadGantiPengajarSesi) => {
          let createGantiPengajartemp: CreateGantiPengajarForm = {
            sesiKelasId: gantiPengajarSesi.sesiKelas.sesi_id,
            alasan: "",
            ischanged: false,
          };
          setFormState((prev) => [...prev, createGantiPengajartemp]);
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
    mutateAsync: createGantiPengajarMutation,
    isLoading: createGantiPengajarIsLoading,
    data: createGantiPengajarResponse,
    isSuccess: createGantiPengajarSuccess,
    isError: createGantiPengajarError,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/ganti-pengajar/create/${id}`, "POST", payload).then(
        (res) => res.json()
      ),
    onSuccess: () => {
      setIsChanged(false);
      queryClient.invalidateQueries("gantiPengajarKelas");
    },
  });

  if (fetchDataIsLoading) return <Loading />;

  const listSesiGantiPengajar: ReadGantiPengajarSesi[] =
    fetchData.content.listSesiGantiPengajar;

  const handleSubmit = () => {
    setPayload([]);
    let payloadListTemp: CreateGantiPengajarPayload[] = [];

    formState.forEach((element) => {
      if (element.ischanged) {
        let payloadTemp: CreateGantiPengajarPayload = {
          sesiKelasId: element.sesiKelasId,
          alasan: alasan,
        };
        payloadListTemp.push(payloadTemp);
      }
    });
    payload.push(...payloadListTemp);
    createGantiPengajarMutation();
  };

  return (
    <div>
      <div className="my-5">
        {createGantiPengajarSuccess && !isChanged && (
          <div className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2">
            Berhasil membuat permintaan ganti pengajar
          </div>
        )}
        {createGantiPengajarError && !isChanged && (
          <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
            Gagal membuat permintaan ganti pengajar
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
                    Tanggal
                  </th>
                  <th className={`px-6 py-6 text-left bg-baseForeground `}>
                    Waktu
                  </th>
                  <th className={`px-6 py-6 text-left bg-baseForeground `}>
                    Status
                  </th>
                  <th className={`px-6 py-6 text-left bg-baseForeground `}>
                    Ganti Pengajar
                  </th>
                  <th className={`px-6 py-6 text-left bg-baseForeground `}>
                    Pengajar Pengganti
                  </th>
                  <th className={`px-10 py-6 text-left bg-baseForeground `}>
                    Riwayat
                  </th>
                </tr>
              </thead>

              {listSesiGantiPengajar.map((sesiGantiPengajar, sessionIndex) => (
                <tbody
                  key={`sesi-tbody-${sesiGantiPengajar.sesiKelas.sesi_id}`}
                  className={styles.table_items_text}
                >
                  <tr key={`sesi-${sesiGantiPengajar.sesiKelas.sesi_id}`}>
                    <td className="border-b pl-10 px-6 py-6">
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
                      {sesiGantiPengajar.sesiKelas.status}
                    </td>
                    <td className="border-b pl-16 px-6 py-6 ">
                      <input
                        type="checkbox"
                        disabled={
                          sesiGantiPengajar.sesiKelas.status !== "Scheduled"
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

                    <td className="border-b px-6 py-6">
                      <input
                        disabled
                        type="text"
                        value={
                          sesiGantiPengajar.activeGantiPengajarNamaPengajar ==
                          ""
                            ? "Tidak Ada"
                            : sesiGantiPengajar.activeGantiPengajarNamaPengajar
                        }
                        className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 rounded-md"
                      />
                    </td>

                    <td className="border-b pl-8 px-6 py-6">
                      <button
                        disabled={
                          sesiGantiPengajar.listGantiPengajar.length == 0
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
                  </tr>
                  {detailNumber == sessionIndex &&
                    sesiGantiPengajar.listGantiPengajar[
                      sesiGantiPengajar.listGantiPengajar.length - 1
                    ] && (
                      <>
                        <tr>
                          <td className="py-2 pl-8">
                            <span>Waktu Permintaan</span>
                          </td>
                          <td />
                          <td />
                          <td />
                          <td />
                          <td />

                          <td className="py-2 px-12">
                            <span>Status</span>
                          </td>
                        </tr>
                        {sesiGantiPengajar.listGantiPengajar.map(
                          (gantiPengajar: ReadGantiPengajar) => (
                            <tr aria-colspan={4} key={`tr-${gantiPengajar.id}`}>
                              <td className="py-2 pl-8  flex flex-col items-start">
                                <span>
                                  {gantiPengajar.waktuPermintaan.split(" ")[0]}
                                </span>
                              </td>
                              <td />
                              <td />
                              <td />
                              <td />
                              <td />

                              <td className="py-2 px-8">
                                <span>{gantiPengajar.status}</span>
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
            Alasan Ganti Pengajar
          </label>
          <textarea
            required={isChanged}
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder="Masukkan alasan ganti pengajar"
            className="h-24 bg-base mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="flex justify-center gap-4 pt-12">
          <button
            type="submit"
            className={`${styles.button_tx} ${styles.edit_btn} disabled:opacity-50 relative`}
            disabled={!isChanged || createGantiPengajarIsLoading}
          >
            {createGantiPengajarIsLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
                <span>On Progress</span>
              </div>
            ) : (
              "Buat Permintaan Ganti Pengajar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SesiGantiPengajar;
