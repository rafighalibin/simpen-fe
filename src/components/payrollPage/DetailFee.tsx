"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams, useRouter } from "next/navigation";

import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./detailFee.module.css";

import useFetchWithToken from "../../common/hooks/fetchWithToken";
import Loading from "../../app/loading";
import Link from "next/link";

export const DetailFee = () => {
    const { id } = useParams();
    const fetchWithToken = useFetchWithToken();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [error, setError] = useState("");
    const [succces, setSuccess] = useState("");

    const {
        isLoading,
        error: fetchingError,
        data,
    } = useQuery({
        queryKey: ["feeDetail"],
        queryFn: () => fetchWithToken(`/payroll/fee/${id}`).then((res) => res.json()),
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

    const {jenisKelas, program, baseFee, studentMultiplier, maxStudents, lastUpdated} = data.content;
    const [year, month, day, hour, minute, second, millisecond] = lastUpdated;
    const dateTimeUTC = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));

    const handleEditButtonClick = () => {
        queryClient.invalidateQueries("feeDetailUpdate");
        router.push(`/payroll/${id}/edit`);
    };

    // const { mutateAsync: deleteMutation} = useMutation({
    //     mutationFn: () =>
    //         fetchWithToken(`/payroll/fee/${id}`, "DELETE").then((res) => res.json()),
    //     onSuccess: () => {
    //         alert("Fee berhasil dihapus");
    //         window.location.href = "/payroll";
    //     },
    // });

    // const handleDeleteButtonClick = async () => {
    //     if (window.confirm("Apakah Anda yakin ingin menghapus fee ini?")) {
    //         await deleteMutation();
    //     }
    // }

    return (
        <div>
            <div
                className={`${styles.heading} text-center my-10`}
                style={PoppinsBold.style}
            >
                Detail Fee
            </div>
            <div className={`${styles.card_form} px-7 py-8 mb-12`}>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div className="mt-8">
                        <div
                            style={InterMedium.style}
                            className={`${styles.form_title} mb-3`}
                        >
                            Program
                        </div>
                        <input
                            disabled
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder="Program"
                            value={program.nama}
                            style={InterReguler.style}
                        />
                    </div>
                    <div className="mt-8">
                        <div
                            style={InterMedium.style}
                            className={`${styles.form_title} mb-3`}
                        >
                            Jenis Kelas
                        </div>
                        <input
                            disabled
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder="Jenis Kelas"
                            value={jenisKelas.nama}
                            style={InterReguler.style}
                        />
                    </div>
                    <div className="mt-8">
                        <div
                            style={InterMedium.style}
                            className={`${styles.form_title} mb-3`}
                        >
                            Mode Pertemuan
                        </div>
                        <input
                            disabled
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder="Mode Pertemuan"
                            value={jenisKelas.modaPertemuan}
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
                        <input
                            disabled
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder="Tipe Kelas"
                            value={jenisKelas.tipe}
                            style={InterReguler.style}
                        />
                    </div>
                    <div className="mt-8">
                        <div
                            style={InterMedium.style}
                            className={`${styles.form_title} mb-3`}
                        >
                            Bahasa
                        </div>
                        <input
                            disabled
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder="Bahasa Kelas"
                            value={jenisKelas.bahasa}
                            style={InterReguler.style}
                        />
                    </div>
                    
                    <div className="mt-8">
                        <div
                            style={InterMedium.style}
                            className={`${styles.form_title} mb-3`}
                        >
                            Fee Dasar
                        </div>
                        <input
                            disabled
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder="Fee Dasar"
                            value={baseFee.toLocaleString("id-ID", {style: "currency",currency: "IDR",})}
                            style={InterReguler.style}
                        />
                    </div>
                    <div className="mt-8">
                        <div
                            style={InterMedium.style}
                            className={`${styles.form_title} mb-3`}
                        >
                            Maksimal Murid
                        </div>
                        <input
                            disabled
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder="Maksimal Murid"
                            value={maxStudents}
                            style={InterReguler.style}
                        />
                    </div>
                    <div className="mt-8">
                        <div
                            style={InterMedium.style}
                            className={`${styles.form_title} mb-3`}
                        >
                            Perkalian Murid
                        </div>
                        <input
                            disabled
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder="Perkalian Murid"
                            value={studentMultiplier.toLocaleString("id-ID", {style: "currency",currency: "IDR",})}
                            style={InterReguler.style}
                        />
                    </div>
                    <div className="mt-8">
                        <div
                            style={InterMedium.style}
                            className={`${styles.form_title} mb-3`}
                        >
                            Terakhir Diubah
                        </div>
                        <input
                            disabled
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder="Terakhir Diubah"
                            value={dateTimeUTC.toLocaleDateString("en-GB") + " " + dateTimeUTC.toLocaleTimeString("en-GB")}
                            style={InterReguler.style}
                        />
                    </div>
                </div>
                <div className="flex justify-center mt-9 space-x-6">
                    <button
                    className={`${styles.button_tx} ${styles.btn} `}
                    style={InterMedium.style}
                    onClick={handleEditButtonClick}
                    >
                    Edit Fee
                    </button>
                    <button
                    className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover"
                    style={InterMedium.style}
                    // onClick={handleDeleteButtonClick}
                    >
                    Delete Fee
                    </button>
                </div>
            </div>
        </div>
    );
}