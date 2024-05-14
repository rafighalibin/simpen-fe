import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Correct import based on your setup
import { useMutation } from "react-query";

// Import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./addJenisKelasForm.module.css";

// Import hooks
import useFetchWithToken from "../../common/hooks/fetchWithToken";

export const DetailJenisKelas = () => {
  const fetchWithToken = useFetchWithToken();
  const router = useRouter();
  const { id } = useParams(); // Correct usage based on your setup
  const [showTable, setShowTable] = useState(false);
  
  const [jenisKelasDetail, setJenisKelasDetail] = useState(null);
  const [listAllKelasWithJenisKelas, setlistAllKelasWithJenisKelas] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchJenisKelasDetail = async () => {
      try {
        const response = await fetchWithToken(`/kelas/jenis/${id}`); // Use dynamic endpoint based on `id`
        const data = await response.json();
        if (response.ok) {
          setJenisKelasDetail(data.content);
        } else {
          throw new Error(data.message || "Failed to fetch data");
        }
      } catch (error) {
        setError("Failed to fetch jenis kelas detail: " + error.message);
      }
    };

    fetchJenisKelasDetail();
  }, []);

  useEffect(() => {
    const fetchAllKelasWithJenisKelas = async () => {
      try {
        const response = await fetchWithToken(`/kelas`); // Use dynamic endpoint based on `id`
        const data = await response.json();
        if (response.ok) {
          setlistAllKelasWithJenisKelas(data.content);
        } else {
          throw new Error(data.message || "Failed to fetch data");
        }
      } catch (error) {
        setError("Failed to fetch All Kelas: " + error.message);
      }
    };

    fetchAllKelasWithJenisKelas();
  }, []);

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: (id: string) =>
      fetchWithToken(`/kelas/jenis/${id}`, "DELETE")
        .then((res) => {
          if (res.status === 500) {
            alert("Jenis Kelas Internal Server Error. Ada Program yang berhubungan!");
          }
          else {
            alert("Jenis Kelas berhasil dihapus");
          }
          return res.json();
        })
        .catch((error) => {
          console.error(error);
          throw error;
        }),
    onSuccess: () => {
      window.location.href = "/kelas/jenis";
    },
  });

  const handleDelete = async () => {
    if (window.confirm("Apa anda yakin ingin hapus jenis kelas ini?")) {
      await deleteMutation(jenisKelasDetail.id);
      localStorage.setItem("removeJenisKelasSuccess", `${jenisKelasDetail.nama}`);
      router.push("/kelas/jenis");
    }
  };

  const handleDetailClickProgram = (program) => {
    const programId = program.id;
    router.push(`/kelas/program/${programId}`);
  };

  const handleDetailClickKelas = (kelas) => {
    const kelasId = kelas.id;
    router.push(`/kelas/${kelasId}`);
  };

  return (
    <div>
      <div className={`${styles.heading} text-center my-10`} style={PoppinsBold.style}>
        Detail Jenis Kelas
      </div>
      {jenisKelasDetail && (
        <div className={`${styles.card_form} sm:px-7 sm:py-8 sm:mb-12 px-5 py-4 mb-8`}>
          <div style={InterMedium.style} className={`${styles.form_title} mb-3`}>
            Nama Jenis Kelas: {jenisKelasDetail.nama}
          </div>
          <div style={InterMedium.style} className="mb-3">
            PIC Akademik: {jenisKelasDetail.picAkademikNama}
          </div>
          <div style={InterMedium.style} className="mb-3">
            Pertemuan: {jenisKelasDetail.pertemuan}
          </div>
          <div style={InterMedium.style} className="mb-3">
            Bahasa: {jenisKelasDetail.bahasa}
          </div>
          <div style={InterMedium.style} className="mb-3">
            Tipe: {jenisKelasDetail.tipe}
          </div>
          <div style={InterMedium.style} className="mb-3">
            <h3 className="mt-4 mb-4">List Program</h3>
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
                  NAMA PROGRAM
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                  JUMLAH LEVEL
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                  JUMLAH PERTEMUAN
                </th>
                <th className="px-4 py-4 text-center" style={InterMedium.style}>
                </th>
                </tr>
              </thead>
              <tbody>
                {jenisKelasDetail.listProgram.map((program, index) => (
                  <tr
                    className={`${styles.table_items_text}`}
                    style={InterMedium.style}
                    key={program.id}
                  >
                    <td className="border-b px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border-b px-4 py-5">{program.nama}</td>
                    <td className="border-b px-4 py-5">{program.jumlahLevel}</td>
                    <td className="border-b px-4 py-5">{program.jumlahPertemuan}</td>
                    <td className="border-b px-4 py-5">
                      <button
                        onClick={() => handleDetailClickProgram(program)}
                        className={`bg-transparent hover:bg-[#215E9B] text-[#215E9B]  hover:text-white py-2 px-4 border border-[#215E9B] hover:border-transparent rounded-full`}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
          {listAllKelasWithJenisKelas && (
          <div style={InterMedium.style} className="mb-3">
            <label className="label mr-4">List Kelas</label>
            <button
              onClick={() => setShowTable(!showTable)}
              className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover"
            >
              {showTable ? "Hide Table" : "Show Table"}
            </button>
            {showTable && (
            <div className={` ${styles.card_form} mt-4`}>
            <table className={`table-auto w-full`}>
            <thead
              className={`${styles.table_heading} ${styles.table_heading_text}`}
            >
                <tr>
                <th className="px-4 py-4 text-center" style={InterMedium.style}>
                    NO
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    KELAS ID
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    PENGAJAR
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    STATUS
                </th>
                <th className="px-4 py-4 text-left" style={InterMedium.style}>
                </th>
                </tr>
              </thead>
              <tbody>
                {listAllKelasWithJenisKelas.map((kelas, index) => (
                  kelas.jenisKelasName === jenisKelasDetail.nama && (
                    <tr key={index} className="bg-white border-b">
                      <td className="border-b px-4 py-2 text-center">
                      {index + 1}
                      </td>
                      <td className="border-b px-4 py-5">{kelas.id}</td>
                      <td className="border-b px-4 py-5">{kelas.pengajar}</td>
                      <td className="border-b px-4 py-5">{kelas.status}</td>
                      <td className="border-b px-4 py-5">
                        <button
                          onClick={() => handleDetailClickKelas(kelas)}
                          className={`bg-transparent hover:bg-[#215E9B] text-[#215E9B]  hover:text-white py-2 px-4 border border-[#215E9B] hover:border-transparent rounded-full`}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
          )}
          <h3 className="mt-4">Total Kelas dengan Jenis Kelas ini: {listAllKelasWithJenisKelas.filter(kelas => kelas.jenisKelasName === jenisKelasDetail.nama).length}</h3>
          </div>
          )}
          <div className="flex justify-center gap-4 sm:mt-16 sm:mb-12">
            <button
              onClick={handleDelete}
              className={`${styles.button_tx} ${styles.del_btn} hover:bg-[#A46B14] focus:bg-[#A46B14]`}
              style={InterMedium.style}
            >
              Hapus Jenis Kelas
            </button>
          </div>
          {success && (
            <div className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2" style={InterReguler.style}>
              {success}
            </div>
          )}
          {error && (
            <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2" style={InterReguler.style}>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
