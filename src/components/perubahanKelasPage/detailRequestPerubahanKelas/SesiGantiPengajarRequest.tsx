"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
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
  const [detailNumber, setDetailNumber] = useState(0);
  const [alasanNumber, setAlasanNumber] = useState(0);
  const [pengajarSelected, setPengajarSelected] =
    useState<PengajarSelect>(null);

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

  useEffect(() => {
    if (fetchData) {
      setFormState([]);
      fetchData.content.listSesiGantiPengajar.map(
        (sesiGantiPengajar: ReadGantiPengajarSesi) => {
          let createGantiPengajartemp: CreateGantiPengajarForm = {
            sesiKelasId: sesiGantiPengajar.sesiKelas.sesi_id,

            alasan: "",
            ischanged: false,
          };
          setFormState((prev) => [...prev, createGantiPengajartemp]);
        }
      );
    }
  }, [fetchData]);
  const handleChangePengajar = (e) => {
    const { value } = e;
    setFormState((prev) => ({ ...prev, pengajarId: value }));
  };
  if (fetchDataIsLoading) return <Loading />;

  const listSesiGantiPengajar: ReadGantiPengajarSesi[] =
    fetchData.content.listSesiGantiPengajar;

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
            Berhasil membuat permintaan gantiPengajar
          </div>
        )}
        {true && !isChanged && (
          <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
            Gagal membuat permintaan gantiPengajar
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

                  <th className={`px-10 py-6 text-left bg-baseForeground `}>
                    Riwayat
                  </th>
                  <th className={`px-10 py-6 text-left bg-baseForeground `}>
                    Alasan
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

                    <td className="border-b pl-8 px-6 py-6">
                      <button
                        disabled={!sesiGantiPengajar.activeGantiPengajar}
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
                        disabled={!sesiGantiPengajar.activeGantiPengajar}
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
                      <Select
                        isDisabled={!sesiGantiPengajar.activeGantiPengajar}
                        defaultValue={pengajarSelected}
                        name="colors"
                        onChange={handleChangePengajar}
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
                        <tr>
                          <td className="py-2 px-8">
                            <span>Tanngal Permintaan</span>
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
                              <td className="py-2 px-8">
                                <span>
                                  {gantiPengajar.waktuPermintaan.split(" ")[0]}
                                </span>
                              </td>
                              <td />
                              <td />
                              <td />
                              <td />
                              <td>
                                <span>
                                  {gantiPengajar.namaPengajarPenggati}
                                </span>
                              </td>

                              <td className="py-2 px-8">
                                <span>{gantiPengajar.status}</span>
                              </td>
                            </tr>
                          )
                        )}
                      </>
                    )}
                  {alasanNumber == sessionIndex &&
                    sesiGantiPengajar.listGantiPengajar[
                      sesiGantiPengajar.listGantiPengajar.length - 1
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
                              {sesiGantiPengajar.activeGantiPengajar != null
                                ? sesiGantiPengajar.activeGantiPengajar.alasan
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

export default SesiGantiPengajarRequest;
