"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";

//Import font and css
import styles from ".././DetailUser/DetailUser.module.css";
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";

//import component
import useFetchWithToken from "../../common/hooks/fetchWithToken";

export const EditUserForm = ({ data }) => {
  const fetchWithToken = useFetchWithToken();
  const [error, setError] = useState("");
  const [succces, setSuccess] = useState("");
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: "",
    id: "",
    nama: "",
  });

  useEffect(() => {
    if (data) {
      setFormState({
        email: data.email || "",
        id: data.id || "",
        nama: data.nama || "",
      });
    }
  }, [data]);

  const { mutateAsync: editUserMutation, data: response } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/user/${data.id}`, "PUT", formState).then(
        (res) => res.json
      ),
    onSuccess: (data) => {
      if (data) setSuccess("Informasi akun berhasil diubah.");
      setTimeout(() => {
        localStorage.setItem("editUserSuccess", `${formState.nama}`);
        router.push("/user");
      }, 1000);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editUserMutation();
  };

  const handleCancel = async () => {
    router.push(`/user/detail/${data.id}`);
  };

  console.log(formState);

  return (
    <div>
      <div
        className={`${styles.heading} text-center  md:my-10 my-6`}
        style={PoppinsBold.style}
      >
        Detail Akun Pengguna
      </div>
      <div className="">
        <div>
          <div
            style={InterMedium.style}
            className={`${styles.title} mb-3 sm:ml-0 ml-1`}
          >
            Email
          </div>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`${styles.placeholder} appearance-none relative block w-full px-3 sm:py-3 py-1 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:text-black focus:z-10`}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
            value={formState.email}
            style={InterReguler.style}
          />
          <div
            style={InterReguler.style}
            className={`${styles.form_paragraph} mt-2 sm:ml-0 ml-1`}
          >
            Email yang akan digunakan selama akun ini ada untuk login.
          </div>
        </div>
        <div>
          <div
            style={InterMedium.style}
            className={`${styles.title}  mb-3 mt-8 sm:ml-0 ml-1`}
          >
            Nama
          </div>
          <input
            id="full-name"
            name="name"
            type="name"
            autoComplete="name"
            required
            className={`${styles.placeholder} appearance-none relative block w-full px-3 sm:py-3 py-1 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC]  focus:text-black focus:z-10`}
            onChange={(e) =>
              setFormState({ ...formState, nama: e.target.value })
            }
            value={formState.nama}
            style={InterReguler.style}
          />
          <div
            style={InterReguler.style}
            className={`${styles.form_paragraph} mt-2 sm:ml-0 ml-1`}
          >
            Nama Lengkap ini digunakan sebagai pengidentifikasi selama akun ini
            ada.
          </div>
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
      <div className="flex justify-center gap-4 sm:mt-16 sm:mb-24 mt-12 mb-8">
        <button
          onClick={handleSubmit}
          className={`${styles.button_tx} ${styles.edit_btn} hover:bg-[#215E9B] focus:bg-[#215E9B]`}
          style={InterMedium.style}
        >
          Konfirmasi Ubah
        </button>
        <button
          onClick={handleCancel}
          className={`${styles.button_tx} ${styles.del_btn} hover:bg-[#a00e0e] focus:bg-[#a00e0e]`}
          style={InterMedium.style}
        >
          Batalkan
        </button>
      </div>
    </div>
  );
};
