"use client";

import React, { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { PengajarDetail, PengajarSelect } from "../../common/types/pengajar";
import Loading from "../../common/components/Loading";
import { TagDetail, TagSelect } from "../../common/types/tag";
import Select from "react-select";

export const DaftarPengajar = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [listTagExisting, setListTagExisting] = useState<TagSelect[]>([]);
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const fetchWithToken = useFetchWithToken();
  const [searchType, setSearchType] = useState("nama");
  const [selectedPage, setSelectedPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [listPengajarExisting, setListPengajarExisting] = useState<
    PengajarDetail[]
  >([]);
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["listUser"],
    queryFn: () => fetchWithToken(`/user`).then((res) => res.json()),
    onSuccess(data) {
      if (data) {
        for (let i = 0; i < data.content.length; i++) {
          if (data.content[i].role === "pengajar") {
            data.content[i].user.forEach((element: PengajarDetail) => {
              listPengajarExisting.push(element);
            });
          }
        }
        console.log(listPengajarExisting);
      }
    },
  });

  const {
    isLoading: TagLoading,
    error: tagError,
    data: tag,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchWithToken(`/tag`).then((res) => res.json()),
    onSuccess(data) {
      if (data) {
        let tags = data.content.map((element: TagDetail) => ({
          value: element.id,
          label: element.nama,
        }));
        setListTagExisting(tags);
      }
    },
  });

  if (isLoading || TagLoading) {
    return <Loading />;
  }

  const filteredPengajar = listPengajarExisting.filter((pengajar) => {
    if (searchType === "nama") {
      return pengajar.nama.toLowerCase().includes(searchKeyword.toLowerCase());
    } else if (searchType === "tag") {
      return searchKeywords.every((keyword) =>
        pengajar.listTag.some((tag) =>
          tag.nama.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
  });

  const sortedPengajar = [...filteredPengajar].sort((a, b) => {
    if (sortBy === "nama_asc") {
      return a.nama.localeCompare(b.nama);
    }
    //  else if (sortBy === "jumlahKelas") {
    //   return a.jumlahKelas - b.jumlahKelas;
    // }
    else if (sortBy === "nama_desc") {
      // If the sort direction is descending, reverse the comparison result
      return b.nama.localeCompare(a.nama);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedPengajar.length / itemsPerPage);

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

  const indexOfLastItem = selectedPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedPengajar = sortedPengajar.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
      Math.min(prevPage + 1, Math.ceil(sortedPengajar.length / itemsPerPage))
    );
  };

  const handlePrevPage = () => {
    setSelectedPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const noPengajarMessage =
    listPengajarExisting.length === 0 ? (
      <p className="text-center text-gray-500">Tidak ada pengajar ditemukan.</p>
    ) : null;

  return (
    <div className="px-2 py-16 space-y-10 flex-grow flex flex-col justify-center">
      <h1 className="text-6xl font-bold pb-4">Daftar Pengajar</h1>
      <div className="mt-4 flex items-center">
        {searchType === "tag" ? (
          <Select
            value={searchKeywords.map((keyword) => ({
              value: keyword,
              label: keyword,
            }))} // Mengubah nilai searchKeywords menjadi format yang sesuai dengan format yang diterima oleh Select
            isMulti // Memungkinkan pemilihan lebih dari satu tag
            onChange={(selectedOptions) =>
              setSearchKeywords(selectedOptions.map((option) => option.value))
            } // Mengubah nilai searchKeywords saat tag dipilih atau dihapus
            options={listTagExisting.map((tag) => ({
              value: tag.label.toLowerCase(),
              label: tag.label,
            }))} // Mengonversi listTagExisting ke format yang sesuai dengan format yang diterima oleh Select
            className="flex-grow px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
        ) : (
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Cari Pengajar"
            className="flex-grow px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          />
        )}
        <select
          value={sortBy}
          onChange={handleSortByChange}
          className="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        >
          <option value="">Sort By</option>
          <option value="nama_asc">By Name (Asc)</option>
          <option value="nama_desc">By Name (Desc)</option>
          <option value="jumlahPengajar">By Jumlah Kelas</option>
        </select>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        >
          <option value="nama">Cari berdasarkan Nama</option>
          <option value="tag">Cari berdasarkan Tag</option>
        </select>
        <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
          <a href={`/tag`}>Daftar Tag</a>
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        {noPengajarMessage}
        {filteredPengajar.length === 0 &&
        searchKeyword !== "" &&
        searchType === "nama" ? ( // Jika hasil pencarian nama kosong
          <p className="text-red-500">
            Pengajar dengan nama {searchKeyword} tidak ditemukan.
          </p>
        ) : filteredPengajar.length === 0 && searchType === "tag" ? ( // Jika hasil pencarian tag kosong
          <p className="text-red-500">
            Pengajar dengan tag yang dipilih tidak ditemukan.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-10 py-16 px-6">
              {displayedPengajar.map((pengajar, index) => (
                <div
                  key={pengajar.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col items-center"
                >
                  <div className="mt-1 relative w-48 h-48 flex items-center justify-center rounded-full overflow-hidden">
                    <input
                      disabled
                      type="file"
                      value={""}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    {pengajar.fotoDiri && (
                      <img
                        src={pengajar.fotoDiri}
                        alt="Foto Diri"
                        className="object-cover w-full h-full"
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                    {!pengajar.fotoDiri && (
                      <div className="bg-neutral/5 rounded-full flex items-center justify-center w-full h-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-12 h-12"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-medium">
                      {indexOfFirstItem + index + 1}
                    </p>
                    <p className="mt-2">{pengajar.nama}</p>
                    {/* <p>{pengajar.jumlahKelas}</p> */}
                    <div className="flex flex-wrap justify-center gap-1 pt-4">
                      {pengajar.listTag.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center bg-gray-200 rounded-md p-1 mr-1 mb-1"
                        >
                          <span className="text-sm">{tag.nama}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end p-4">
                    <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
                      <a href={`/pengajar/${pengajar.id}`}>Detail</a>
                    </button>
                  </div>
                </div>
              ))}
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
  );
};
