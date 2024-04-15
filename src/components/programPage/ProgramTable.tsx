import React, { useState } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import useFetchAllProgram from "../../common/hooks/program/useFetchAllProgram";

// import font and css
import styles from "./programTable.module.css";
import { InterMedium } from "../../font/font";
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

  const totalPages = Math.ceil(listAllProgram.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  //To-Do: Filtering

  return (
    <div>
      <div className={` ${styles.heading} text-xl font-bold my-10`}>
        Daftar Program
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
      {listAllProgramLoading ? (
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
              {listAllProgram
                .slice(indexOfFirstItem, indexOfLastItem)
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