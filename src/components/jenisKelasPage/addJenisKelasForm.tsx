"use client";

import React, { useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";


//import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./addJenisKelasForm.module.css";

//import component
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import useFetchAllProgram from "../../common/hooks/program/useFetchAllProgram";

export const AddJenisKelasForm = () => {
  const fetchWithToken = useFetchWithToken();
  const { isLoading: listAllProgramLoading, listAllProgram } = useFetchAllProgram();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [formState, setFormState] = useState({
    jeniskelas: "",
    moda: [],
    tipe: [],
    bahasa: [],
  });

  const { mutateAsync: addJenisKelasMutation, data: response } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/jenis`, "POST", formState).then((res) => res.json()),
    onSuccess: (data) => {
      if (data.code == 200) {
        console.log(data.content);
        setSuccess("Sukses menambahkan.");
        setTimeout(() => {
          router.push("/kelas/jenis");
        }, 1000);
      } else if (data.code == 400) {
        setError("Jenis Kelas sudah pernah ada.");
        setFormState({
          jeniskelas: "",
          moda: [],
          tipe: [],
          bahasa: [],
        });
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addJenisKelasMutation();
  };

  return (
    <div className="">
      <div
        className={`${styles.heading} text-center my-10`}
        style={PoppinsBold.style}
      >
        Tambah Jenis Kelas
      </div>
      <div
        className={`${styles.card_form} sm:px-7 sm:py-8 sm:mb-12 px-5 py-4 mb-8`}
      >
        <form onSubmit={handleSubmit}>
          <div>
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Nama Jenis Kelas
            </div>
            <input
              id="nama-jenis-kelas"
              name="jenis-kelas"
              type="jenis-kelas"
              autoComplete="jenis-kelas"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Nama Jenis Kelas"
              value={formState.jeniskelas}
              onChange={(e) =>
                setFormState({ ...formState, jeniskelas: e.target.value })
              }
              style={InterReguler.style}
            />
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Tipe
            </div>
            <div className="flex items-center">
              {listAllProgram.map((program) => (
                <React.Fragment key={program.id}>
                  <input
                    id={program.id}
                    name="tipe"
                    type="checkbox"
                    value={program.id}
                    checked={formState.tipe.includes(program.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormState({
                          ...formState,
                          tipe: [...formState.tipe, program.id],
                        });
                      } else {
                        setFormState({
                          ...formState,
                          tipe: formState.tipe.filter((t) => t !== program.id),
                        });
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={program.id} className="mr-4">
                    {program.nama}
                  </label>
                </React.Fragment>
              ))}
            </div>
            <div
              style={InterReguler.style}
              className={`${styles.form_paragraph} mt-2`}
            >
              Pilih tipe yang diinginkan.
            </div>
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Moda
            </div>
            <div className="flex items-center">
              <input
                id="online"
                name="moda"
                type="checkbox"
                value="ONLINE"
                checked={formState.moda.includes("ONLINE")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormState({
                      ...formState,
                      moda: [...formState.moda, "ONLINE"],
                    });
                  } else {
                    setFormState({
                      ...formState,
                      moda: formState.moda.filter((m) => m !== "ONLINE"),
                    });
                  }
                }}
                className="mr-2"
              />
              <label htmlFor="online" className="mr-4">
                Online
              </label>
              <input
                id="offline"
                name="moda"
                type="checkbox"
                value="OFFLINE"
                checked={formState.moda.includes("OFFLINE")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormState({
                      ...formState,
                      moda: [...formState.moda, "OFFLINE"],
                    });
                  } else {
                    setFormState({
                      ...formState,
                      moda: formState.moda.filter((m) => m !== "OFFLINE"),
                    });
                  }
                }}
                className="mr-2"
                />
                <label htmlFor="offline">Offline</label>
              </div>
              <div
                style={InterReguler.style}
                className={`${styles.form_paragraph} mt-2`}
              >
                Moda adalah identifier online atau offline.
              </div>
              </div>
              
              <div className="mt-8">
              <div
                style={InterMedium.style}
                className={`${styles.form_title} mb-3`}
              >
                Bahasa
              </div>
              <div className="flex items-center">
                <input
                id="indonesia"
                name="bahasa"
                type="checkbox"
                value="INDONESIA"
                checked={formState.bahasa.includes("INDONESIA")}
                onChange={(e) => {
                  if (e.target.checked) {
                  if (formState.bahasa.length < 2) {
                    setFormState({
                    ...formState,
                    bahasa: [...formState.bahasa, "INDONESIA"],
                    });
                  }
                  } else {
                  setFormState({
                    ...formState,
                    bahasa: formState.bahasa.filter((b) => b !== "INDONESIA"),
                  });
                  }
                }}
                className="mr-2"
                />
                <label htmlFor="indonesia" className="mr-4">
                Indonesia
                </label>
                <input
                id="inggris"
                name="bahasa"
                type="checkbox"
                value="INGGRIS"
                checked={formState.bahasa.includes("INGGRIS")}
                onChange={(e) => {
                  if (e.target.checked) {
                  if (formState.bahasa.length < 2) {
                    setFormState({
                    ...formState,
                    bahasa: [...formState.bahasa, "INGGRIS"],
                    });
                  }
                  } else {
                  setFormState({
                    ...formState,
                    bahasa: formState.bahasa.filter((b) => b !== "INGGRIS"),
                  });
                  }
                }}
                className="mr-2"
                />
                <label htmlFor="inggris">Inggris</label>
              </div>
              <div
                style={InterReguler.style}
                className={`${styles.form_paragraph} mt-2`}
              >
                Pilih maksimal dua bahasa.
              </div>
              </div>
            <div className="mt-5">
              {success && (
              <div
                className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2"
                style={InterReguler.style}
              >
                {success}
              </div>
              )}
              {error && (
              <div
                className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2"
                style={InterReguler.style}
              >
                {error}
              </div>
              )}
              {!listAllProgram.length && (
              <div
                className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2"
                style={InterReguler.style}
              >
                Tambah Program terlebih dahulu bila ingin menambah jenis kelas!
              </div>
              )}
            </div>
            <div className="flex justify-center mt-9">
              {listAllProgram.length > 0 && (
              <button
                type="submit"
                className={`${styles.button_tx} ${styles.btn} hover:bg-[#215E9B] focus:bg-[#215E9B]`}
                style={InterMedium.style}
              >
                Tambah Jenis Kelas
              </button>
              )}
            </div>
            </form>
          </div>
          </div>
        );
};
