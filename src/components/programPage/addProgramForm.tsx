"use client";

import React, { useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";

//import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./addProgramForm.module.css";

//import component
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import useFetchAllJenisKelas from "../../common/hooks/jeniskelas/useFetchAllJenisKelas";

export const AddProgramForm = () => {
  const fetchWithToken = useFetchWithToken();
  const { isLoading: listAllJenisKelasLoading, listAllJenisKelas } = useFetchAllJenisKelas();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedPage, setSelectedPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [formState, setFormState] = useState({
    nama: "",
    jumlahLevel: null,
    jumlahPertemuan: null,
    jenisKelas: [],
  });

  const { mutateAsync: addProgramMutation, data: response } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/program`, "POST", formState).then((res) => res.json()),
    onSuccess: (data) => {
      if (data.code == 200) {
        console.log(data.content);
        setSuccess("Sukses menambahkan.");
        setTimeout(() => {
          window.location.href = "/kelas/program";
        }, 1000);
      } else if (data.code == 400) {
        setError("Program sudah pernah ada.");
        setFormState({
          nama: "",
          jumlahLevel: null,
          jumlahPertemuan: null,
          jenisKelas: [],
        });
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProgramMutation();
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

  return (
    <div className="">
      <div
        className={`${styles.heading} text-center my-10`}
        style={PoppinsBold.style}
      >
        Tambah Program
      </div>
      <div className={`${styles.card_form} px-7 py-8`}>
        <form onSubmit={handleSubmit}>
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
              value={formState.nama}
              onChange={(e) =>
                setFormState({ ...formState, nama: e.target.value })
              }
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
              value={formState.jumlahLevel}
              onChange={(e) =>
                setFormState({ ...formState, jumlahLevel: parseInt(e.target.value) })
              }
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
              Jumlah Pertemuan
            </div>
            <input
              id="jumlah-pertemuan"
              name="jumlah-pertemuan"
              type="jumlah-pertemuan"
              autoComplete="jumlah-pertemuan"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Jumlah Pertemuan"
              value={formState.jumlahPertemuan}
              onChange={(e) =>
                setFormState({ ...formState, jumlahPertemuan: parseInt(e.target.value) })
              }
              style={InterReguler.style}
            />
            <div
              style={InterReguler.style}
              className={`${styles.form_paragraph} mt-2`}
            >
              Jumlah Pertemuan adalah banyaknya kelas yang akan diadakan dalam program.
            </div>
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Jenis Kelas
            </div>
            <div className={`flex items-center mb-6 w-full space-x-2`}>
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
            </div>
            {filteredJenisKelas.length === 0 &&
            searchKeyword !== "" ? ( // Jika hasil pencarian nama kosong
              <p className="text-red-500">
                Jenis Kelas dengan nama {searchKeyword} tidak ditemukan.
              </p>
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
                  <td className="border-b px-4 py-5">
                    <input
                        id={jeniskelas.id}
                        name="jenis-kelas"
                        type="checkbox"
                        value={jeniskelas.id}
                        checked={formState.jenisKelas.includes(jeniskelas.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormState({
                              ...formState,
                              jenisKelas: [...formState.jenisKelas, jeniskelas.id],
                            });
                          } else {
                            setFormState({
                              ...formState,
                              jenisKelas: formState.jenisKelas.filter((t) => t !== jeniskelas.id),
                            });
                          }
                        }}
                        className="mr-2"
                      />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          </div>
          )}
            <div
              style={InterReguler.style}
              className={`${styles.form_paragraph} mt-2`}
            >
              Pilih Jenis Kelas yang diinginkan.
            </div>
          </div>
          <div className="mt-5">
            {success && (
              <div
                className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2"
                style={InterReguler.style}
              >
                {success}
              </div>
            )}
            {error && (
              <div
                className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2"
                style={InterReguler.style}
              >
                {error}
              </div>
            )}
            {!listAllJenisKelas.length && (
              <div
                className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2"
                style={InterReguler.style}
              >
                Tambah Jenis Kelas terlebih dahulu bila ingin menambah Program!
              </div>
            )}
          </div>
          <div className="flex justify-center mt-9">
            {listAllJenisKelas.length > 0 && (
              <button
                type="submit"
                className={`${styles.button_tx} ${styles.btn} hover:bg-[#215E9B] focus:bg-[#215E9B]`}
                style={InterMedium.style}
              >
                Tambah Program
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
