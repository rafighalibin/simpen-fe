import React, { useRef, useState } from "react";
import { InterReguler } from "../../font/font";
import styles from "./SearchPengajar.module.css";

export const SearchPengajar = (props) => {
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    handleDebounceSearch(e.target.value);
  };

  return (
    <div>
      <div
        className={`flex flex-wrap lg:flex-nowrap gap-2 items-center mb-6 w-full`}
      >
        <input
          type="text"
          placeholder=" Cari Pengajar"
          value={searchQuery}
          onChange={handleSearchChange}
          className={`flex-grow sm:px-2 sm:py-2 p-1 ${styles.placeholder} ${styles.field}`}
          style={InterReguler.style}
        />
      </div>
    </div>
  );
};
