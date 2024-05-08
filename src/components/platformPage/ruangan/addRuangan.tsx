import React, { use, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useState } from "react";
import { useAuthContext } from "../../../common/utils/authContext";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { InterReguler } from "../../../font/font";

export const AddRuangan = () => {
    const queryClient = useQueryClient();
    const fetchWithToken = useFetchWithToken();
    const router = useRouter();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { pengguna } = useAuthContext();

    const [ruangan, setRuangan] = useState({
        nama: "",
        cabang: "",
        kapasitas: 0,
    });

    const { mutateAsync: addRuangan } = useMutation({
        mutationFn: () => fetchWithToken("/platform?ruangan","POST", ruangan).then((res) => res.json()),
        onSuccess: (data) => {
            queryClient.invalidateQueries("ruangan");
            if(data.status === "OK") {
                setSuccess("Ruangan berhasil ditambahkan");
                setTimeout(() => {
                    router.push("/platform/ruangan");
                }, 1000);
            } else {
                setError(data.message);
            }
        },
    });

    if (pengguna.role !== "operasional" && pengguna.role !== "superadmin") {
        router.push("/dashboard");
    }

    return (
        <div>
            <div className="flex flex-col space-y-8 my-10">
                <h2 className="flex justify-start text-4xl font-bold text-neutral/100">
                    Buat Ruangan
                </h2>
                <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg border">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            addRuangan();
                        }}
                        className="space-y-6"
                    >
                        <div className="form-control">
                            <label className="label">Nama Ruangan</label>
                            <input
                            required
                            type="text"
                            className="bg-base mt-1 p-2 w-full border rounded-md"
                            value={ruangan.nama}
                            onChange={(e) => setRuangan({ ...ruangan, nama: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">Cabang</label>
                            <input
                            required
                            type="text"
                            className="bg-base mt-1 p-2 w-full border rounded-md"
                            value={ruangan.cabang}
                            onChange={(e) => setRuangan({ ...ruangan, cabang: e.target.value })}
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
                            Buat Ruangan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
