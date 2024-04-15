"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useParams, useRouter } from "next/navigation";

//import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./addProgramForm.module.css";

//import component
import useFetchWithToken from "../../common/hooks/fetchWithToken";

export const EditProgramForm = ({ data }) => {
  const fetchWithToken = useFetchWithToken();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { id } = useParams(); // Correct usage based on your setup\

  const [formState, setFormState] = useState({
    id: id,
    nama: "",
    jumlahLevel: null,
    jumlahPertemuan: null,
  });

  useEffect(() => {
    if (data) {
      setFormState({
        id: id,
        nama: data.nama || "",
        jumlahLevel: data.jumlahLevel || null,
        jumlahPertemuan: data.jumlahPertemuan || null,
      });
    }
  }, [data]);


  const { mutateAsync: editProgramMutation, data: response } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/program`, "PUT", formState).then((res) => res.json()),
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
            id: id,
            nama: data.nama || "",
            jumlahLevel: data.jumlahLevel || "",
            jumlahPertemuan: data.jumlahPertemuan || "",
        });
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editProgramMutation();
  };


return (
    <div className="">
        <div
            className={`${styles.heading} text-center my-10`}
            style={PoppinsBold.style}
        >
            Edit Program
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
                <div className="flex justify-center mt-9">
                    <button
                    type="submit"
                    className={`${styles.button_tx} ${styles.btn} hover:bg-[#215E9B] focus:bg-[#215E9B]`}
                    style={InterMedium.style}
                    >
                    Edit Program
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};
