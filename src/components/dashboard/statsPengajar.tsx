import React from "react";
import styles from "./dashboard.module.css";
import { PoppinsBold, PoppinsMedium, InterMedium } from "../../font/font";
import { FiBook, FiBookOpen } from "react-icons/fi";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useQuery } from "react-query";
import { useAuthContext } from "../../common/utils/authContext";
import { KelasRead } from "../../common/types/kelas";
import Loading from "../../common/components/Loading";

export const StatsPengajar = () => {
  const { pengguna } = useAuthContext();
  const fetchWithToken = useFetchWithToken();
  
  const { isLoading, error, data } = useQuery({
    queryKey: ["kelas"],
    queryFn: () => fetchWithToken("/kelas").then((res) => res.json()),
  });

  if (isLoading) {
    return <Loading />;
  }

  const listKelas: KelasRead[] = data.content;

  listKelas
  .filter(kelas => new Date(kelas.tanggalMulai) < new Date())
  .sort((a, b) => new Date(b.tanggalMulai).getTime() - new Date(a.tanggalMulai).getTime())[0];

  const handleKelas = () => {
    window.location.href = "/kelas";
  };

  const handleKelasDetail = () => {
    window.location.href = `/kelas/${listKelas[0].id}`;
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
            className={`px-5 py-3 mt-3 ${styles.btn} ${styles.btn_tx} text-white hover:bg-[#215E9B] focus:bg-[#215E9B]`}
            onClick={handleKelas}
          >
            Lihat Kelas Pengajaran
          </button>
          </div>
          </div>
    </div>
    <div className={`${styles.card5} p-5`}>
      <div className="flex items-center align-middle ">
        <div>
            <FiBookOpen size={32} className="align-middle mt-2 ml-4" /> {/* Profile icon */}
          </div>
            <div
              style={PoppinsBold.style}
              className={`${styles.heading_announcement} ml-5 mt-4 mb-2`}
            >
              Kelas Selanjutnya
            </div>
      </div>
      {!listKelas || listKelas.length === 0 ? (
            <div className="mt-5 ml-5 align-center items-center text-center">Tidak ada Kelas.</div>
          ) : (
          <div className="flex-wrap items-center align-middle">
          <div style={PoppinsBold.style} className={`${styles.heading} mt-12 ml-2 text-center text-4xl`}>
            {listKelas[0].jenisKelasName}
          </div>
          <div style={PoppinsBold.style} className={`${styles.heading} mt-3 ml-2 text-center text-3xl`}>
            {new Date(listKelas[0].tanggalMulai).toLocaleDateString('id-ID', { weekday: 'long' })}, {new Date(listKelas[0].tanggalMulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div style={PoppinsBold.style} className={`${styles.heading} mt-3 ml-2 text-center text-3xl`}>
            {new Date(listKelas[0].tanggalMulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            <div style={PoppinsBold.style} className={`${styles.heading} mt-3 align-center items-center`}>
          <button
            style={InterMedium.style}
            className={`px-5 py-3 mt-5 ${styles.btn} ${styles.btn_tx} text-white hover:bg-[#215E9B] focus:bg-[#215E9B]`}
            onClick={handleKelasDetail}
          >
            Lihat Detail Kelas
          </button>
          </div>
          </div>
          </div>
          )}
    </div>
    </div>
  );
};

