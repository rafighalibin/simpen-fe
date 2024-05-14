import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Correct import based on your setup
import { useMutation } from "react-query";

// Import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./addProgramForm.module.css";

// Import hooks
import useFetchWithToken from "../../common/hooks/fetchWithToken";

export const DetailProgram = () => {
  const fetchWithToken = useFetchWithToken();
  const router = useRouter();
  const { id } = useParams(); // Correct usage based on your setup
  const [showTable, setShowTable] = useState(false);
  
  const [programDetail, setProgramDetail] = useState(null);
  const [listAllKelasWithProgram, setlistAllKelasWithProgram] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        const response = await fetchWithToken(`/kelas/program/${id}`); // Use dynamic endpoint based on `id`
        const data = await response.json();
        if (response.ok) {
          setProgramDetail(data.content);
        } else {
          throw new Error(data.message || "Failed to fetch data");
        }
      } catch (error) {
        setError("Failed to fetch program detail: " + error.message);
      }
    };

    fetchProgramDetail();
  }, []);

  useEffect(() => {
    const fetchAllKelasWithProgram = async () => {
      try {
        const response = await fetchWithToken(`/kelas`); // Use dynamic endpoint based on `id`
        const data = await response.json();
        if (response.ok) {
          setlistAllKelasWithProgram(data.content);
        } else {
          throw new Error(data.message || "Failed to fetch data");
        }
      } catch (error) {
        setError("Failed to fetch All Kelas: " + error.message);
      }
    };

    fetchAllKelasWithProgram();
  }, []);

  const handleEdit = async () => {
    router.push(`/kelas/program/edit/${programDetail.id}`);
  };

  const handleDetailClickJenisKelas = (id) => {
    router.push(`/kelas/jenis/${id}`);
  };

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/program/${programDetail.id}`, "DELETE").then((res) => res.json),
  });

  const handleDelete = async () => {
    if (window.confirm("Apa anda yakin ingin hapus program ini?")) {
      await deleteMutation();
      localStorage.setItem("removeProgramSuccess", `${programDetail.nama}`);
      router.push("/kelas/program");
    }
  };

  return (
    <div>
      <div className={`${styles.heading} text-center my-10`} style={PoppinsBold.style}>
        Detail Program
      </div>
      {programDetail && (
        <div className={`${styles.card_form} sm:px-7 sm:py-8 sm:mb-12 px-5 py-4 mb-8`}>
          <div style={InterMedium.style} className={`${styles.form_title} mb-3`}>
            Nama Program: {programDetail.nama}
          </div>
          <div style={InterMedium.style} className="mb-3">
            Jumlah Level: {programDetail.jumlahLevel}
          </div>
          <div style={InterMedium.style} className="mb-3">
            Jumlah Pertemuan: {programDetail.jumlahPertemuan}
          </div>
          <div style={InterMedium.style} className="mb-3">
            <h3 className="mt-4 mb-4">List Jenis Kelas</h3>
            <div className={` ${styles.card_form} `}>
            <table className="w-full text-sm text-left text-gray-500">
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
                    BAHASA
                  </th>
                  <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    MODA
                  </th>
                  <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    TIPE
                  </th>
                  <th className="px-4 py-4 text-center" style={InterMedium.style}>
                  </th>
                </tr>
              </thead>
              <tbody>
                {programDetail.listJenisKelas.map((jeniskelas, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="border-b px-4 py-2 text-center">
                      {index + 1}
                      </td>
                    <td className="border-b px-4 py-5">{jeniskelas.nama}</td>
                    <td className="border-b px-4 py-5">{jeniskelas.bahasa}</td>
                    <td className="border-b px-4 py-5">{jeniskelas.pertemuan}</td>
                    <td className="border-b px-4 py-5">{jeniskelas.tipe}</td>
                    <td className="border-b px-4 py-5">
                      <button
                        onClick={() => handleDetailClickJenisKelas(jeniskelas.id)}
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
          {listAllKelasWithProgram && (
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
            <table className="w-full text-sm text-left text-gray-500">
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
                </tr>
              </thead>
              <tbody>
                {listAllKelasWithProgram.map((kelas, index) => (
                  kelas.programName === programDetail.nama && (
                    <tr
                      className={`${styles.table_items_text}`}
                      style={InterMedium.style}
                      key={index}
                    >
                      <td className="border-b px-4 py-2 text-center">
                      {index + 1}
                      </td>
                      <td className="border-b px-4 py-5">{kelas.id}</td>
                      <td className="border-b px-4 py-5">{kelas.pengajar}</td>
                      <td className="border-b px-4 py-5">{kelas.status}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
            </div>
            )}
            <h3 className="mt-4">Total Kelas dengan Jenis Kelas ini: {listAllKelasWithProgram.filter(kelas => kelas.programName === programDetail.nama).length}</h3>
          </div>
          )}
          <div className="flex justify-center gap-4 sm:mt-16 sm:mb-12">
            <button
              onClick={handleEdit}
              className={`${styles.button_tx} ${styles.put_btn} hover:bg-[#A46B14] focus:bg-[#A46B14]`}
              style={InterMedium.style}
            >
              Ubah Atribut Program
            </button>
            <button
              onClick={handleDelete}
              className={`${styles.button_tx} ${styles.del_btn} hover:bg-[#A46B14] focus:bg-[#A46B14]`}
              style={InterMedium.style}
            >
              Hapus Program
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
