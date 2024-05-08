import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams, useRouter } from "next/navigation";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import styles from "./FormFeedback.module.css";
import { InterMedium, PoppinsBold } from "../../font/font";
import { useFetchRatingByPengajar } from "../../common/hooks/feedback/useFetchRatingByPengajar";

export const FormFeedback = ({ data }) => {
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
  const [formState, setFormState] = useState({
    id: data.id,
    isi: "",
    rating: 0,
  });

  let listRatingMurid = rating.listRatingMurid;

  console.log(listRatingMurid);

  useEffect(() => {
    if (data) {
      setFormState({
        id: data.id,
        rating: data.rating || 0,
        isi: data.isi || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send feedback data to the server
    try {
      const response = await fetchWithToken(`/feedback`, "PUT", formState);
      if (!response.ok) {
        throw new Error("Failed to update feedback.");
      }
      setSuccess("Feedback updated successfully.");
      setTimeout(() => {
        setSuccess("");
        window.location.href = "/feedback"
      }, 1000);
    } catch (errorMsg) {
      setErrorMsg(errorMsg.message);
    }
  };

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
        Isi Feedback
      </div>
      <div className={`${styles.card_form}`}>
      <form onSubmit={handleSubmit}>
        <div className={`flex-wrap items-center p-5`}>
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
          <label htmlFor="isi" className="label">
            Feedback:
          </label>
          <textarea
            id="isi"
            name="isi"
            value={formState.isi}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="rating" className="block mb-1">
            Rating:
          </label>
          <input
            type="range"
            id="rating"
            name="rating"
            value={formState.rating}
            min="0"
            max="5"
            step="1"
            onChange={handleChange}
            className={`w-full hover:bg-[#215E9B] focus:bg-[#215E9B] ${styles.rating}`}
          />
          <div className="text-center">{formState.rating}</div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className={`${styles.btn} ${styles.btn_tx} hover:bg-[#215E9B] focus:bg-[#215E9B] text-white px-4 py-2 rounded items-center`}
          >
            Unggah Feedback
          </button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        </div>
      </form>
      </div>
    </div>
  );
};
