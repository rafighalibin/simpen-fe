import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// import css and font
import styles from "./Filtering.module.css";
import { InterReguler } from "../../font/font";
import useFetchWithToken from "../../common/hooks/fetchWithToken";

export const Filtering = (props) => {
  //To-Do: Filtering
  const fetchWithToken = useFetchWithToken();
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modaPertemuanFetched, setModaPertemuanFetched] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const pathname = usePathname();

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

  useEffect(() => {
    const fetchExistingAttributes = async () => {
      try {
        const response = await fetchWithToken(
          "/kelas/jenis/existing-attributes"
        );
        const data = await response.json();
        // Update the form state with the existing attributes
        setModaPertemuanFetched(data.content.modaPertemuan);
      } catch (error) {
        setError("Failed to fetch existing attributes");
      }
    };

    fetchExistingAttributes();
  }, []);

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

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
    handleDebounceFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    handleDebounceSort(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    handleDebounceSearch(e.target.value); // Pass the current value directly
  };

  const handleAddJenisKelas = () => {
    router.push("/kelas/jenis/add");
  };

  const handleBulkDeleteJenisKelas = () => {
    router.push("/kelas/jenis/bulk-delete");
  };

  const handleHome = () => {
    router.push("/kelas/jenis");
  };

  return (
    <div>
      <div className={`flex items-center mb-6 w-full space-x-2`}>
        {pathname === "/kelas/jenis/bulk-delete" ? (
          <button
            onClick={handleHome}
            className={`px-4 py-2 ${styles.btn} ${styles.btn_tx} text-white rounded`}
            style={InterReguler.style}
          >
            Turn Off Bulk Delete
          </button>
        ) : null}
        {pathname !== "/kelas/jenis/bulk-delete" && (
          <button
            onClick={handleBulkDeleteJenisKelas}
            className={`px-4 py-2 bg-[#F23030]/80 hover:bg-[#F23030] text-white rounded`}
            style={InterReguler.style}
          >
            Bulk Delete
          </button>
        )}
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
          <option value="nama-asc">Nama Ascending</option>
          <option value="nama-desc">Nama Descending</option>
          <option value="">None</option>
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
          <option value="moda-asc">Moda Asc</option>
          <option value="moda-desc">Moda Desc</option>
          <option value="">Semua</option>
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
