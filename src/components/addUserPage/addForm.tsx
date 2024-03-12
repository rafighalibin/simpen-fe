"use client";

import React, { useState } from "react";

//import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./addForm.module.css";

export const AddForm = () => {
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("");

  return (
    <div className="px-[6vw] py-8">
      <div className={`${styles.card_breadcrumbs} px-7 py-6`}>
        TO DO: Breadcrumbs
      </div>
      <div
        className={`${styles.heading} text-center my-10`}
        style={PoppinsBold.style}
      >
        Register Akun
      </div>
      <div className={`${styles.card_form} px-7 py-8`}>
        <form>
          <div>
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Email
            </div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={InterReguler.style}
            />
            <div
              style={InterReguler.style}
              className={`${styles.form_paragraph} mt-2`}
            >
              Email yang akan digunakan selama akun ini ada untuk login.
            </div>
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Nama Lengkap
            </div>
            <input
              id="full-name"
              name="name"
              type="name"
              autoComplete="name"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Nama Lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              style={InterReguler.style}
            />
            <div
              style={InterReguler.style}
              className={`${styles.form_paragraph} mt-2`}
            >
              Nama Lengkap ini digunakan sebagai pengidentifikasi selama akun
              ini ada.
            </div>
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Role
            </div>
            <select
              id="role"
              name="role"
              autoComplete="role"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={InterReguler.style}
            >
              <option value="" disabled selected>
                Role
              </option>
              <option value="pengajar">Mitra Pengajar</option>
              <option value="operasional">Operasional</option>
              <option value="akademik">Akademik</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};
