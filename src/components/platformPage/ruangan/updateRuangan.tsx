"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams, useRouter } from "next/navigation";

import { PoppinsBold, InterMedium, InterReguler } from "../../../font/font";
import styles from "./detailRuangan.module.css";

import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import Loading from "../../../app/loading";

export const UpdateRuangan = () => {
    const queryClient = useQueryClient();
    const fetchWithToken = useFetchWithToken();
    const { id } = useParams();
    const router = useRouter();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [ruangan, setRuangan] = useState({
        nama: "",
        cabang: "",
        kapasitas: 0,
    });

    const { mutateAsync: updateRuangan } = useMutation({
        mutationFn: () => fetchWithToken(`/platform?ruangan=${id}`, "PUT", ruangan).then((res) => res.json()),
        onSuccess: (data) => {
            if (data.status === "OK") {
                queryClient.invalidateQueries("ruangan");
                setSuccess("Ruangan berhasil diubah");
                setTimeout(() => {
                    queryClient.invalidateQueries("ruangan");
                    window.location.href = "/platform/ruangan";
                }, 1000);
            } else {
                setError(data.message);
            }
        },
    });

    const { isLoading, error: errorFetch, data } = useQuery({
        queryKey: ["ruanganDetail"],
        queryFn: () => fetchWithToken(`/platform?ruangan=${id}`).then((res) => res.json()),
    });

    useEffect(() => {
        if (data) {
            setRuangan(data.content);
        }
    }, [data]);

    if (isLoading) {
        return <Loading />;
    }

    if (errorFetch || !data) {
        return <div>Error fetching ruangan data</div>;
    }

    return (
        <div>
            <div className="flex flex-col space-y-8 my-10">
                <h2 className="flex justify-start text-4xl font-bold text-neutral/100">
                    Edit {data.content.nama}
                </h2>
                <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg border">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            updateRuangan();
                        }}
                        className="space-y-6"
                    >
                        <div className="form-control">
                            <label className="label">Nama Ruangan</label>
                            <input
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder={data.content.nama}
                            value={ruangan.nama}
                            onChange={(e) => {
                                setRuangan({ ...ruangan, nama: e.target.value });
                            }
                            }
                                style={InterReguler.style}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">Cabang</label>
                            <input
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder={data.content.cabang}
                            value={ruangan.cabang}
                            onChange={(e) => {
                                setRuangan({ ...ruangan, cabang: e.target.value });
                            }
                            }
                                style={InterReguler.style}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">Kapasitas</label>
                            <input
                                required
                                type="text"
                                value={ruangan.kapasitas}
                                name="Base Fee"
                                onChange={(e) => setRuangan({ ...ruangan, kapasitas: Number(e.target.value) })}
                                className="bg-base mt-1 p-2 w-full border rounded-md"
                                min={0}
                                onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                input.value = input.value.replace(/[^0-9]/g, ""); // Menghapus karakter selain angka
                                }}
                            />
                        </div>
                        <div className="my-5">
                            {success && (
                            <div className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2">
                                {success}
                            </div>
                            )}
                            {error && (
                            <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
                                {error}
                            </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover disabled:bg-neutral/20 disabled:cursor-not-allowed"
                        >
                            Update Ruangan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateRuangan;