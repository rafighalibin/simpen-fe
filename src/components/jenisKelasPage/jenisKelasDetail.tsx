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
            <h3>List Program</h3>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Program Name</th>
                  <th scope="col" className="px-6 py-3">Jumlah Level</th>
                  <th scope="col" className="px-6 py-3">Jumlah Pertemuan</th>
                </tr>
              </thead>
              <tbody>
                {jenisKelasDetail.listProgram.map((program, index) => (
                  <tr key={index} className="bg-white border-b">
                    <td className="px-6 py-4">{program.nama}</td>
                    <td className="px-6 py-4">{program.jumlahLevel}</td>
                    <td className="px-6 py-4">{program.jumlahPertemuan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {listAllKelasWithJenisKelas && (
          <div style={InterMedium.style} className="mb-3">
            <h3>Total Kelas dengan Jenis Kelas ini: {listAllKelasWithJenisKelas.filter(kelas => kelas.jenisKelasName === jenisKelasDetail.nama).length}</h3>
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
                {listAllKelasWithJenisKelas.map((kelas, index) => (
                  kelas.jenisKelasName === jenisKelasDetail.nama && (
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
