"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams, useRouter } from "next/navigation";

//import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../../font/font";
import styles from "./addForm.module.css";

//import component
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import Loading from "../../../app/loading";
import Link from "next/link";

export const DetailMurid = () => {
  const { id } = useParams();
  const fetchWithToken = useFetchWithToken();
  const router = useRouter();

  const {
    isLoading,
    error: fetchingError,
    data,
  } = useQuery({
    queryKey: ["muridDetail"],
    queryFn: () => fetchWithToken(`/murid/${id}`).then((res) => res.json()),
    onSuccess: (data) => {
      if (data.status != "OK") {
        window.alert(data.message);
        router.push("/dashboard");
      }
    },
  });

  if (isLoading) return <Loading />;

  if (fetchingError || !data) {
    return <div>Error fetching class details.</div>;
  }

  const { nama, tanggalLahir, namaOrtu, emailOrtu, noHpOrtu, note } =
    data.content;

  return (
    <div>
      <div
        className={`${styles.heading} text-center my-10`}
        style={PoppinsBold.style}
      >
        Detail Murid
      </div>
      <div className={`${styles.card_form} px-7 py-8 mb-12`}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Nama Lengkap
            </div>
            <input
              disabled
              type="name"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Nama Lengkap"
              value={nama}
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
              disabled
              type="date"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Tanggal Lahir"
              value={new Date(tanggalLahir).toISOString().split("T")[0]}
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
              disabled
              type="name"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Nama Lengkap Orang Tua"
              value={namaOrtu}
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
              disabled
              type="name"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Email Orang Tua"
              value={emailOrtu}
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
              disabled
              type="text"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="HP Orang Tua"
              value={noHpOrtu}
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
              disabled
              type="textarea"
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="ex: Handal dalam matematika, suka membaca, dll."
              value={note}
              style={InterReguler.style}
            />
          </div>
        </div>

        <div className="flex justify-center mt-9">
          <Link href={`/murid/${id}/edit`}>
            <button
              className={`${styles.button_tx} ${styles.btn} `}
              style={InterMedium.style}
            >
              Edit Murid
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
