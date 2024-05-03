"use client";

import React, { useEffect,useState } from "react";
import useFetchAllJenisKelas from "../../common/hooks/jeniskelas/useFetchAllJenisKelas";

// import font and css
import styles from "./jenisKelasTable.module.css";
import { InterMedium, PoppinsBold } from "../../font/font";
import { Filtering } from "./Filtering";
import { useMutation } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";

export const JenisKelasTable = () => {
  const {
    isLoading: jenisKelasLoading,
    error,
    listAllJenisKelas, // Updated variable
    refetch,
  } = useFetchAllJenisKelas(); // Updated hook
  const fetchWithToken = useFetchWithToken();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: (id: string) =>
      fetchWithToken(`/kelas/jenis/${id}`, "DELETE")
        .then((res) => {
          if (res.status === 500) {
            alert("Jenis Kelas Internal Server Error. Ada Program yang berhubungan!");
          }
          return res.json();
        })
        .catch((error) => {
          console.error(error);
          throw error;
        }),
    onSuccess: () => {
      refetch();
    },
  });
  
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = async (jeniskelas) => {
    const jenisKelasId = jeniskelas.id;
    await deleteMutation(jenisKelasId);
  };

  const totalPages = Math.ceil(listAllJenisKelas.length / itemsPerPage);

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

  //To-Do: Filtering

  if (error || !listAllJenisKelas) {
    return (
      <div>
        <div className={` ${styles.heading} text-xl font-bold my-10`}>
          Daftar Jenis Kelas - Bulk Delete
        </div>
        <div>
          <Filtering
            sQ={searchQuery}
            ssQ={setSearchQuery}
            sB={sortBy}
            ssB={setSortBy}
            fB={filterBy}
            sfB={setFilterBy}
          />
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
              <div style={{ textAlign: "center" }} className="px-4 py-4">Error Fetching Jenis Kelas.</div>
          </div>
      </div>
      );
  }

  if (listAllJenisKelas.length === 0) {
    return (
    <div>
      <div className={` ${styles.heading} text-xl font-bold my-10`}>
        Daftar Jenis Kelas - Bulk Delete
      </div>
      <div>
        <Filtering
          sQ={searchQuery}
          ssQ={setSearchQuery}
          sB={sortBy}
          ssB={setSortBy}
          fB={filterBy}
          sfB={setFilterBy}
        />
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
            <div style={{ textAlign: "center" }} className="px-4 py-4">Belum ada Jenis Kelas.</div>
        </div>
    </div>
    );
  }

  return (
    <div>
      <div className={` ${styles.heading} text-xl font-bold my-10`}>
        Daftar Jenis Kelas - Bulk Delete
      </div>
      
      <div>
        <Filtering
          sQ={searchQuery}
          ssQ={setSearchQuery}
          sB={sortBy}
          ssB={setSortBy}
          fB={filterBy}
          sfB={setFilterBy}
        />
      </div>
      {jenisKelasLoading ? (
        <div>Loading...</div>
      ) : (
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
                  TOTAL PROGRAM
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
              {listAllJenisKelas
                .slice(indexOfFirstItem, indexOfLastItem)
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
          <div className={`flex justify-center my-4`}>
            <div className={`${styles.pagination_container} p-2`}>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-white border border-[#DFE4EA] text-[#637381] rounded hover:bg-[#A8D4FF] hover:text-white"
              >
                {"<"}
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-white border border-[#DFE4EA] text-[#637381] rounded hover:bg-[#A8D4FF] hover:text-white"
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};