import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useAuthContext } from "../../../common/utils/authContext";
import Loading from "../../../common/components/Loading";
import Schedule from "../schedule";
import { ReadDetailZoom, ReadJadwalZoom, ScheduleZoom } from "../../../common/types/platform";
import { PoppinsBold, InterMedium, InterReguler } from "../../../font/font";
import styles from "./detailZoom.module.css";
import Link from "next/link";
import { useState } from "react";

const DetailZoom = () => {
    const fetchWithToken = useFetchWithToken();
    const { id } = useParams();
    const { pengguna: userLoggedIn } = useAuthContext();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { isLoading, error : errorFecth, data } = useQuery({
        queryKey: ["zoomDetail"],
        queryFn: () => fetchWithToken(`/platform?zoom&id=${id}`).then((res) => res.json()),
        onSuccess: (data) => {
            if (data.status !== "OK") {
                window.alert(data.message);
                router.push("/platform/zoom");
            }
        },
    });

    const convertJadwalPemakaianToScheduleZoom = (jadwalPemakaian: ReadJadwalZoom[]): ScheduleZoom[] => {
        return jadwalPemakaian.map((jadwal) => {
            const [year, month, day, hour, minute] = jadwal.waktu;
            const start = new Date(year, month - 1, day, hour, minute); // Month is zero-based in JavaScript Date
            const end = new Date(year, month - 1, day, hour + 1, minute); // Adding 1 hour to the start time
            
            return {
                title: jadwal.namaPengajar,
                start: start,
                end: end,
                desc: jadwal.nama
            };
        });
    };

    const { mutateAsync: deleteMutation} = useMutation({
        mutationFn: () =>
            fetchWithToken(`/platform/${id}`, "DELETE").then((res) => res.json()),
        onSuccess: () => {
            if (data.status === "OK") {
                setSuccess("Zoom berhasil dihapus");
                setTimeout(() => {
                    queryClient.invalidateQueries("zoom");
                    window.location.href = "/platform/zoom";
                }, 1000);
            } else {
                setError(data.message);
            }
        },
    });

    if (isLoading) return <Loading />;
    
    if (errorFecth || !data) {
        return <div>Error fetching zoom details.</div>;
    }

    const dataZoom: ReadDetailZoom = data?.content;

    const events = convertJadwalPemakaianToScheduleZoom(dataZoom.jadwalPemakaian);

    const handleEditButtonClick = () => {
        queryClient.invalidateQueries("zoomDetail");
        router.push(`/platform/zoom/${id}/edit`);
    };

    const handleDeleteButtonClick = () => {
        if (window.confirm("Are you sure you want to delete this zoom?")) {
            deleteMutation();
        }
    };

    return (
        <div>
            <div className="flex flex-row items-center justify-between">
                <h1 className={` ${styles.heading} text-3xl font-bold my-10`}>{dataZoom.nama}</h1>
                <div className="flex items-right justify-end space-x-4">
                    <Link href={dataZoom.link}>
                        <button className={` ${styles.btn} px-4 py-2 bg-primary/80 hover:bg-primary text-white rounded`}>
                            Join Zoom
                        </button>
                    </Link>
                    <button
                    className={`${styles.button_tx} ${styles.btn} `}
                    style={InterMedium.style}
                    onClick={handleEditButtonClick}
                    >
                    Edit Zoom
                    </button>
                    <button
                    className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover"
                    style={InterMedium.style}
                    onClick={handleDeleteButtonClick}
                    >
                    Delete Zoom
                    </button>
                </div>
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
            <div className={`${styles.card_form} px-7 py-8 mb-12`}>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="mt-8">
                        <div
                            style={InterMedium.style}
                            className={`${styles.form_title} mb-3`}
                        >
                            Link
                        </div>
                        <input
                            disabled
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder="Program"
                            value={dataZoom.link}
                            style={InterReguler.style}
                        />
                    </div>
                    <div className="mt-8">
                        <div
                            style={InterMedium.style}
                            className={`${styles.form_title} mb-3`}
                        >
                            Host Key
                        </div>
                        <input
                            disabled
                            type="name"
                            required
                            className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                            placeholder="Jenis Kelas"
                            value={dataZoom.hostKey}
                            style={InterReguler.style}
                        />
                    </div>
                </div>
                <div
                    className={`${styles.heading2} text-1xl font-bold my-10`}
                    style={PoppinsBold.style}
                >
                    Jadwal Pemakaian
                </div>
                <Schedule events={events} />
            </div>
        </div>
    );
}

export default DetailZoom;
