import React from "react";
import styles from "./dashboard.module.css";
import { PoppinsBold, PoppinsMedium, InterMedium } from "../../font/font";
import { FiUser } from "react-icons/fi";

export const EstablishProfile = ({ data }) => {
  const userData = data ? data : "Nama tidak tersedia";

  return (
    <div className={`${styles.card1} p-5 text-white`}>
      <div className="ml-3">
        <div style={PoppinsMedium.style} className={`${styles.heading1}`}>
          {"Selamat datang di "}
          <span style={PoppinsBold.style}>Sistem Informasi Mitra Pengajar</span>
        </div>
        <div className=" flex items-center">
          <div>
            <FiUser size={24} /> {/* Profile icon */}
          </div>
          <div className={`${styles.heading_user} ml-5 mt-1`}>
            {userData.nama} sebagai {userData.role}{" "}
          </div>
        </div>
      </div>
    </div>
  );
};
