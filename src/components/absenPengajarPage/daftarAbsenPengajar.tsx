"use client";

import React, { useEffect, useState } from "react";
import { saveAs } from 'file-saver';
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
import styles from "./daftarAbsen.module.css";
import { PeriodePayroll } from "../../common/types/PeriodePayroll";
import { useAuthContext } from "../../common/utils/authContext";

export const DaftarAbsenPengajar = () => {
  const { pengguna } = useAuthContext();
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
  const [listPeriodePayrollExisting, setListPeriodePayrollExisting] = useState<
    PeriodePayroll[]
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

  const {
    isLoading: PayrollLoading,
    error: PayrollError,
    data: Payroll,
  } = useQuery({
    queryKey: ["periodePayroll"],
    queryFn: () =>
      fetchWithToken(`/absen-pengajar/periode-payroll`).then((res) =>
        res.json()
      ),
    onSuccess: (data) => {
      if (data) {
        setListPeriodePayrollExisting(data.content);
      }
    },
  });

  if (isLoading || PayrollLoading) {
    return <Loading />;
  }

  const filteredAbsenPengajar = listAbsenExisting.filter(
    (absenPengajar: absenPengajarRead) => {
      if (searchType === "nama") {
        return absenPengajar.pengajar
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
      } else if (searchType === "kodeKelas") {
        return absenPengajar.kodeKelas
          .toString()
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
      } else if (searchType === "fee") {
        return absenPengajar.fee
          .toString()
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
      } 
      else if (searchType === "payroll") {
        if (!searchKeyword) {
          // Jika tidak ada nilai yang dimasukkan, tampilkan semua data
          return true;
        }
        console.log(listPeriodePayrollExisting);
        const absenDate = new Date(
          parseInt(absenPengajar.tanggalAbsen[0]),
          parseInt(absenPengajar.tanggalAbsen[1]) - 1,
          parseInt(absenPengajar.tanggalAbsen[2])
        ).getTime();
    
        for (const payroll of listPeriodePayrollExisting) {
          console.log(payroll.id);
          console.log(searchKeyword);
          if (payroll.id.toString() === searchKeyword) {
            const startDate = new Date(payroll.tanggalMulai).getTime();
            const endDate = new Date(payroll.tanggalSelesai).getTime();
            console.log(absenDate >= startDate && absenDate <= endDate)
    
            if (absenDate >= startDate && absenDate <= endDate) {
              return true; // Jika ditemukan tanggal absen dalam rentang periode payroll, kembalikan true
            }
          }
        }
      
        return false; 
      } else if (searchType === "tanggalAbsen") {
        // Filter berdasarkan tanggal absen
        if (!searchKeyword) {
          // Jika tidak ada nilai yang dimasukkan, tampilkan semua data
          return true;
        }
        const localDateTimeString = absenPengajar.tanggalAbsen.toString();
        let year = "";
        let month = "";
        let day = "";
        let commaCount = 0;
        for (let i = 0; i < localDateTimeString.length; i++) {
          if (localDateTimeString[i] === ",") {
            commaCount++;
            if (commaCount === 1) {
              year = localDateTimeString.substring(0, i);
            } else if (commaCount === 2) {
              month = localDateTimeString.substring(year.length + 1, i);
            } else if (commaCount === 3) {
              day = localDateTimeString.substring(
                year.length + month.length + 2,
                i
              );
              break; // Keluar dari loop setelah menemukan day
            }
          }
        }
        // Membuat objek Date dari tanggal yang diuraikan
        const tanggalAbsenDate = new Date(`${year}-${month}-${day}`);
        // Membuat objek Date dari searchKeyword
        const searchDate = new Date(searchKeyword);
        // Membandingkan tanggal secara tepat
        const searchDateOnly = new Date(
          searchDate.getFullYear(),
          searchDate.getMonth(),
          searchDate.getDate()
        );
        const tanggalAbsenDateOnly = new Date(
          tanggalAbsenDate.getFullYear(),
          tanggalAbsenDate.getMonth(),
          tanggalAbsenDate.getDate()
        );
        return searchDateOnly.getTime() === tanggalAbsenDateOnly.getTime();
      }
    }
  );
  console.log(filteredAbsenPengajar);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchKeyword("");
  };

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };


  const sortedAbsen = [...filteredAbsenPengajar].sort((a, b) => {
    if (sortBy === "nama_asc") {
      return a.pengajar.localeCompare(b.pengajar);
    } else if (sortBy === "nama_desc") {
      // If the sort direction is descending, reverse the comparison result
      return b.pengajar.localeCompare(a.pengajar);
    } else if (sortBy === "kodeKelas_asc") {
      return String(a.kodeKelas).localeCompare(String(b.kodeKelas));
    } else if (sortBy === "kodeKelas_desc") {
      return String(b.kodeKelas).localeCompare(String(a.kodeKelas));
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
    } else if (sortBy === "tanggalAbsen_asc") {
      // Sorting berdasarkan tanggal absen ascending
      const dateA = new Date(
        Number(a.tanggalAbsen[0]),
        Number(a.tanggalAbsen[1]) - 1,
        Number(a.tanggalAbsen[2])
      ).getTime();
      const dateB = new Date(
        Number(b.tanggalAbsen[0]),
        Number(b.tanggalAbsen[1]) - 1,
        Number(b.tanggalAbsen[2])
      ).getTime();
      return dateA - dateB;
    } else if (sortBy === "tanggalAbsen_desc") {
      // Sorting berdasarkan tanggal absen descending
      const dateA = new Date(
        Number(a.tanggalAbsen[0]),
        Number(a.tanggalAbsen[1]) - 1,
        Number(a.tanggalAbsen[2])
      ).getTime();
      const dateB = new Date(
        Number(b.tanggalAbsen[0]),
        Number(b.tanggalAbsen[1]) - 1,
        Number(b.tanggalAbsen[2])
      ).getTime();
      return dateB - dateA;
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

  const formatLocalDateTime = (localDateTime) => {
    const localDateTimeString = localDateTime.toString();

    let year = "";
    let month = "";
    let day = "";

    let commaCount = 0;
    for (let i = 0; i < localDateTimeString.length; i++) {
      if (localDateTimeString[i] === ",") {
        commaCount++;
        if (commaCount === 1) {
          year = localDateTimeString.substring(0, i);
        } else if (commaCount === 2) {
          month = localDateTimeString.substring(year.length + 1, i);
        } else if (commaCount === 3) {
          day = localDateTimeString.substring(
            year.length + month.length + 2,
            i
          );
          break; // Keluar dari loop setelah menemukan day
        }
      }
    }

    // Daftar nama bulan
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    // Mengambil nama bulan dari array berdasarkan indeks
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = months[monthIndex];

    // Mengembalikan format yang diinginkan
    return `${day} ${monthName} ${year}`;
  };

  const formatTanggal = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    return date.toLocaleDateString("id-ID", options);
  };

  const exportToCSV = (data) => {
    const groupedData = data.reduce((acc, curr) => {
      const { pengajar, kodeKelas, programName, jenisKelasName, tanggalAbsen, fee } = curr;
      const key = `${pengajar}-${kodeKelas}-${programName}-${jenisKelasName}-${formatLocalDateTime(tanggalAbsen).split('-').join('-')}`;
      if (!acc[key]) {
        acc[key] = { pengajar, kodeKelas, programName, jenisKelasName, tanggalAbsen, totalFee: fee };
      } else {
        acc[key].totalFee += fee;
      }
      return acc;
    }, {});
  
    const csvHeader = 'Nama Pengajar,Kode Kelas,Program,Jenis Kelas,Tanggal Absen,Total Fee\n';
  
    const csvData = Object.values(groupedData).map((item: { pengajar: string, kodeKelas: string, programName: string, jenisKelasName: string, tanggalAbsen: string, totalFee: number }) => {
      return `${item.pengajar},${item.kodeKelas},${item.programName},${item.jenisKelasName},${formatLocalDateTime(item.tanggalAbsen).split('-').join('-')},${item.totalFee}\n`;
    }).join('');
  
    const csvContent = csvHeader + csvData;
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
    saveAs(blob, 'absen_pengajar.csv');
  };

  const handleExportClick = () => {
    exportToCSV(filteredAbsenPengajar);
  }

  function formatMoney(amount) {
    // Menambahkan simbol mata uang (misalnya "Rp" untuk Rupiah)
  
    // Menggunakan fungsi toLocaleString() untuk memisahkan ribuan dan menetapkan format desimal
    const formattedAmount = amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR", // Menggunakan kode mata uang ISO 4217 untuk Rupiah
    });
  
    // Mengembalikan string yang diformat dengan simbol mata uang
    return `${formattedAmount}`;
  }

  return (
    <div className="px-2 py-16 space-y-10 flex-grow flex flex-col justify-center">
      <h1 className="text-6xl font-bold pb-4">Daftar Absen Pengajar</h1>
      <div className="mt-4 flex items-center">
        {searchType === "payroll" ? (
          <select
            value={searchKeyword}
            onChange={handleSearchKeywordChange}
            className="flex-grow px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
          >
            <option value="">Pilih Periode Payroll</option>
            {filteredAbsenPengajar.length > 0 &&
              listPeriodePayrollExisting.map((periode) => (
                <option key={periode.id} value={periode.id}>
                  {formatTanggal(periode.tanggalMulai)} -{" "}
                  {formatTanggal(periode.tanggalSelesai)}
                </option>
              ))}
          </select>
        ) : (
          <input
            type={searchType === "tanggalAbsen" ? "date" : "text"} // Mengubah input menjadi input tanggal jika searchType adalah "tanggalAbsen"
            value={searchKeyword}
            onChange={handleSearchKeywordChange}
            placeholder="Cari Absen Pengajar"
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
          <option value="kodeKelas_asc">By Kode Kelas (Asc)</option>
          <option value="kodeKelas_desc">By Kode Kelas (Desc)</option>
          <option value="program_asc">By Program (Asc)</option>
          <option value="program_desc">By Program (Desc)</option>
          <option value="jenisKelas_asc">By Jenis Kelas (Asc)</option>
          <option value="jenisKelas_desc">By Jenis Kelas (Desc)</option>
          <option value="jumlahFee_asc">By Jumlah Fee (Asc)</option>
          <option value="jumlahFee_desc">By Jumlah Fee (Desc)</option>
          <option value="tanggalAbsen_asc">By Tanggal Absen (Asc)</option>
          <option value="tanggalAbsen_desc">By Tanggal Absen (Desc)</option>
        </select>

        <select
          value={searchType}
          onChange={handleSearchTypeChange}
          className="px-4 py-2 mr-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        >
          <option value="nama">Cari berdasarkan Nama</option>
          <option value="kodeKelas">Cari berdasarkan Kode Kelas</option>
          <option value="program">Cari berdasarkan Program</option>
          <option value="jenisKelas">Cari berdasarkan Jenis Kelas</option>
          <option value="fee">Cari berdasarkan Fee</option>
          <option value="tanggalAbsen">Cari berdasarkan Tanggal Absen</option>
          <option value="payroll">Cari berdasarkan Periode Payroll</option>
        </select>
        <button 
          className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover"
          onClick={handleExportClick}
        >
          Export
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        {/* {noPengajarMessage} */}
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
            Pengajar dengan fee Rp. {searchKeyword} tidak ditemukan.
          </p>
        ) : filteredAbsenPengajar.length === 0 &&
          searchKeyword !== "" &&
          searchType === "tanggalAbsen" ? ( // Jika hasil pencarian berdasarkan tanggal absen kosong
          <p className="text-red-500">
            Tidak ada pengajar dengan tanggal absen {searchKeyword} ditemukan.
          </p>
        ) : listAbsenExisting.length === 0 ? (
          <p className="text-center text-gray-500">
            Tidak ada absen pengajar ditemukan.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto mt-4 rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Kode Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Nama Pengajar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Jenis Kelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tanggal Absen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedAbsen.map((absen, index) => (
                    <tr key={absen.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {absen.kodeKelas}
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
                      {formatMoney(absen.fee)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatLocalDateTime(absen.tanggalAbsen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center my-4 mt-16">
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
    </div>
  );
};
