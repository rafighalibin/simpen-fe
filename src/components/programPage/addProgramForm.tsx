"use client";

import React, { useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";

//import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./addProgramForm.module.css";

//import component
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import useFetchAllJenisKelas from "../../common/hooks/jeniskelas/useFetchAllJenisKelas";

export const AddProgramForm = () => {
  const fetchWithToken = useFetchWithToken();
  const { isLoading: listAllJenisKelasLoading, listAllJenisKelas } = useFetchAllJenisKelas();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [formState, setFormState] = useState({
    nama: "",
    jumlahLevel: null,
    jumlahPertemuan: null,
    jenisKelas: [],
  });

  const { mutateAsync: addProgramMutation, data: response } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/program`, "POST", formState).then((res) => res.json()),
    onSuccess: (data) => {
      if (data.code == 200) {
        console.log(data.content);
        setSuccess("Sukses menambahkan.");
        setTimeout(() => {
          window.location.href = "/kelas/program";
        }, 1000);
      } else if (data.code == 400) {
        setError("Program sudah pernah ada.");
        setFormState({
          nama: "",
          jumlahLevel: null,
          jumlahPertemuan: null,
          jenisKelas: [],
        });
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProgramMutation();
  };


  return (
    <div className="">
      <div
        className={`${styles.heading} text-center my-10`}
        style={PoppinsBold.style}
      >
        Tambah Program
      </div>
      <div className={`${styles.card_form} px-7 py-8`}>
        <form onSubmit={handleSubmit}>
          <div>
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Nama Program
            </div>
            <input
              id="nama-program"
              name="program"
              type="program"
              autoComplete="program"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Nama Program"
              value={formState.nama}
              onChange={(e) =>
                setFormState({ ...formState, nama: e.target.value })
              }
              style={InterReguler.style}
            />
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Jumlah Level
            </div>
            <input
              id="jumlah-level"
              name="jumlah-level"
              type="jumlah-level"
              autoComplete="jumlah-level"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Jumlah Level"
              value={formState.jumlahLevel}
              onChange={(e) =>
                setFormState({ ...formState, jumlahLevel: parseInt(e.target.value) })
              }
              style={InterReguler.style}
            />
            <div
              style={InterReguler.style}
              className={`${styles.form_paragraph} mt-2`}
            >
              Level adalah tingkatan untuk seluruh kelas yang ada dalam program.
            </div>
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Jumlah Pertemuan
            </div>
            <input
              id="jumlah-pertemuan"
              name="jumlah-pertemuan"
              type="jumlah-pertemuan"
              autoComplete="jumlah-pertemuan"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Jumlah Pertemuan"
              value={formState.jumlahPertemuan}
              onChange={(e) =>
                setFormState({ ...formState, jumlahPertemuan: parseInt(e.target.value) })
              }
              style={InterReguler.style}
            />
            <div
              style={InterReguler.style}
              className={`${styles.form_paragraph} mt-2`}
            >
              Jumlah Pertemuan adalah banyaknya kelas yang akan diadakan dalam program.
            </div>
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Jenis Kelas
            </div>
            <div className="flex flex-col items-start">
              {listAllJenisKelas.map((jeniskelas) => (
                <React.Fragment key={jeniskelas.id}>
                  <div className="flex items-center">
                    <input
                      id={jeniskelas.id}
                      name="jenis-kelas"
                      type="checkbox"
                      value={jeniskelas.id}
                      checked={formState.jenisKelas.includes(jeniskelas.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormState({
                            ...formState,
                            jenisKelas: [...formState.jenisKelas, jeniskelas.id],
                          });
                        } else {
                          setFormState({
                            ...formState,
                            jenisKelas: formState.jenisKelas.filter((t) => t !== jeniskelas.id),
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={jeniskelas.id} className="mr-4">
                      {jeniskelas.nama + " - " + jeniskelas.bahasa + " - " + jeniskelas.tipe + " - " + jeniskelas.pertemuan + " - " + jeniskelas.picAkademikNama}
                    </label>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div
              style={InterReguler.style}
              className={`${styles.form_paragraph} mt-2`}
            >
              Pilih Jenis Kelas yang diinginkan.
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
            {!listAllJenisKelas.length && (
              <div
                className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2"
                style={InterReguler.style}
              >
                Tambah Jenis Kelas terlebih dahulu bila ingin menambah Program!
              </div>
            )}
          </div>
          <div className="flex justify-center mt-9">
            {listAllJenisKelas.length > 0 && (
              <button
                type="submit"
                className={`${styles.button_tx} ${styles.btn} hover:bg-[#215E9B] focus:bg-[#215E9B]`}
                style={InterMedium.style}
              >
                Tambah Program
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
