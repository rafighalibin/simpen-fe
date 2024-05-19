import React, { useEffect, useState } from "react";
import useFetchAllAnnouncement from "../../common/hooks/announcement/useFetchAllAnnouncement";
import styles from "./dashboard.module.css";
import { FiInfo } from "react-icons/fi";
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
  const [isModalListOpen, setIsModalListOpen] = useState(false);
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

  const handleOpenModalList = () => {
    setIsModalListOpen(true);
  };

  const handleCloseModalList = () => {
    setIsModalListOpen(false);
  };

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
      <div className={`${styles.card2} basis-28 flex-wrap`}>
        <div className="flex items-center p-4 ml-2 align-middle">
        <div>
          <FiInfo size={32} className="align-middle mt-1.5 ml-2" /> {/* Profile icon */}
        </div>
          <div
            style={PoppinsBold.style}
            className={`${styles.heading_announcement} ml-5 mt-2`}
          >
            Pengumuman
          </div>
          {(data && data.role === "operasional" && (
            <button
              className={`px-5 py-3 ${styles.btn} ${styles.btn_tx} text-white hover:bg-[#215E9B] focus:bg-[#215E9B] ml-auto mr-2`}
              onClick={handleOpenCreateModal}
            >
              + Tambah Pengumuman
            </button>
          )) ||
            (data && data.role === "akademik" && (
              <button
                className={`px-5 py-3 ${styles.btn} ${styles.btn_tx} text-white hover:bg-[#215E9B] focus:bg-[#215E9B] ml-auto mr-2`}
                onClick={handleOpenCreateModal}
              >
                + Tambah Pengumuman
              </button>
            ))}
        </div>
        <div className="overflow-y-auto overflow-x-hidden max-h-[46vh]">
          {listAnnouncementLoading ? (
            <div>
              <Loading />
            </div>
          ) : error ? (
            <div className="ml-5 align-middle items-center text-center">Error fetching data</div>
          ) : !listAnnouncement || listAnnouncement.length === 0 ? (
            <div className="mt-28 ml-5 mb-32 align-middle items-center text-center">Tidak ada Pengumuman.</div>
          ) : (
            <div className="">
              {reversedListAnnouncement.slice(0, 2).map((announcement) => (
                <div
                  key={announcement.id}
                  className={`${styles.card3} py-2 px-3 hover:bg-[#A8D4FF] focus:bg-[#A8D4FF]`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenModal(announcement)}
                >
                  <div className={`ml-5 mt-2 mr-5 mb-2`}>
                    <div
                      style={PoppinsBold.style}
                      className={`${styles.announcement_title} text-[#215E9B]`}
                    >
                      {announcement.judul}
                    </div>
                    <div
                      style={InterReguler.style}
                      className={`${styles.announcement_date} flex justify-between`}
                    >
                      <div>
                        {` ${announcement.tanggalPembuatan[2]} ${
                          months[announcement.tanggalPembuatan[1] - 1]
                        } ${announcement.tanggalPembuatan[0]}  `}
                        pada
                        {` ${announcement.tanggalPembuatan[3]}:${announcement.tanggalPembuatan[4]} `}
                        oleh 
                        {` ${announcement.rolePembuat}`} {` ${announcement.namaPembuat}`}
                      </div>
                    </div>
                    <div
                      style={InterMedium.style}
                      className={`${styles.announcement_text} text-justify mt-1`}
                    >
                      {announcement.isi}
                    </div>
                  </div>
                </div>
              ))}
              <div className="ml-5 align-middle items-center text-center"><br></br></div>
            {listAnnouncement.length > 2 && (
            <div className="ml-8 align-middle items-center ">
              <button
                style={InterMedium.style}
                className={`px-5 py-3 mb-5 ${styles.btn} ${styles.btn_tx} text-white hover:bg-[#215E9B] focus:bg-[#215E9B] px-3`}
                onClick={() => handleOpenModalList()}
              >
                Lihat Pengumuman Lainnya
              </button>
            </div>
            )}
            </div>
          )}
          </div>
      </div>
      {isModalListOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`${styles.modal} bg-white pt-4 pb-8 px-8 relative`}>
            <div
              className="absolute top-1 right-2 cursor-pointer"
              onClick={handleCloseModalList}
            >
              &#x2715;
            </div>
            <div
              style={PoppinsBold.style}
              className={`${styles.modal_tx_title} mt-2`}
            >
              Pengumuman Lainnya
            </div>
            <div className="overflow-y-auto overflow-x-hidden max-h-[65vh] mt-5">
              {reversedListAnnouncement.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`${styles.card3} py-2 px-3 hover:bg-[#A8D4FF] focus:bg-[#A8D4FF]`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenModal(announcement)}
                >
                  <div className={`ml-5 mt-2 mr-5 mb-2`}>
                    <div
                      style={PoppinsBold.style}
                      className={`${styles.announcement_title} text-[#215E9B]`}
                    >
                      {announcement.judul}
                    </div>
                    <div
                      style={InterReguler.style}
                      className={`${styles.announcement_date} flex justify-between`}
                    >
                      <div>
                        {` ${announcement.tanggalPembuatan[2]}-${
                          months[announcement.tanggalPembuatan[1] - 1]
                        }-${announcement.tanggalPembuatan[0]}  `}
                        pada
                        {` ${announcement.tanggalPembuatan[3]}:${announcement.tanggalPembuatan[4]} `}
                        oleh 
                        {` ${announcement.rolePembuat}`} {` ${announcement.namaPembuat}`}
                      </div>
                    </div>
                    <div
                      style={InterMedium.style}
                      className={`${styles.announcement_text} text-justify mt-1`}
                    >
                      {announcement.isi}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
              className={`${styles.modal_tx_title} mt-2`}
            >
              {selectedAnnouncement.judul}
            </div>
            <div
              style={InterReguler.style}
              className={`${styles.modal_tx_time}`}
            >
              {selectedAnnouncement.tanggalPembuatan[2] +
                " " +
                months[selectedAnnouncement.tanggalPembuatan[1] - 1] +
                " " +
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
                  className={`px-4 py-2 ${styles.delete_button} mt-8 text-white px-2 py-1 hover:bg-[#a00e0e] focus:bg-[#a00e0e]`}
                  onClick={() =>
                    handleDeleteAnnouncement(selectedAnnouncement.id)
                  }
                >
                  Hapus Pengumuman
                </button>
              )) ||
                (data && data.role === "akademik" && (
                  <button
                    className={`px-4 py-2 ${styles.delete_button} mt-8 text-white px-2 py-1 hover:bg-[#a00e0e] focus:bg-[#a00e0e]`}
                    onClick={() =>
                      handleDeleteAnnouncement(selectedAnnouncement.id)
                    }
                  >
                    Hapus Pengumuman
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
                  Judul Pengumuman
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
                  Isi Pengumuman
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
                className={`px-4 py-2 ${styles.upload_button} mt-8 mb-6 text-white hover:bg-[#215E9B] focus:bg-[#215E9B]`}
              >
                Unggah Pengumuman
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
