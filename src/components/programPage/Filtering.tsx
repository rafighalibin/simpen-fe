import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

// import css and font
import styles from "./Filtering.module.css";
import { InterReguler } from "../../font/font";

export const Filtering = (props) => {
  //To-Do: Filtering
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  

  const handleAddProgram = () => {
    router.push("/kelas/program/add");
  };

  const handleHome = () => {
    router.push("/kelas/program");
  };

  return (
    <div>
      <div className={`flex items-center mb-6 w-full space-x-2`}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`flex-grow mr-4 px-2 py-2 ${styles.placeholder} ${styles.field}`}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`flex-grow mr-4 px-2 py-2 ${styles.placeholder} ${styles.field} `}
          style={InterReguler.style}
        >
          <option value="" disabled>
            Sort
          </option>
          <option value="nama-asc">Nama Ascending</option>
          <option value="nama-desc">Nama Descending</option>
          <option value="">None</option>
        </select>

        <button
          onClick={handleAddProgram}
          className={`px-4 py-2 ${styles.btn} ${styles.btn_tx} text-white rounded`}
          style={InterReguler.style}
        >
          + Tambah Program
        </button>
      </div>
    </div>
  );
};
