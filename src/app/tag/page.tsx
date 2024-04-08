"use client";

import React, { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "react-query";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useAuthContext } from "../../common/utils/authContext";
import { Breadcrumbs } from "../../components/breadcrumbs/breadcrumbs";
import Loading from "../../common/components/Loading";

interface Tag {
  id: number;
  nama: string;
  jumlahPengajar: number;
}

export default function TagPage() {
  const queryClient = useQueryClient();
  const { checkPermission } = useAuthContext();
  const fetchWithToken = useFetchWithToken();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPage, setSelectedPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { isLoading, error, data } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchWithToken(`/tag`).then((res) => res.json()),
  });

  const {
    mutateAsync: deleteTagMutation,
    data: Tag,
    isSuccess,
  } = useMutation({
    mutationFn: (id: number) =>
      fetchWithToken(`/tag/${id}`, "DELETE").then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries("tags");
      localStorage.setItem("DeleteTagSuccess", "true");
    },
  });

  useEffect(() => {
    // Check if localStorage is available
    if (typeof localStorage !== "undefined") {
      // Check success status in localStorage
      const tagSuccess = localStorage.getItem("tagSuccess");
      const updateTagSuccess = localStorage.getItem("UpdateTagSuccess");
      const deleteTagSuccess = localStorage.getItem("DeleteTagSuccess");

      console.log(tagSuccess, updateTagSuccess, deleteTagSuccess);
      // Remove success status from localStorage after displaying
      if (tagSuccess === "true") {
        setShowSuccessAlert(true);
      } else if (updateTagSuccess === "true") {
        setShowSuccessAlert(true);
      } else {
        setShowSuccessAlert(true);
      }
    }
  }, []);
  // Remove success status from localStorage after displaying
  useEffect(() => {
    if (showSuccessAlert) {
      // Check if localStorage is available
      if (typeof localStorage !== "undefined") {
        // Check success status in localStorage
        const tagSuccess = localStorage.getItem("tagSuccess");
        const updateTagSuccess = localStorage.getItem("UpdateTagSuccess");
        const deleteTagSuccess = localStorage.getItem("DeleteTagSuccess");

        console.log(tagSuccess, updateTagSuccess, deleteTagSuccess);
        if (tagSuccess === "true") {
          localStorage.removeItem("tagSuccess");
        }
        if (deleteTagSuccess === "true") {
          localStorage.removeItem("DeleteTagSuccess");
        }
        if (updateTagSuccess === "true") {
          localStorage.removeItem("UpdateTagSuccess");
        }
      }
    }
  }, [showSuccessAlert]);

  if (isLoading) {
    return <Loading />;
  }

  const filteredTags: Tag[] = data.content.filter((tag: Tag) =>
    tag.nama.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const sortedTags = [...filteredTags].sort((a, b) => {
    if (sortBy === "nama_asc") {
      return a.nama.localeCompare(b.nama);
    } else if (sortBy === "jumlahPengajar_asc") {
      return a.jumlahPengajar - b.jumlahPengajar;
    } else if (sortBy === "jumlahPengajar_desc") {
      return b.jumlahPengajar - a.jumlahPengajar;
    } else if (sortBy === "nama_desc") {
      // If the sort direction is descending, reverse the comparison result
      return b.nama.localeCompare(a.nama);
    }
    return 0;
  });
  const totalPages = Math.ceil(sortedTags.length / itemsPerPage);

  const paginate = (pageNumber) => setSelectedPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 mx-1 ${
            selectedPage === i
              ? "bg-blue-700 text-white"
              : "bg-white border border-[#DFE4EA] text-[#637381] hover:bg-[#A8D4FF] hover:text-white"
          } rounded`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  let successMessage = null;

  if (localStorage.getItem("tagSuccess") === "true") {
    successMessage = "Tag successfully added.";
  } else if (localStorage.getItem("UpdateTagSuccess") === "true") {
    successMessage = "Tag successfully updated.";
  } else if (localStorage.getItem("DeleteTagSuccess") === "true") {
    successMessage = "Tag successfully deleted.";
  }

  const indexOfLastItem = selectedPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedTags = sortedTags.slice(indexOfFirstItem, indexOfLastItem);

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

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTagMutation(id);
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };
  const handleNextPage = () => {
    setSelectedPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(sortedTags.length / itemsPerPage))
    );
  };

  const handlePrevPage = () => {
    setSelectedPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    checkPermission(true, true, false) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs />
        <div className="px-20 py-20 space-y-10 flex-grow flex flex-col justify-center">
          {/* Success Alert */}
          {showSuccessAlert && successMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> {successMessage}</span>

              <span
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setShowSuccessAlert(false)}
              >
                <svg
                  className="fill-current h-6 w-6 text-green-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path
                    fillRule="evenodd"
                    d="M14.348 5.652a.5.5 0 0 1 0 .707l-8 8a.5.5 0 1 1-.707-.707l8-8a.5.5 0 0 1 .707 0z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M5.652 5.652a.5.5 0 0 0-.707 0l-8 8a.5.5 0 0 0 .707.707l8-8a.5.5 0 0 0 0-.707z"
                  />
                </svg>
              </span>
            </div>
          )}
          <h1 className="text-6xl font-bold mb-6">Daftar Tag</h1>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Cari Nama Tag"
              className="flex-grow px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
            <select
              value={sortBy}
              onChange={handleSortByChange}
              className="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            >
              <option value="">Sort By</option>
              <option value="nama_asc">By Name (Asc)</option>
              <option value="nama_desc">By Name (Desc)</option>
              <option value="jumlahPengajar_asc">
                By Jumlah Pengajar (Asc)
              </option>
              <option value="jumlahPengajar_desc">
                By Jumlah Pengajar (Desc)
              </option>
            </select>
            <Link href={`/tag/create`}>
              <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
                Tambah Tag
              </button>
            </Link>
          </div>

          {sortedTags.length === 0 ? (
            <div className="text-center text-gray-500">
              Belum ada tag atau tag tidak ditemukan.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mt-4 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Tag
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Pengajar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedTags.map((tag, index) => (
                      <tr key={tag.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {tag.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {tag.jumlahPengajar}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="gap-8">
                            <Link href={`/tag/edit/${tag.id}`}>
                              <button className="bg-transparent hover:bg-infoHover text-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-full">
                                Ubah
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteTag(tag.id)}
                              className="bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center my-4">
                <div className="p-2">
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
      </div>
    )
  );
}
