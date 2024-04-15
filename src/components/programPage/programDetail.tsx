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
            <h3>Jenis Kelas List</h3>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Jenis Kelas</th>
                </tr>
              </thead>
              <tbody>
                {programDetail.listJenisKelas.map((jeniskelas, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-6 py-4">{jeniskelas.nama}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {listAllKelasWithProgram && (
          <div style={InterMedium.style} className="mb-3">
            <h3>Total Kelas dengan Jenis Kelas ini: {listAllKelasWithProgram.filter(kelas => kelas.programName === programDetail.nama).length}</h3>
            <p>List Kelas</p>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Kelas ID</th>
                  <th scope="col" className="px-6 py-3">Pengajar</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {listAllKelasWithProgram.map((kelas, index) => (
                  kelas.programName === programDetail.nama && (
                    <tr key={index} className="bg-white border-b">
                      <td className="px-6 py-4">{kelas.id}</td>
                      <td className="px-6 py-4">{kelas.pengajar}</td>
                      <td className="px-6 py-4">{kelas.status}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
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
