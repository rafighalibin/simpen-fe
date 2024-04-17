"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams, useRouter } from "next/navigation";

import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./detailFee.module.css";

import useFetchWithToken from "../../common/hooks/fetchWithToken";
import Loading from "../../app/loading";
import Link from "next/link";
import { JenisKelas } from "../../common/types/jeniskelas";
import { Program } from "../../common/types/program";

export const UpdateFee = () => {
    const queryClient = useQueryClient();
    const fetchWithToken = useFetchWithToken();
    const { id } = useParams();
    const router = useRouter();

    const [error, setError] = useState("");
    const [succces, setSuccess] = useState("");
    const [baseFee, setBaseFee] = useState(0);
    const [studentMultiplier, setStudentMultiplier] = useState(0);
    const [maxStudents, setMaxStudents] = useState(0);
    const [jenisKelas, setJenisKelas] = useState(null);
    const [program, setProgram] = useState(null);

    const {
        isLoading,
        error: fetchingError,
        data,
        refetch,
    } = useQuery({
        queryKey: ["feeDetailUpdate"],
        queryFn: () => fetchWithToken(`/payroll/fee/${id}`).then((res) => res.json()),
        onSuccess: (data) => {
            if (data.status != "OK") {
                window.alert(data.message);
                router.push("/dashboard");
            }
            console.log("Data")
            console.log(data.content);
            setJenisKelas(data.content.jenisKelas);
            setProgram(data.content.program);
            setBaseFee(data.content.baseFee);
            setStudentMultiplier(data.content.studentMultiplier);
            setMaxStudents(data.content.maxStudents);

        },
        onError: (error) => {
            console.log(error);
        }
    });

    
    

    // const {jenisKelas, program, baseFee, studentMultiplier, maxStudents, lastUpdated} = data.content;

    const payload = {
        id,
        baseFee,
        studentMultiplier,
        maxStudents,
    };

    const { mutateAsync: updateFeeMutation, data: response, } = useMutation({
        mutationFn: () =>
            fetchWithToken(`/payroll/fee`, "PUT", payload).then((res) => 
                res.json()
            ),
        onSuccess: (data) => {
            if (data.code == 200) {
                setSuccess("Sukses mengupdate.");
                setTimeout(() => {
                    queryClient.invalidateQueries("fee");
                    window.location.href = "/payroll";
                }, 1000);
            } else if (data.code == 400) {
                setError(data.message);
            }
        },
    });

    // useEffect(() => {
    //     // Refetch data whenever component mounts
    //     console.log("Refetch")
    //     console.log(data);
    //     if(!data){
    //         refetch();
    //     }
    //   }, [refetch,data]);

    if (isLoading) return <Loading />;

    if (fetchingError || !data) {
        return <div>Error fetching class details.</div>;
    }

    console.log("Jenis Kelas");
    console.log(jenisKelas);
    console.log("Program");
    console.log(program);

    return (
        <div>
            <div
                className={`${styles.heading} text-center my-10`}
                style={PoppinsBold.style}
            >
                Update Fee
            </div>
            <form
                        onSubmit={ async (e) => {
                            e.preventDefault();
                            await updateFeeMutation();
                        }}
                    >
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
                            value={jenisKelas.pertemuan}
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
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder={baseFee.toLocaleString("id-ID", {style: "currency",currency: "IDR",})}
                            value={baseFee}
                            onChange={(e) => {
                                setBaseFee(Number(e.target.value));
                            }
                        }
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
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder={maxStudents.toString()}
                            value={maxStudents}
                            onChange={(e) => {
                                setMaxStudents(Number(e.target.value));
                            }
                        }
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
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder={studentMultiplier.toLocaleString("id-ID", {style: "currency",currency: "IDR",})}
                            value={studentMultiplier}
                            onChange={(e) => {
                                setStudentMultiplier(Number(e.target.value))
                            }
                        }
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
                <div className="flex justify-center mt-9">
                        <button
                        type="submit"
                        className={`${styles.button_tx} ${styles.btn} `}
                        style={InterMedium.style}
                        >
                        Update Fee
                        </button>
                </div>
            </div>
            </form>
        </div>
    );
}