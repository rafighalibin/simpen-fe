import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useParams, useRouter } from "next/navigation";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import styles from "./FormFeedback.module.css";
import { InterMedium, PoppinsBold } from "../../font/font";
import { useFetchRatingByPengajar } from "../../common/hooks/feedback/useFetchRatingByPengajar";

export const DetailFeedback = ({ data }) => {
  const fetchWithToken = useFetchWithToken();
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const {
    isLoading: listAllRating,
    error,
    rating,
    refetch,
  } = useFetchRatingByPengajar(data.idPengajar);

  let listRatingMurid = rating.listRatingMurid;

  // Function to convert timestamps to readable dates
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("id-ID");
  };

  return (
    <div>
      <div
        className={`${styles.heading} text-center md:my-10 my-6`}
        style={PoppinsBold.style}
      >
        Detail Feedback
      </div>
      <div className={`${styles.card_form}`}>
      <div className={`flex-wrap items-center p-5`}>
        <div className="gap-4">
          <div>
          <div className={`label text-center text-xl ${styles.heading_announcement}`} style={PoppinsBold.style}>
            Class Table
        </div>
        <div className={` ${styles.card_form} mt-4`}>
        <table className="table-auto w-full">
        <thead className={`${styles.table_heading} ${styles.table_heading_text}`}>
          <tr>
            <th className="px-4 py-4 text-center" style={InterMedium.style}>NO</th>
            <th className="px-4 py-4 text-left" style={InterMedium.style}>NAMA PROGRAM</th>
            <th className="px-4 py-4 text-left" style={InterMedium.style}>JENIS KELAS</th>
            <th className="px-4 py-4 text-left" style={InterMedium.style}>TANGGAL SELESAI</th>
            <th className="px-4 py-4 text-left" style={InterMedium.style}>RATING MURID</th>
            <th className="px-4 py-4 text-left" style={InterMedium.style}>LINK PLAYLIST</th>
            <th className="px-4 py-4 text-left" style={InterMedium.style}></th>
          </tr>
        </thead>
        <tbody>
          {listRatingMurid &&
            listRatingMurid.map((ratingMurid, idx) => (
              <tr key={idx}>
                <td className="border-b px-4 py-2 text-center">{idx + 1}</td>
                <td className="border-b px-4 py-4 text-left">{ratingMurid.program.nama}</td>
                <td className="border-b px-4 py-4 text-left">{ratingMurid.jenisKelas.nama}</td>
                <td className="border-b px-4 py-4 text-left">{formatDate(ratingMurid.tanggalSelesai)}</td>
                <td className="border-b px-4 py-4 text-left">{ratingMurid.rating}</td>
                <td className="border-b px-4 py-4 text-left">{ratingMurid.linkPlaylist}</td>
                <td className="border-b px-4 py-4 text-left">
                {ratingMurid.linkPlaylist ? (
                  <a
                    href={`https://${ratingMurid.linkPlaylist}`}
                    target="_blank"
                    className="bg-info text-white text-nowrap mt-1 px-4 py-3 rounded-md hover:bg-infoHover"
                  >
                      Open Playlist
                  </a>
                ) : (
                  <span>No link provided</span>
                )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>
      <div className={`items-center mb-4 mt-5`}>
              <label
                htmlFor="namaKelas"
                className={`${styles.form_title} mb-3`}
              >
                Nama Program
              </label>
              <input
                type="text"
                name="namaKelas"
                id="namaKelas"
                value={data?.namaProgram}
                disabled
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className={`items-center mb-4 mt-5`}>
              <label
                htmlFor="rating"
                className={`${styles.form_title} mb-3`}
              >
                Rating
              </label>
              <input
                type="text"
                name="rating"
                id="rating"
                value={data.rating}
                disabled
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div>
          <div className={`items-center mb-4 mt-5`}>
              <label
                htmlFor="isi"
                className={`${styles.form_title} mb-3`}
              >
                Feedback
              </label>
              <textarea
                name="isi"
                id="isi"
                value={data.isi}
                disabled
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
