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

  const timeout = useRef(null);

  const handleDebounceSearch = (currentQuery) => {
    clearTimeout(timeout.current);

    if (!currentQuery.trim()) {
      props.ssQ("");
      return;
    }

    timeout.current = setTimeout(() => {
      props.ssQ(currentQuery);
    }, 300);
  };

  const handleDebounceSort = (currentQuery) => {
    clearTimeout(timeout.current);

    if (!currentQuery.trim()) {
      props.ssB("");
      return;
    }

    timeout.current = setTimeout(() => {
      props.ssB(currentQuery);
    }, 300);
  };

  const handleDebounceFilter = (currentQuery) => {
    clearTimeout(timeout.current);

    if (!currentQuery.trim()) {
      props.sfB("");
      return;
    }

    timeout.current = setTimeout(() => {
      props.sfB(currentQuery);
    }, 300);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    handleDebounceSort(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
    handleDebounceFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    handleDebounceSearch(e.target.value); // Pass the current value directly
  };

  const handleAddUser = () => {
    router.push("/user/add");
  };

  return (
    <div>
      <div
        className={`flex flex-wrap lg:flex-nowrap gap-2 items-center mb-6 w-full`}
      >
        <input
          type="text"
          placeholder=" Cari"
          value={searchQuery}
          onChange={handleSearchChange}
          className={`flex-grow sm:px-2 sm:py-2 p-1 ${styles.placeholder} ${styles.field}`}
          style={InterReguler.style}
        />
        <select
          value={sortBy}
          onChange={handleSortChange}
          className={`flex-grow sm:px-2 sm:py-2  p-1 ${styles.placeholder} ${styles.field} `}
          style={InterReguler.style}
        >
          <option value="" disabled>
            Sort
          </option>
          <option value="operasional">Operasional</option>
          <option value="pengajar">Pengajar</option>
          <option value="akademik">Akademik</option>
          <option value="">Semua</option>
        </select>
        <select
          value={filterBy}
          onChange={handleFilterChange}
          className={`flex-grow sm:px-2 sm:py-2 p-1  ${styles.placeholder} ${styles.field}`}
          style={InterReguler.style}
        >
          <option value="" disabled>
            Filter
          </option>
          <option value="nama-asc">Nama Asc</option>
          <option value="nama-desc">Nama Desc</option>
          <option value="email-asc">Email Asc</option>
          <option value="email-desc">Email Desc</option>
          <option value="">Semua</option>
        </select>
        <button
          onClick={handleAddUser}
          className={`sm:px-4 sm:py-2 px-2 py-1 ${styles.btn} ${styles.btn_tx} text-white rounded hover:bg-[#215E9B] focus:bg-[#215E9B] `}
          style={InterReguler.style}
        >
          + Tambah Akun
        </button>
      </div>
    </div>
  );
};
