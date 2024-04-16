import React, { useEffect, useState } from "react";
import useFetchAllAnnouncement from "../../common/hooks/announcement/useFetchAllAnnouncement";
import styles from "./dashboard.module.css";
import {
  InterMedium,
  InterReguler,
  PoppinsBold,
  PoppinsMedium,
} from "../../font/font";
import { useMutation } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import Loading from "../../app/loading";

export const ListOfAnnouncement = ({ data }) => {
  const {
    isLoading: listAnnouncementLoading,
    error,
    listAnnouncement,
    refetch,
  } = useFetchAllAnnouncement();

  const fetchWithToken = useFetchWithToken();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    judul: "",
    isi: "",
  });

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

  const reversedListAnnouncement = listAnnouncement.slice().reverse();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleOpenModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const { mutateAsync: addAnnouncementMutation, data: response } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/announcement`, "POST", formState).then(
        (res) => res.json
      ),
    onSuccess: () => {
      refetch();
      setFormState({ judul: "", isi: "" });
    },
  });

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    await addAnnouncementMutation();
    handleCloseCreateModal();
  };

  async function handleDeleteAnnouncement(id: string) {
    await fetchWithToken(`/announcement/${id}`, "DELETE");
    handleCloseModal();
    refetch();
  }

  return (
    <div>
      <div className={`${styles.card2} p-4 min-[40vh]:`}>
        <div className="flex justify-between items-center mb-4">
          <div
            style={InterMedium.style}
            className={`${styles.heading_announcement}`}
          >
            Daftar Pengumuman
          </div>
          {(data && data.role === "operasional" && (
            <button
              className={`${styles.create_button} text-white hover:bg-[#215E9B] focus:bg-[#215E9B] px-3`}
              onClick={handleOpenCreateModal}
            >
              +
            </button>
          )) ||
            (data && data.role === "akademik" && (
              <button
                className={`${styles.create_button} text-white hover:bg-[#215E9B] focus:bg-[#215E9B] px-3`}
                onClick={handleOpenCreateModal}
              >
                +
              </button>
            ))}
        </div>
        <div className="mt-4 overflow-y-auto overflow-x-hidden max-h-[65vh]">
          {listAnnouncementLoading ? (
            <div>
              <Loading />
            </div>
          ) : error ? (
            <div>Error fetching data</div>
          ) : !listAnnouncement || listAnnouncement.length === 0 ? (
            <div>Tidak ada pengumuman</div>
          ) : (
            <div className="">
              {reversedListAnnouncement.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`${styles.card3} py-2 px-3 hover:bg-[#fffbf0] focus:bg-[#fffbf0] mb-3`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenModal(announcement)}
                >
                  <div className={``}>
                    <div
                      style={InterMedium.style}
                      className={`${styles.announcement_title}`}
                    >
                      {announcement.judul}
                    </div>
                    <div
                      style={InterReguler.style}
                      className={`${styles.announcement_date} flex justify-between`}
                    >
                      <div>
                        {`${announcement.tanggalPembuatan[2]}-${
                          months[announcement.tanggalPembuatan[1] - 1]
                        }-${announcement.tanggalPembuatan[0]}  `}
                      </div>
                      <div>{`${announcement.tanggalPembuatan[3]}:${announcement.tanggalPembuatan[4]}`}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`${styles.modal} bg-white pt-4 pb-8 px-8 relative`}>
            <div
              className="absolute top-1 right-2 cursor-pointer"
              onClick={handleCloseModal}
            >
              &#x2715;
            </div>
            <div
              style={PoppinsBold.style}
              className={`${styles.modal_tx_title}`}
            >
              {selectedAnnouncement.judul}
            </div>
            <div
              style={InterReguler.style}
              className={`${styles.modal_tx_time}`}
            >
              {selectedAnnouncement.tanggalPembuatan[2] +
                "-" +
                selectedAnnouncement.tanggalPembuatan[1] +
                "-" +
                selectedAnnouncement.tanggalPembuatan[0] +
                " pada " +
                selectedAnnouncement.tanggalPembuatan[3] +
                ":" +
                selectedAnnouncement.tanggalPembuatan[4]}
            </div>
            <div
              className={`${styles.modal_tx_paragraph} mt-4`}
              style={InterReguler.style}
            >
              {selectedAnnouncement.isi}
            </div>
            <div className=" ">
              {(data && data.role === "operasional" && (
                <button
                  className={`${styles.delete_button} mt-8 text-white px-2 py-1 hover:bg-[#a00e0e] focus:bg-[#a00e0e]`}
                  onClick={() =>
                    handleDeleteAnnouncement(selectedAnnouncement.id)
                  }
                >
                  Hapus pengumuman
                </button>
              )) ||
                (data && data.role === "akademik" && (
                  <button
                    className={`${styles.delete_button} mt-8 text-white px-2 py-1 hover:bg-[#a00e0e] focus:bg-[#a00e0e]`}
                    onClick={() =>
                      handleDeleteAnnouncement(selectedAnnouncement.id)
                    }
                  >
                    Hapus pengumuman
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
      {isCreateModalOpen && (
        <form onSubmit={handleCreateAnnouncement}>
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className={`${styles.modal} bg-white py-4 px-8 relative`}>
              <div
                className="absolute top-1 right-2 cursor-pointer"
                onClick={handleCloseCreateModal}
              >
                &#x2715;
              </div>
              <div className="mt-4">
                <div
                  style={InterMedium.style}
                  className={`${styles.title} mb-3 sm:ml-0 ml-1`}
                >
                  Judul pengumuman
                </div>
                <input
                  id="judul"
                  name="judul"
                  type="judul"
                  autoComplete="judul"
                  required
                  className={`${styles.placeholder} appearance-none relative block w-full px-3 sm:py-3 py-1 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:text-black focus:z-10`}
                  onChange={(e) =>
                    setFormState({ ...formState, judul: e.target.value })
                  }
                  value={formState.judul}
                  style={InterReguler.style}
                />
              </div>
              <div className="mt-4">
                <div
                  style={InterMedium.style}
                  className={`${styles.title} mb-3 sm:ml-0 ml-1`}
                >
                  Isi pengumuman
                </div>
                <textarea
                  id="isi"
                  name="isi"
                  autoComplete="off"
                  required
                  className={`${styles.placeholder} appearance-none relative block w-full px-3 sm:py-3 py-1 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:text-black focus:z-10`}
                  onChange={(e) =>
                    setFormState({ ...formState, isi: e.target.value })
                  }
                  value={formState.isi}
                  style={InterReguler.style}
                />
              </div>
              <button
                type="submit"
                className={`${styles.upload_button} mt-8 mb-6 text-white px-2 py-1 hover:bg-[#215E9B] focus:bg-[#215E9B]`}
              >
                Unggah pengumuman
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
