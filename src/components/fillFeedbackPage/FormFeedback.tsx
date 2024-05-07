import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import styles from ".././DetailUser/DetailUser.module.css";
import { PoppinsBold } from "../../font/font";
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
        router.push("/feedback");
      }, 1000);
    } catch (errorMsg) {
      setErrorMsg(errorMsg.message);
    }
  };

  return (
    <div>
      <div
        className={`${styles.heading} text-center md:my-10 my-6`}
        style={PoppinsBold.style}
      >
        Isi Feedback
      </div>

      {/* Table displaying rating data */}
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th>Nama Program</th>
            <th>Jenis Kelas</th>
            <th>Rating</th>
            <th>Link Playlist</th>
          </tr>
        </thead>
        <tbody>
          {listRatingMurid &&
            listRatingMurid.map((ratingMurid, idx) => (
              <tr key={idx}>
                <td>{ratingMurid.program.nama}</td>
                <td>{ratingMurid.jenisKelas.nama}</td>
                <td>{ratingMurid.rating}</td>
                <td>{ratingMurid.linkPlaylist}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Feedback form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="isi" className="block mb-1">
            Isi:
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
            className="w-full"
          />
          <div className="text-center">{formState.rating}</div>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
        {errorMsg && <div className="text-red-500">{errorMsg}</div>}
        {success && <div className="text-green-500">{success}</div>}
      </form>
    </div>
  );
};
