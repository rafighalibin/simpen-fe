import React, { useState } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import useFetchAllProgram from "../../common/hooks/program/useFetchAllProgram";

// import font and css
import styles from "./programTable.module.css";
import { InterMedium, InterReguler } from "../../font/font";
import { Filtering } from "./Filtering";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";

export const ProgramTable = () => {
  const {
    isLoading: listAllProgramLoading,
    error,
    listAllProgram, // Updated variable
    refetch,
  } = useFetchAllProgram(); // Updated hook
  const fetchWithToken = useFetchWithToken();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState(1);
  const [sortDirection, setSortDirection] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");


  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: (id: string) =>
      fetchWithToken(`/kelas/program/${id}`, "DELETE")
        .then((res) => {
          if (res.status === 500) {
            alert("Program Internal Server Error. Cek kembali relasionalnya!");
          }
          else {
            alert("Program berhasil dihapus");
          }
          return res.json();
        })
        .catch((error) => {
          console.error(error);
          throw error;
        }),
    onSuccess: () => {
      window.location.href = "/kelas/program";
    },
  });

  const handleDelete = async (program) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      const programId = program.id;
      await deleteMutation(programId);
    }
  };

  const handleDetailClick = (program) => {
    const programId = program.id;
    router.push(`/kelas/program/${programId}`);
  };

  const handleAddProgram = () => {
    router.push("/kelas/program/add");
  };

  const filteredProgram = listAllProgram.filter((program) => {
    return program.nama.toLowerCase().includes(searchKeyword.toLowerCase());
  });

  const sortedProgram = [...filteredProgram].sort((a, b) => {
    if (sortBy === "nama_asc") {
      return a.nama.localeCompare(b.nama);
    }
    else if (sortBy === "nama_desc") {
      // If the sort direction is descending, reverse the comparison result
      return b.nama.localeCompare(a.nama);
    }
    return 0;
  });

  const noProgramMessage =
    listAllProgram.length === 0 ? (
      <td colSpan={6} className="text-center px-4 py-4">Belum ada Program.</td>
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
      Math.min(prevPage + 1, Math.ceil(sortedProgram.length / itemsPerPage))
    );
  };

  const handlePrevPage = () => {
    setSelectedPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const totalPages = Math.ceil(sortedProgram.length / itemsPerPage);

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
  const displayedProgram = sortedProgram.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div>
      <div className={` ${styles.heading} text-xl font-bold my-10`}>
        Daftar Program
      </div>
      <div className={`flex items-center mb-6 w-full space-x-2`}>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Cari Program..."
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
          onClick={handleAddProgram}
          className={`px-4 py-2 ${styles.btn} ${styles.btn_tx} text-white rounded`}
          style={InterReguler.style}
        >
          + Tambah Program
        </button>
      </div>
      {filteredProgram.length === 0 &&
      searchKeyword !== "" ? ( // Jika hasil pencarian nama kosong
        <p className="text-red-500">
          Program dengan nama {searchKeyword} tidak ditemukan.
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
                  PROGRAM
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                  JUMLAH LEVEL
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                  JUMLAH PERTEMUAN
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
              {noProgramMessage}
              {displayedProgram
                .map((program, index) => (
                  <tr
                    className={`${styles.table_items_text}`}
                    style={InterMedium.style}
                    key={program.id}
                  >
                    <td className="border-b px-4 py-2 text-center">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="border-b px-4 py-5">{program.nama}</td>
                    <td className="border-b px-4 py-5">{program.jumlahLevel}</td>
                    <td className="border-b px-4 py-5">{program.jumlahPertemuan}</td>
                    <td className="border-b px-4 py-5">
                      <button
                        onClick={() => handleDetailClick(program)}
                        className={`bg-transparent hover:bg-[#215E9B] text-[#215E9B]  hover:text-white py-2 px-4 border border-[#215E9B] hover:border-transparent rounded-full`}
                      >
                        Detail
                      </button>
                    </td>
                    <td className="border-b px-4 py-5">
                    <button
                      className={`bg-transparent hover:bg-[#F23030] text-[#F23030] hover:text-white py-2 px-4 border border-[#F23030] hover:border-transparent rounded-full`}
                      onClick={() => handleDelete(program)}
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