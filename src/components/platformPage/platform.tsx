import { useParams, useRouter } from "next/navigation";
import { useQuery } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useAuthContext } from "../../common/utils/authContext";
import Loading from "../../common/components/Loading";
import Schedule from "./schedule";
import { PlatformSchedule, ReadJadwalZoom, ScheduleZoom } from "../../common/types/platform";
import styles from "./platform.module.css";
import { InterMedium, PoppinsBold } from "../../font/font";
import Link from "next/link";

const Platform = () => {
    const fetchWithToken = useFetchWithToken();
    const { id } = useParams();
    const { pengguna: userLoggedIn } = useAuthContext();
    const router = useRouter();

    const { isLoading, error, data } = useQuery({
        queryKey: ["platform"],
        queryFn: () => fetchWithToken("/platform?jadwal").then((res) => res.json()),
        onSuccess: (data) => {
            if (data.status !== "OK") {
                window.alert(data.message);
                router.push("/dashboard");
            }
        },
    });

    const convertJadwalPemakaianToSchedule = (jadwalPemakaian: PlatformSchedule[]) : ScheduleZoom[] => {
        return jadwalPemakaian.map((jadwal) => {
            const [year, month, day, hour, minute] = jadwal.start;
            const start = new Date(year, month - 1, day, hour, minute); // Month is zero-based in JavaScript Date
            const end = new Date(year, month - 1, day, hour + 1, minute); // Adding 1 hour to the start time
            
            return {
                title: jadwal.title,
                start: start,
                end: end,
                desc: jadwal.desc
            };
        });
    };

    if (isLoading) return <Loading />;
    
    if (error || !data) {
        return <div>Error fetching platform details.</div>;
    }

    const dataPlatform = data?.content;

    const events = convertJadwalPemakaianToSchedule(dataPlatform);

    return (
        <div>
            <div className={`${styles.card_form} px-6 py-8 mb-5 mt-5`}>
           <div
                className={`${styles.heading} text-center`}
                style={PoppinsBold.style}
            >
                Platform
            </div>
                <div className="flex justify-center space-x-6">
                    <Link href={`/platform/zoom`}>
                    <button
                    className={`${styles.button_tx} ${styles.btn} `}
                    style={InterMedium.style}
                    // onClick={}
                    >
                    Zoom
                    </button>
                    </Link>
                    <Link href={`/platform/ruangan`}>
                    <button
                    className={`${styles.button_tx} ${styles.btn} `}
                    style={InterMedium.style}
                    // onClick={handleDeleteButtonClick}
                    >
                    Ruangan
                    </button>
                    </Link>
                </div>
                <div
                    className={`${styles.heading2} text-center my-5`}
                    style={PoppinsBold.style}
                >
                    Jadwal Pemakaian
                </div>
            <Schedule events={events} />
            </div>
        </div>
    );
}

export default Platform;