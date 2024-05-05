import React from "react";
import styles from "./dashboard.module.css";
import { PoppinsBold, PoppinsMedium, InterMedium } from "../../font/font";
import { FiBook, FiBookOpen } from "react-icons/fi";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useQuery } from "react-query";
import { useAuthContext } from "../../common/utils/authContext";
import { KelasRead } from "../../common/types/kelas";
import Loading from "../../common/components/Loading";
import { ReadPermintaanPerubahan } from "../../common/types/permintaanPerubahan";

export const StatsOps = () => {
  const { pengguna } = useAuthContext();
  const fetchWithToken = useFetchWithToken();
  
  const { isLoading: isLoadingKelas, error: errorKelas, data: dataKelas } = useQuery({
    queryKey: ["kelas"],
    queryFn: () => fetchWithToken("/kelas").then((res) => res.json()),
  });

  const { isLoading: isLoadingPerubahan, error: errorPerubahan, data: dataPerubahan } = useQuery({
    queryKey: ["permintaan-perubahan"],
    queryFn: () =>
      fetchWithToken("/permintaan-perubahan").then((res) => res.json()),
  });

  if (isLoadingKelas || isLoadingPerubahan) {
    return <Loading />;
  }

  const listKelas: KelasRead[] = dataKelas.content;
  const listPermintaanPerubahan: ReadPermintaanPerubahan[] = dataPerubahan.content;

  const handleKelas = () => {
    window.location.href = "/kelas";
  };

  const handlePerubahanKelas = () => {
    window.location.href = `/perubahan-kelas`;
  };

  return (
    <div className="mr-8 flex">
    <div className={`${styles.card5} p-5 mr-8`}>
      <div className="flex items-center align-middle">
      <div>
          <FiBook size={32} className="align-middle mt-2 ml-4" /> {/* Profile icon */}
        </div>
          <div
            style={PoppinsBold.style}
            className={`${styles.heading_announcement} ml-5 mt-4 mb-2`}
          >
            Total Kelas Aktif
          </div>
      </div>
      <div className="flex-wrap items-center align-middle">
          <div style={PoppinsBold.style} className={`${styles.heading} mt-12 ml-5 align-center items-center text-center text-8xl`}>
            {listKelas.length}
          </div>
          <div style={PoppinsBold.style} className={`${styles.heading} mt-3 ml-5 align-center items-center text-center text-3xl`}>
            Kelas
          </div>
          <div style={PoppinsBold.style} className={`${styles.heading} mt-3 ml-5 align-center items-center text-center`}>
          <button
            style={InterMedium.style}
            className={`px-5 py-3 mt-3 ${styles.btn} ${styles.btn_tx} text-white hover:bg-[#215E9B] focus:bg-[#215E9B] px-3`}
            onClick={handleKelas}
          >
            Lihat Daftar Kelas
          </button>
          </div>
          </div>
    </div>
    <div className={`${styles.card5} p-5`}>
      <div className="flex items-center align-middle">
        <div>
            <FiBookOpen size={32} className="align-middle mt-2 ml-4" /> {/* Profile icon */}
          </div>
            <div
              style={PoppinsBold.style}
              className={`${styles.heading_announcement} ml-5 mt-4 mb-2`}
            >
              Perubahan Kelas
            </div>
      </div>
      <div className="flex-wrap items-center align-middle">
          <div style={PoppinsBold.style} className={`${styles.heading} mt-12 ml-5 align-center items-center text-center text-8xl`}>
            {listPermintaanPerubahan.length}
          </div>
          <div style={PoppinsBold.style} className={`${styles.heading} mt-3 ml-5 align-center items-center text-center text-3xl`}>
            Kelas Pending
          </div>
          <div style={PoppinsBold.style} className={`${styles.heading} mt-3 ml-24 align-center items-center`}>
          <button
            style={InterMedium.style}
            className={`px-5 py-3 mt-3 ${styles.btn} ${styles.btn_tx} text-white hover:bg-[#215E9B] focus:bg-[#215E9B]`}
            onClick={handlePerubahanKelas}
          >
            Lihat Permintaan Perubahan Kelas
          </button>
          </div>
          </div>
    </div>
    </div>
  );
};

