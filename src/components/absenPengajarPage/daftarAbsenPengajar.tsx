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
import { Breadcrumbs } from "../../components/breadcrumbs/breadcrumbs";
import Loading from "../../common/components/Loading";
import { absenPengajarRead } from "../../common/types/absenPengajar";

export const DaftarAbsenPengajar = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const fetchWithToken = useFetchWithToken();
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [searchType, setSearchType] = useState("nama");
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [selectedPage, setSelectedPage] = useState(1);
  const [listAbsenExisting, setListAbsenExisting] = useState<
    absenPengajarRead[]
  >([]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["absenPengajar"],
    queryFn: () => fetchWithToken(`/absen-pengajar`).then((res) => res.json()),
    onSuccess: (data) => {
      if (data) {
        setListAbsenExisting(data.content);
      }
      console.log(listAbsenExisting);
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const filteredAbsenPengajar = listAbsenExisting.filter(
    (absenPengajar: absenPengajarRead) => {
      if (searchType === "nama") {
        return absenPengajar.pengajar
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
      } else if (searchType === "kodeKelas") {
        return absenPengajar.id.toString()
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
      } else if (searchType === "program") {
        return absenPengajar.programName
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
      } else if (searchType === "jenisKelas") {
        return absenPengajar.jenisKelasName
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
      }
    }
  );

  const sortedAbsen = [...filteredAbsenPengajar].sort((a, b) => {
    if (sortBy === "nama_asc") {
      return a.pengajar.localeCompare(b.pengajar);
    } else if (sortBy === "nama_desc") {
      // If the sort direction is descending, reverse the comparison result
      return b.pengajar.localeCompare(a.pengajar);
    } else if (sortBy === "program_asc") {
      return a.programName.localeCompare(b.programName);
    } else if (sortBy === "program_desc") {
      return b.programName.localeCompare(a.programName);
    } else if (sortBy === "jenisKelas_asc") {
      return a.jenisKelasName.localeCompare(b.jenisKelasName);
    } else if (sortBy === "jenisKelas_desc") {
      return b.jenisKelasName.localeCompare(a.jenisKelasName);
    } else if (sortBy === "jumlahFee_asc") {
      return String(a.fee).localeCompare(String(b.fee));
    } else if (sortBy === "fee_desc") {
      return String(b.fee).localeCompare(String(a.fee));
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedAbsen.length / itemsPerPage);

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
  const displayedAbsen = sortedAbsen.slice(indexOfFirstItem, indexOfLastItem);

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
      Math.min(prevPage + 1, Math.ceil(sortedAbsen.length / itemsPerPage))
    );
  };

  const handlePrevPage = () => {
    setSelectedPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const noPengajarMessage =
    listAbsenExisting.length === 0 ? (
      <p className="text-center text-gray-500">
        Tidak ada absen pengajar ditemukan.
      </p>
    ) : null;

  return (
    <div className="px-2 py-16 space-y-10 flex-grow flex flex-col justify-center">
      <h1 className="text-6xl font-bold pb-4">Daftar Absen Pengajar</h1>
      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Cari Absen Pengajar"
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
          <option value="program_asc">By Program (Asc)</option>
          <option value="program_desc">By Program (Desc)</option>
          <option value="jenisKelas_asc">By Jenis Kelas (Asc)</option>
          <option value="jenisKelas_desc">By Jenis Kelas (Desc)</option>
          <option value="jumlahFee_asc">By Jumlah Fee (Asc)</option>
          <option value="jumlahFee_desc">By Jumlah Fee (Desc)</option>
        </select>

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        >
          <option value="nama">Cari berdasarkan Nama</option>
          <option value="kodeKelas">Cari berdasarkan Kode Kelas</option>
          <option value="program">Cari berdasarkan Program</option>
          <option value="jenisKelas">Cari berdasarkan Jenis Kelas</option>
          <option value="fee">Cari berdasarkan Fee</option>
        </select>
        <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
          <a href={``}>Export</a>
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        {noPengajarMessage}
        {filteredAbsenPengajar.length === 0 &&
        searchKeyword !== "" &&
        searchType === "nama" ? ( // Jika hasil pencarian nama kosong
          <p className="text-red-500">
            Pengajar dengan nama {searchKeyword} tidak ditemukan.
          </p>
        ) : filteredAbsenPengajar.length === 0 &&
          searchKeyword !== "" &&
          searchType === "kodeKelas" ? ( // Jika hasil pencarian tag kosong
          <p className="text-red-500">
            Pengajar dengan kode kelas {searchKeyword} tidak ditemukan.
          </p>
        ) : filteredAbsenPengajar.length === 0 &&
          searchKeyword !== "" &&
          searchType === "program" ? ( // Jika hasil pencarian tag kosong
          <p className="text-red-500">
            Pengajar dengan program {searchKeyword} tidak ditemukan.
          </p>
        ) : filteredAbsenPengajar.length === 0 &&
          searchKeyword !== "" &&
          searchType === "jenisKelas" ? ( // Jika hasil pencarian tag kosong
          <p className="text-red-500">
            Pengajar dengan jenis kelas {searchKeyword} tidak ditemukan.
          </p>
        ) : filteredAbsenPengajar.length === 0 &&
          searchKeyword !== "" &&
          searchType === "fee" ? ( // Jika hasil pencarian tag kosong
          <p className="text-red-500">
            Pengajar dengan periode payroll {searchKeyword} tidak ditemukan.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto mt-4 rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      kode Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Pengajar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Fee
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedAbsen.map((absen, index) => (
                    <tr key={absen.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {absen.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {absen.pengajar}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {absen.programName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {absen.jenisKelasName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {absen.fee}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
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
                </td> */}
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
  );
};
