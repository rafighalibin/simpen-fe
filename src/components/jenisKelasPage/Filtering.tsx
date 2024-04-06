import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

// import css and font
import styles from "./Filtering.module.css";
import { InterReguler } from "../../font/font";

export const Filtering = (props) => {
  //To-Do: Filtering
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleAddJenisKelas = () => {
    router.push("/kelas/jenis/add");
  };

  return (
    <div>
      <div className={`flex items-center mb-6 w-full`}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`flex-grow mr-4 px-2 py-2 ${styles.placeholder} ${styles.field}`}
        />
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className={`flex-grow mr-4 px-2 py-2 ${styles.placeholder} ${styles.field} `}
          style={InterReguler.style}
        >
          <option value="" disabled>
            Sort
          </option>
          <option value="operasional">Operasional</option>
          <option value="pengajar">Pengajar</option>
          <option value="akademik">Akademik</option>
          <option value="">None</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`flex-grow mr-4 px-2 py-2  ${styles.placeholder} ${styles.field}`}
          style={InterReguler.style}
        >
          <option value="" disabled>
            Filter
          </option>
          <option value="nama-asc">Nama Ascending</option>
          <option value="nama-desc">Nama Descending</option>
          <option value="email-asc">Email Ascending</option>
          <option value="email-desc">Email Descending</option>
          <option value="">None</option>
        </select>
        <button
          onClick={handleAddJenisKelas}
          className={`px-4 py-2 ${styles.btn} ${styles.btn_tx} text-white rounded`}
          style={InterReguler.style}
        >
          + Tambah Jenis Kelas
        </button>
      </div>
    </div>
  );
};
