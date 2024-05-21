import React, { useEffect } from "react";
import styles from "./dashboard.module.css";
import { PoppinsBold, PoppinsMedium, InterMedium } from "../../font/font";
import { FiBook, FiBookOpen } from "react-icons/fi";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useQuery } from "react-query";
import { useAuthContext } from "../../common/utils/authContext";
import { KelasRead } from "../../common/types/kelas";
import Loading from "../../common/components/Loading";
import { ReadPermintaanPerubahan } from "../../common/types/permintaanPerubahan";
import useFetchAllUser from "../../common/hooks/user/useFetchAllUser";

export const StatsAdmin = () => {
  const { pengguna } = useAuthContext();
  
  const {
    isLoading: listAllUserLoading,
    error,
    listAllUser,
    refetch,
  } = useFetchAllUser();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (listAllUserLoading) {
    return <Loading />;
  }

  const handleAkunList = () => {
    window.location.href = "/user";
  };

  return (
    <div className="flex-grow grid grid-flow-row-dense">
    <div className={`${styles.card6} p-5`}>
      <div className="flex items-center align-middle">
        <div>
          <FiBook size={32} className="align-middle mt-2 ml-4" /> {/* Profile icon */}
        </div>
          <div
            style={PoppinsBold.style}
            className={`${styles.heading_announcement} ml-5 mt-4 mb-2`}
          >
            Statistik Akun Aktif
          </div>
      </div>
      <div className="flex ml-16 space-x-14">
      <div className="flex-wrap items-center align-middle">
          <div style={PoppinsBold.style} className={`${styles.heading} mt-12 ml-5 align-center items-center text-center text-8xl`}>
            {listAllUser.filter(user => user.role === "operasional").length}
          </div>
          <div style={PoppinsBold.style} className={`${styles.heading} mt-3 ml-5 align-center items-center text-center text-3xl`}>
            Operasional
          </div>
      </div>
      <div className="flex-wrap items-center align-middle">
          <div style={PoppinsBold.style} className={`${styles.heading} mt-12 ml-5 align-center items-center text-center text-8xl`}>
          {listAllUser.filter(user => user.role === "akademik").length}
          </div>
          <div style={PoppinsBold.style} className={`${styles.heading} mt-3 ml-5 align-center items-center text-center text-3xl`}>
            Akademik
          </div>
      </div>
      <div className="flex-wrap items-center align-middle">
          <div style={PoppinsBold.style} className={`${styles.heading} mt-12 ml-5 align-center items-center text-center text-8xl`}>
          {listAllUser.filter(user => user.role === "pengajar").length}
          </div>
          <div style={PoppinsBold.style} className={`${styles.heading} mt-3 ml-5 align-center items-center text-center text-3xl`}>
            Pengajar
          </div>
      </div>
      <div className="flex-wrap items-center align-middle">
          <div style={PoppinsBold.style} className={`${styles.heading} mt-12 ml-5 align-center items-center text-center text-8xl`}>
            {listAllUser.length}
          </div>
          <div style={PoppinsBold.style} className={`${styles.heading} mt-3 ml-5 align-center items-center text-center text-3xl`}>
            Total Users
          </div>
      </div>
      </div>
      <div style={PoppinsBold.style} className={`${styles.heading} mt-5 ml-5 align-center items-center text-center`}>
          <button
            style={InterMedium.style}
            className={`px-5 py-3 mt-3 ${styles.btn} ${styles.btn_tx} text-white hover:bg-[#215E9B] focus:bg-[#215E9B] px-3`}
            onClick={handleAkunList}
          >
            Lihat Daftar Akun
          </button>
          </div>
      </div>
    </div>
  );
};

