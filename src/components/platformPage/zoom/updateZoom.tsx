"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams, useRouter } from "next/navigation";

import { PoppinsBold, InterMedium, InterReguler } from "../../../font/font";
import styles from "./detailZoom.module.css";

import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import Loading from "../../../app/loading";

export const UpdateZoom = () => {
    const queryClient = useQueryClient();
    const fetchWithToken = useFetchWithToken();
    const { id } = useParams();
    const router = useRouter();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [zoom, setZoom] = useState({
        nama: "",
        link: "",
        hostKey: "",
    });

    const { mutateAsync: updateZoom } = useMutation({
        mutationFn: () => fetchWithToken(`/platform?zoom=${id}`, "PUT", zoom).then((res) => res.json()),
        onSuccess: (data) => {
            if (data.status === "OK") {
                queryClient.invalidateQueries("zoom");
                setSuccess("Zoom berhasil diubah");
                setTimeout(() => {
                    queryClient.invalidateQueries("zoom");
                    window.location.href = "/platform/zoom";
                }, 1000);
            } else {
                setError(data.message);
            }
        },
    });

    const { isLoading, error: errorFetch, data } = useQuery({
        queryKey: ["zoomDetail"],
        queryFn: () => fetchWithToken(`/platform?zoom=${id}`).then((res) => res.json()),
    });

    useEffect(() => {
        if (data) {
            setZoom(data.content);
        }
    }, [data]);

    if (isLoading) {
        return <Loading />;
    }

    if (errorFetch || !data) {
        return <div>Error fetching zoom data</div>;
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
                            updateZoom();
                        }}
                        className="space-y-6"
                    >
                        <div className="form-control">
                            <label className="label">Nama Zoom</label>
                            <input
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder={data.content.nama}
                            value={zoom.nama}
                            onChange={(e) => {
                                setZoom({ ...zoom, nama: e.target.value });
                            }
                            }
                                style={InterReguler.style}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">Link Zoom</label>
                            <input
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder={data.content.link}
                            value={zoom.link}
                            onChange={(e) => {
                                setZoom({ ...zoom, link: e.target.value });
                            }
                            }
                                style={InterReguler.style}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">Host Key</label>
                            <input
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder={data.content.hostKey}
                            value={zoom.hostKey}
                            onChange={(e) => {
                                setZoom({ ...zoom, hostKey: e.target.value });
                            }
                            }
                                style={InterReguler.style}
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
                            Update Zoom
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateZoom;