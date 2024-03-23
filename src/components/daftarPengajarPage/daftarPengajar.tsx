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
import { PengajarDetail, PengajarSelect } from "../../common/types/pengajar";
import useFetchPengajarDetail from "../../common/hooks/user/useFetchPengajarDetail";
import Loading from "../../common/components/Loading";

interface Pengajar {
  id: number;
  nama: string;
  jumlahKelas: number;
}

export const DaftarPengajar = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const fetchWithToken = useFetchWithToken();
  const [selectedPage, setSelectedPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [listPengajarExisting, setListPengajarExisting] = useState<PengajarDetail[]>(
    []
  );
  const { isLoading, error, data, refetch} = useQuery({
    queryKey: ["listUser"],
    queryFn: () => fetchWithToken(`/user`).then((res) => res.json()),
    onSuccess(data) {
      if(data){
        data.content[2].user.forEach((element: PengajarDetail) => {
          listPengajarExisting.push(element);
        });
        console.log(listPengajarExisting);
      }
    },
  });
  
  if (isLoading) {
    return <Loading />;
  }
  
  const filteredPengajar: PengajarDetail[] = listPengajarExisting.filter(
    (pengajar: PengajarDetail) =>
      pengajar.nama.toLowerCase().includes(searchKeyword.toLowerCase())
  );

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

  const itemsPerPage = 4;
  const startIndex = (selectedPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedPengajar.length);
  const displayedPengajar = sortedPengajar.slice(startIndex, endIndex);

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

  return (
    <div className="px-2 py-16 space-y-10 flex-grow flex flex-col justify-center">
      <h1 className="text-5xl font-bold pb-2">Daftar Pengajar</h1>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Cari Pengajar"
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
          <option value="jumlahPengajar">By Jumlah Kelas</option>
        </select>
        <select
          value={sortBy}
          onChange={handleSortByChange}
          className="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        >
          <option value="">Filter</option>
          {/* <option value="nama_asc">By Name (Asc)</option>
          <option value="nama_desc">By Name (Desc)</option> */}
          <option value="jumlahPengajar">By Tag</option>
        </select>
        <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
          <a href={`/tag`}>Daftar Tag</a>
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        {
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
                  <p className="font-medium">{startIndex + index + 1}</p>
                  <p className="mt-2">{pengajar.nama}</p> 
                  {/* <p>{pengajar.jumlahKelas}</p> */}
                </div>
                <div className="flex justify-end p-4">
                  <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
                    <a href={`/user/profile/${pengajar.id}`}>Detail</a>
                  </button>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
      <div className="flex justify-center space-x-3 items-center">
        <button
          onClick={handlePrevPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Previous Page
        </button>
        {(() => {
          const numPages = Math.ceil(sortedPengajar.length / itemsPerPage);
          const startPage =
            selectedPage <= 3 ? 1 : Math.min(selectedPage - 2, numPages - 3);
          const endPage = Math.min(startPage + 3, numPages);
          return [...Array(endPage - startPage + 1)].map((_, index) => (
            <button
              key={startPage + index}
              onClick={() => setSelectedPage(startPage + index)}
              className={`${
                startPage + index === selectedPage
                  ? "bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
              } font-bold py-2 px-4 rounded`}
            >
              {startPage + index}
            </button>
          ));
        })()}
        <button
          onClick={handleNextPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Next Page
        </button>
      </div>
    </div>
  );
};
