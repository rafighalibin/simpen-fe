import React from "react";
import styles from "./dashboard.module.css";
import { PoppinsBold, PoppinsMedium, InterMedium } from "../../font/font";
import { FiUser } from "react-icons/fi";

export const EstablishProfile = ({ data }) => {
  const userData = data ? data : "Nama tidak tersedia";

  return (
    <div className={`${styles.card1} p-5`}>
      <div className="ml-5 mt-2 mb-2 mr-8">
        <div style={PoppinsMedium.style} className={`${styles.heading1} text-inherit`}>
          <span style={PoppinsBold.style}>Selamat Datang, 👋</span>
        </div>
        {userData.nama && userData.nama.match(/[a-zA-Z]/) && (
        <div className={`${styles.heading_user}`}>
            <span>{userData.nama}!</span>
        </div>
        )}
        <div className={`${styles.heading_user}`}>
            <span>sebagai <span style={PoppinsBold.style}>{userData.role}</span></span>
        </div>
      </div>
    </div>
  );
};

