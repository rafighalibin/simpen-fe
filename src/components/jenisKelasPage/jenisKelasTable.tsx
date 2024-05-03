"use client";

import React, { useEffect,useState } from "react";
import useFetchAllJenisKelas from "../../common/hooks/jeniskelas/useFetchAllJenisKelas";

// import font and css
import styles from "./jenisKelasTable.module.css";
import { InterMedium, InterReguler, PoppinsBold } from "../../font/font";
import { Filtering } from "./Filtering";
import { useMutation } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { usePathname, useRouter } from "next/navigation";

export const JenisKelasTable = () => {
  const {
    isLoading: jenisKelasLoading,
    error,
    listAllJenisKelas, // Updated variable
    refetch,
  } = useFetchAllJenisKelas(); // Updated hook
  const fetchWithToken = useFetchWithToken();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("");
  const [selectedPage, setSelectedPage] = useState(1);
  const [sortDirection, setSortDirection] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: (id: string) =>
      fetchWithToken(`/kelas/jenis/${id}`, "DELETE")
        .then((res) => {
          if (res.status === 500) {
            alert("Jenis Kelas Internal Server Error. Ada Program yang berhubungan!");
          }
          else {
            alert("Jenis Kelas berhasil dihapus");
          }
          return res.json();
        })
        .catch((error) => {
          console.error(error);
          throw error;
        }),
    onSuccess: () => {
      window.location.href = "/kelas/jenis";
      refetch();
    },
  });
  
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = async (jeniskelas) => {
    if (window.confirm("Are you sure you want to delete this jenis kelas?")) {
      const jenisKelasId = jeniskelas.id;
      await deleteMutation(jenisKelasId);
    }
  };

  const handleDetailClick = (jeniskelas) => {
    const jenisKelasId = jeniskelas.id;
    router.push(`/kelas/jenis/${jenisKelasId}`);
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

  const filteredJenisKelas = listAllJenisKelas.filter((jenisKelas) => {
    return jenisKelas.nama.toLowerCase().includes(searchKeyword.toLowerCase());
  });

  const sortedJenisKelas = [...filteredJenisKelas].sort((a, b) => {
    if (sortBy === "nama_asc") {
      return a.nama.localeCompare(b.nama);
    }
    else if (sortBy === "nama_desc") {
      // If the sort direction is descending, reverse the comparison result
      return b.nama.localeCompare(a.nama);
    }
    return 0;
  });

  const noJenisKelasMessage =
    listAllJenisKelas.length === 0 ? (
      <td colSpan={9} className="text-center px-4 py-4">Belum ada Jenis Kelas.</td>
    ) : null;

  const handleSortByChange = (e) => {
    const selectedSort = e.target.value;
    setSortBy(selectedSort);
    if (selectedSort === sortBy) {
      // If the selected sorting option is the same as the previous one, toggle the sort direction
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      // If the selected sorting option is different from the previous one, set the sort direction to default (asc)
      setSortDirection("asc");
    }
  };

  const handleNextPage = () => {
    setSelectedPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(sortedJenisKelas.length / itemsPerPage))
    );
  };

  const handlePrevPage = () => {
    setSelectedPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const totalPages = Math.ceil(sortedJenisKelas.length / itemsPerPage);

  const paginate = (pageNumber: React.SetStateAction<number>) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`${styles.paginatioan_tx} px-3 py-1 mx-1 ${
            currentPage === i
              ? "bg-[#215E9B] text-white"
              : "bg-[#FFFFFF] border border-[#DFE4EA] text-[#637381] hover:bg-[#A8D4FF] hover:text-white"
          } rounded`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedJenisKelas = sortedJenisKelas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  if (error || !listAllJenisKelas) {
    return (
      <div>
        <div className={` ${styles.heading} text-xl font-bold my-10`}>
          Daftar Jenis Kelas
        </div>
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
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Cari Jenis Kelas..."
          className={`flex-grow sm:px-2 sm:py-2 p-1 ${styles.placeholder} ${styles.field}`}
        />
        <select
          value={sortBy}
          onChange={handleSortByChange}
          className={`flex-grow sm:px-2 sm:py-2  p-1 ${styles.placeholder} ${styles.field} `}
        >
          <option value="">Sort By</option>
          <option value="nama_asc">By Name (Asc)</option>
          <option value="nama_desc">By Name (Desc)</option>
        </select>
        <button
          onClick={handleAddJenisKelas}
          className={`px-4 py-2 ${styles.btn} ${styles.btn_tx} text-white rounded`}
          style={InterReguler.style}
        >
          + Tambah Jenis Kelas
        </button>
      </div>
        <div className={` ${styles.card_form} `}>
            <table className={`table-auto w-full`}>
              <thead
                className={`${styles.table_heading} ${styles.table_heading_text}`}
              >
                <tr>
                  <th className="px-4 py-4 text-center" style={InterMedium.style}>
                    NO
                  </th>
                  <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    JENIS KELAS
                  </th>
                  <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    MODA
                  </th>
                  <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    TIPE
                  </th>
                  <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    BAHASA
                  </th>
                  <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    PIC
                  </th>
                  <th
                    className="px-4 py-4 text-left"
                    style={InterMedium.style}
                  ></th>
                  <th
                    className="px-4 py-4 text-left"
                    style={InterMedium.style}
                  ></th>
                </tr>
              </thead>
              </table>
              <div style={{ textAlign: "center" }}>Error Fetching Jenis Kelas.</div>
          </div>
      </div>
      );
  }

  return (
    <div>
      <div className={` ${styles.heading} text-xl font-bold my-10`}>
        Daftar Jenis Kelas
      </div>
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
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Cari Jenis Kelas..."
          className={`flex-grow sm:px-2 sm:py-2 p-1 ${styles.placeholder} ${styles.field}`}
        />
        <select
          value={sortBy}
          onChange={handleSortByChange}
          className={`flex-grow sm:px-2 sm:py-2  p-1 ${styles.placeholder} ${styles.field} `}
        >
          <option value="">Sort By</option>
          <option value="nama_asc">By Name (Asc)</option>
          <option value="nama_desc">By Name (Desc)</option>
        </select>
        <button
          onClick={handleAddJenisKelas}
          className={`px-4 py-2 ${styles.btn} ${styles.btn_tx} text-white rounded`}
          style={InterReguler.style}
        >
          + Tambah Jenis Kelas
        </button>
      </div>
      {filteredJenisKelas.length === 0 &&
      searchKeyword !== "" ? ( // Jika hasil pencarian nama kosong
        <p className="text-red-500">
          Jenis Kelas dengan nama {searchKeyword} tidak ditemukan.
        </p>
      ) : (
        <>
        <div className={` ${styles.card_form} `}>
          <table className={`table-auto w-full`}>
            <thead
              className={`${styles.table_heading} ${styles.table_heading_text}`}
            >
              <tr>
                <th className="px-4 py-4 text-center" style={InterMedium.style}>
                  NO
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                  JENIS KELAS
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                  MODA
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                  TIPE
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                  BAHASA
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                  PIC
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                  PROGRAM AKTIF
                </th>
                <th
                  className="px-4 py-4 text-left"
                  style={InterMedium.style}
                ></th>
                <th
                  className="px-4 py-4 text-left"
                  style={InterMedium.style}
                ></th>
              </tr>
            </thead>
            <tbody>
              {noJenisKelasMessage}
              {displayedJenisKelas
                .map((jeniskelas, index) => (
                  <tr
                    className={`${styles.table_items_text}`}
                    style={InterMedium.style}
                    key={jeniskelas.id}
                  >
                    <td className="border-b px-4 py-2 text-center">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="border-b px-4 py-5">{jeniskelas.nama}</td>
                    <td className="border-b px-4 py-5">{jeniskelas.pertemuan}</td>
                    <td className="border-b px-4 py-5">{jeniskelas.tipe}</td>
                    <td className="border-b px-4 py-5">{jeniskelas.bahasa}</td>
                    <td className="border-b px-4 py-5">{jeniskelas.picAkademikNama}</td>
                    <td className="border-b px-4 py-5">{jeniskelas.listProgram.length}</td>
                    <td className="border-b px-4 py-5">
                      <button
                        onClick={() => handleDetailClick(jeniskelas)}
                        className={`bg-transparent hover:bg-[#215E9B] text-[#215E9B]  hover:text-white py-2 px-4 border border-[#215E9B] hover:border-transparent rounded-full`}
                      >
                        Detail
                      </button>
                    </td>
                    <td className="border-b px-4 py-5">
                    <button
                      className={`bg-transparent hover:bg-[#F23030] text-[#F23030] hover:text-white py-2 px-4 border border-[#F23030] hover:border-transparent rounded-full`}
                      onClick={() => handleDelete(jeniskelas)}
                    >
                      Delete
                    </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
          <div className="flex justify-center my-4">
            <div className={`${styles.pagination_container} p-2`}>
              <button
                onClick={handlePrevPage}
                disabled={selectedPage === 1}
                className="px-3 py-1 mx-1 bg-white border border-[#DFE4EA] text-[#637381] rounded hover:bg-[#A8D4FF] hover:text-white"
              >
                {"<"}
              </button>
              {renderPageNumbers()}
              <button
                onClick={handleNextPage}
                disabled={selectedPage === totalPages}
                className="px-3 py-1 mx-1 bg-white border border-[#DFE4EA] text-[#637381] rounded hover:bg-[#A8D4FF] hover:text-white"
              >
                {">"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};