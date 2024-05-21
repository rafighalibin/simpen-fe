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
import useFetchAllFeedback from "../../common/hooks/feedback/useFetchAllFeedback";

export const StatsAkad = () => {
  const { pengguna } = useAuthContext();
  const fetchWithToken = useFetchWithToken();

  const {
    isLoading: listAllFeedbackLoading,
    error,
    listFeedback,
    refetch,
  } = useFetchAllFeedback();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleKelas = () => {
    window.location.href = "/feedback";
  };

  const handlePerubahanKelas = () => {
    window.location.href = `/perubahan-kelas`;
  };

  console.log(listFeedback);
  const pendingFeedbackCount = listFeedback.filter(
    (feedback) => !feedback.finished
  ).length;

  return (
    <div className="flex-grow grid grid-flow-row-dense">
      <div className={`${styles.card6} p-5`}>
        <div className="flex items-center align-middle">
          <div>
            <FiBook size={32} className="align-middle mt-2 ml-4" />{" "}
            {/* Profile icon */}
          </div>
          <div
            style={PoppinsBold.style}
            className={`${styles.heading_announcement} ml-5 mt-4 mb-2`}
          >
            Total Feedback Pengajar Pending
          </div>
        </div>
        <div className="flex-wrap items-center align-middle">
          <div
            style={PoppinsBold.style}
            className={`${styles.heading} mt-12 ml-5 align-center items-center text-center text-8xl`}
          >
            {pendingFeedbackCount}
          </div>
          <div
            style={PoppinsBold.style}
            className={`${styles.heading} mt-3 ml-5 align-center items-center text-center text-3xl`}
          >
            Pending
          </div>
          <div
            style={PoppinsBold.style}
            className={`${styles.heading} mt-3 ml-5 align-center items-center text-center`}
          >
            <button
              style={InterMedium.style}
              className={`px-5 py-3 mt-3 mb-12 ${styles.btn} ${styles.btn_tx} text-white hover:bg-[#215E9B] focus:bg-[#215E9B] px-3`}
              onClick={handleKelas}
            >
              Lihat Daftar Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
