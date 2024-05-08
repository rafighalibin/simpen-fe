"use client";

import React, { useEffect, useState } from "react";
import styles from "./FeedbackListTable.module.css";
import { InterMedium, PoppinsBold } from "../../font/font";
import Loading from "../../app/loading";
import { SearchPengajar } from "./SearchPengajar";
import { useRouter } from "next/navigation";
import useFetchAllFeedbackPengajar from "../../common/hooks/feedback/useFetchAllFeedbackPengajar";
import { useAuthContext } from "../../common/utils/authContext";

export const FeedbackListPengajarTable = () => {
  const { pengguna } = useAuthContext();
  const {
    isLoading: listAllFeedbackLoading,
    error,
    listFeedback,
    refetch,
  } = useFetchAllFeedbackPengajar(pengguna.id);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (listFeedback) {
      let filtered = listFeedback;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((feedback) =>
          feedback.namaPengajar.toLowerCase().includes(query)
        );
      }

      filtered.sort((a, b) => {
        const dateA = new Date(
          a.tanggalPembuatan[0],
          a.tanggalPembuatan[1] - 1,
          a.tanggalPembuatan[2],
          a.tanggalPembuatan[3],
          a.tanggalPembuatan[4],
          a.tanggalPembuatan[5],
          a.tanggalPembuatan[6]
        );
        const dateB = new Date(
          b.tanggalPembuatan[0],
          b.tanggalPembuatan[1] - 1,
          b.tanggalPembuatan[2],
          b.tanggalPembuatan[3],
          b.tanggalPembuatan[4],
          b.tanggalPembuatan[5],
          b.tanggalPembuatan[6]
        );

        const compareDates = (date1, date2) => {
          if (date1 > date2) return -1;
          if (date1 < date2) return 1;
          return 0;
        };

        return compareDates(dateA, dateB);
      });

      filtered.sort((a, b) =>
        a.finished === b.finished ? 0 : a.finished ? 1 : -1
      );
      setFilteredFeedbacks(filtered);
    }
  }, [listFeedback, searchQuery]);

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`${styles.pagination_tx} px-3  py-2 mx-1 ${
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

  console.log(listFeedback);

  const handleDetailClick = (feedback) => {
    const feedbackId = feedback.id;
    router.push(`/feedback/${feedbackId}`);
  };

  return (
    <div>
      <div
        className={` ${styles.heading} md:my-10 my-6`}
        style={PoppinsBold.style}
      >
        Daftar Feedback Pengajar
      </div>
      <div>
        <SearchPengajar sQ={searchQuery} ssQ={setSearchQuery} />
      </div>
      <div>
        {!filteredFeedbacks ? (
          <Loading />
        ) : (
          <div className={` ${styles.card_form} `}>
            {filteredFeedbacks.length === 0 ? (
              <div
                className={`p-6 ${styles.table_items_text}`}
                style={InterMedium.style}
              >
                Feedback tidak ditemukan.
              </div>
            ) : (
              <table className={`table-auto w-full`}>
                <thead
                  className={`${styles.table_heading} ${styles.table_heading_text}`}
                >
                  <tr>
                    <th
                      className="px-4 py-4 text-center md:block hidden"
                      style={InterMedium.style}
                    >
                      NO
                    </th>
                    <th
                      className="px-4 py-4 text-left"
                      style={InterMedium.style}
                    >
                      KELAS
                    </th>
                    <th
                      className="px-4 py-4 text-left hidden md:table-cell"
                      style={InterMedium.style}
                    >
                      TANGGAL SELESAI
                    </th>
                    <th
                      className="px-4 py-4 text-left hidden md:table-cell"
                      style={InterMedium.style}
                    >
                      STATUS
                    </th>
                    <th
                      className="px-4 py-4 text-left hidden md:table-cell"
                      style={InterMedium.style}
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedbacks
                    .slice(indexOfFirstItem, indexOfLastItem)
                    .map((feedback, index) => (
                      <tr
                        className={`${styles.table_items_text} hover:bg-[#eaf5ff]`}
                        style={InterMedium.style}
                        key={feedback.id}
                        //   onClick={() => handleDetailClick(user)}
                      >
                        <td className="border-b px-4 py-2 hidden md:table-cell text-center ">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="border-b px-4 py-5">
                          {feedback.namaProgram}
                        </td>
                        <td className="border-b px-4 py-5 hidden md:table-cell">
                          {feedback.tanggalPembuatan[2] + "/" + feedback.tanggalPembuatan[1] + "/" + feedback.tanggalPembuatan[0]}
                        </td>
                        {!feedback.finished ? (
                          <td className="border-b px-4 py-5 hidden md:table-cell text-red-500">
                            Pending
                          </td>
                        ) : (
                          <td className="border-b px-4 py-5 hidden md:table-cell text-[#215E9B]">
                            Finished
                          </td>
                        )}
                        {!feedback.finished ? (
                          <td className="border-b px-4 py-5 hidden md:table-cell text-red-500">
                          </td>
                        ) : (
                          <td className="border-b px-4 py-5 md:table-cell hidden">
                            <button
                              onClick={() => handleDetailClick(feedback)}
                              className={`bg-transparent hover:bg-[#215E9B] text-[#215E9B] focus:bg-[#215E9B] focus:text-white hover:text-white py-2 px-4 border border-[#215E9B] hover:border-transparent rounded-full`}
                            >
                              Detail
                            </button>
                        </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
            <div className={`flex justify-center my-4`}>
              <div className={`${styles.pagination_container} p-2`}>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 mx-1 bg-white border border-[#DFE4EA] text-[#637381] rounded hover:bg-[#A8D4FF] hover:text-white`}
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
    </div>
  );
};
