import React, { use, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useState } from "react";
import { useAuthContext } from "../../../common/utils/authContext";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { InterReguler } from "../../../font/font";

export const AddZoom = () => {
    const queryClient = useQueryClient();
    const fetchWithToken = useFetchWithToken();
    const router = useRouter();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { pengguna } = useAuthContext();

    const [zoom, setZoom] = useState({
        nama: "",
        link: "",
        hostKey: "",
    });

    const { mutateAsync: addZoom } = useMutation({
        mutationFn: () => fetchWithToken("/platform?zoom","POST", zoom).then((res) => res.json()),
        onSuccess: (data) => {
            queryClient.invalidateQueries("zoom");
            if(data.status === "OK") {
                setSuccess("Zoom berhasil ditambahkan");
                setTimeout(() => {
                    router.push("/platform/zoom");
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
                    Buat Zoom
                </h2>
                <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg border">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            addZoom();
                        }}
                        className="space-y-6"
                    >
                        <div className="form-control">
                            <label className="label">Nama Zoom</label>
                            <input
                            required
                            type="text"
                            className="bg-base mt-1 p-2 w-full border rounded-md"
                            value={zoom.nama}
                            onChange={(e) => setZoom({ ...zoom, nama: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">Link Zoom</label>
                            <input
                            required
                            type="text"
                            className="bg-base mt-1 p-2 w-full border rounded-md"
                            value={zoom.link}
                            onChange={(e) => setZoom({ ...zoom, link: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">Host Key</label>
                            <input
                            required
                            type="text"
                            className="bg-base mt-1 p-2 w-full border rounded-md"
                            value={zoom.hostKey}
                            onChange={(e) => setZoom({ ...zoom, hostKey: e.target.value })}
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
                            Buat Zoom
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
