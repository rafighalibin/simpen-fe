"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";

//import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../../font/font";
import styles from "./addForm.module.css";

//import component
import useFetchWithToken from "../../../common/hooks/fetchWithToken";

export const AddForm = () => {
  const queryClient = useQueryClient();
  const fetchWithToken = useFetchWithToken();
  const [error, setError] = useState("");
  const [succces, setSuccess] = useState("");
  const router = useRouter();
  const [formState, setFormState] = useState({
    nama: "",
    tanggalLahir: "",
    namaOrtu: "",
    emailOrtu: "",
    noHpOrtu: "",
    note: "",
  });

  const {
    mutateAsync: addMuridMutation,
    data: response,
    isLoading: createMuridIsLoading,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/murid`, "POST", formState).then((res) => res.json()),
    onSuccess: (data) => {
      if (data.code == 200) {
        console.log(data.content);
        setSuccess("Sukses mendaftarkan.");
        queryClient.invalidateQueries("murid");
        setTimeout(() => {
          router.push("/murid");
        }, 1000);
      } else if (data.code == 400) {
        setError(data.message);
        setFormState({
          nama: "",
          tanggalLahir: "",
          namaOrtu: "",
          emailOrtu: "",
          noHpOrtu: "",
          note: "",
        });
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMuridMutation();
  };

  return (
    <div>
      <div
        className={`${styles.heading} text-center my-10`}
        style={PoppinsBold.style}
      >
        Register Murid
      </div>
      <div className={`${styles.card_form} px-7 py-8 mb-12`}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div className="mt-8">
              <div
                style={InterMedium.style}
                className={`${styles.form_title} mb-3`}
              >
                Nama Lengkap
              </div>
              <input
                id="full-name"
                name="name"
                type="name"
                autoComplete="name"
                required
                className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                placeholder="Nama Lengkap"
                onChange={(e) =>
                  setFormState({ ...formState, nama: e.target.value })
                }
                value={formState.nama}
                style={InterReguler.style}
              />
            </div>

            <div className="mt-8">
              <div
                style={InterMedium.style}
                className={`${styles.form_title} mb-3`}
              >
                Tanggal Lahir
              </div>
              <input
                id="tanggalLahir"
                name="tanggalLahir"
                type="date"
                autoComplete="tanggalLahir"
                required
                className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                placeholder="Tanggal Lahir"
                onChange={(e) =>
                  setFormState({ ...formState, tanggalLahir: e.target.value })
                }
                value={formState.tanggalLahir}
                style={InterReguler.style}
              />
            </div>

            <div className="mt-8">
              <div
                style={InterMedium.style}
                className={`${styles.form_title} mb-3`}
              >
                Nama Lengkap Orang Tua
              </div>
              <input
                id="namaOrtu"
                name="namaOrtu"
                type="name"
                autoComplete="name"
                required
                className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                placeholder="Nama Lengkap Orang Tua"
                onChange={(e) =>
                  setFormState({ ...formState, namaOrtu: e.target.value })
                }
                value={formState.namaOrtu}
                style={InterReguler.style}
              />
            </div>

            <div className="mt-8">
              <div
                style={InterMedium.style}
                className={`${styles.form_title} mb-3`}
              >
                Email Orang Tua
              </div>
              <input
                id="emailOrtu"
                name="emailOrtu"
                type="name"
                autoComplete="email"
                required
                className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                placeholder="Email Orang Tua"
                onChange={(e) =>
                  setFormState({ ...formState, emailOrtu: e.target.value })
                }
                value={formState.emailOrtu}
                style={InterReguler.style}
              />
            </div>

            <div className="mt-8">
              <div
                style={InterMedium.style}
                className={`${styles.form_title} mb-3`}
              >
                Nomor Handphone Orang Tua
              </div>
              <input
                id="noHpOrtu"
                name="noHpOrtu"
                type="text"
                autoComplete="phone"
                required
                className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                placeholder="HP Orang Tua"
                onChange={(e) =>
                  setFormState({ ...formState, noHpOrtu: e.target.value })
                }
                value={formState.noHpOrtu}
                style={InterReguler.style}
              />
            </div>

            <div className="mt-8">
              <div
                style={InterMedium.style}
                className={`${styles.form_title} mb-3`}
              >
                Catatan Murid
              </div>

              <input
                id="note"
                name="note"
                type="textarea"
                autoComplete="phone"
                className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                placeholder="ex: Handal dalam matematika, suka membaca, dll."
                onChange={(e) =>
                  setFormState({ ...formState, note: e.target.value })
                }
                value={formState.note}
                style={InterReguler.style}
              />
            </div>
          </div>

          <div className="mt-5">
            {succces && (
              <div
                className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2"
                style={InterReguler.style}
              >
                {succces}
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
          </div>
          <div className="flex justify-center gap-4 pt-12">
            <button
              type="submit"
              className={`${styles.button_tx} ${styles.edit_btn} disabled:opacity-50 relative`}
              disabled={createMuridIsLoading}
            >
              {createMuridIsLoading ? (
                <div className="inset-0 flex items-center justify-center gap-2">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
                  <span>On Progress</span>
                </div>
              ) : (
                "Tambah Murid"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
