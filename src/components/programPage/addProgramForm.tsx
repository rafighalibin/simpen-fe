"use client";

import React, { useState } from "react";

//import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./addProgramForm.module.css";

export const AddProgramForm = () => {
  const [program, setprogram] = useState("");
  const [jumlahLevel, setJumlahLevel] = useState("");
  const [jumlahPertemuan, setJumlahPertemuan] = useState("");

  return (
    <div className="">
      <div
        className={`${styles.heading} text-center my-10`}
        style={PoppinsBold.style}
      >
        Tambah Program
      </div>
      <div className={`${styles.card_form} px-7 py-8`}>
        <form>
          <div>
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Nama Program
            </div>
            <input
              id="nama-program"
              name="program"
              type="program"
              autoComplete="program"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Nama Program"
              value={program}
              onChange={(e) => setprogram(e.target.value)}
              style={InterReguler.style}
            />
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Jumlah Level
            </div>
            <input
              id="jumlah-level"
              name="jumlah-level"
              type="jumlah-level"
              autoComplete="jumlah-level"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Jumlah Level"
              value={jumlahLevel}
              onChange={(e) => setJumlahLevel(e.target.value)}
              style={InterReguler.style}
            />
            <div
              style={InterReguler.style}
              className={`${styles.form_paragraph} mt-2`}
            >
              Level adalah tingkatan untuk seluruh kelas yang ada dalam program.
            </div>
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Jumlah Level
            </div>
            <select
              id="jumlah-level"
              name="jumlah-level"
              autoComplete="jumlah-level"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              value={jumlahLevel}
              onChange={(e) => setJumlahLevel(e.target.value)}
              style={InterReguler.style}
            >
              <option value="" disabled selected>
                Jumlah Level
              </option>
              <option value="pengajar">Mitra Pengajar</option>
              <option value="operasional">Operasional</option>
              <option value="akademik">Akademik</option>
            </select>
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Jumlah Pertemuan
            </div>
            <select
              id="jumlah-pertemuan"
              name="jumlah-pertemuan"
              autoComplete="jumlah-pertemuan"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              value={jumlahLevel}
              onChange={(e) => setJumlahPertemuan(e.target.value)}
              style={InterReguler.style}
            >
              <option value="" disabled selected>
                Jumlah Pertemuan
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
