import React, { useState } from "react";
import styles from "./dashboard.module.css";
import {
  PoppinsBold,
  PoppinsMedium,
  InterMedium,
  InterReguler,
} from "../../font/font";
import { FiBell } from "react-icons/fi";
import useFetchWithToken from "../../common/hooks/fetchWithToken";

export const Notification = ({ data, onUpdate }) => {
  const fetchWithToken = useFetchWithToken();
  const [notifications, setNotifications] = useState(data);

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

  notifications.sort((a, b) => {
    const dateA = new Date(
      a.tanggalPembuatan[0],
      a.tanggalPembuatan[1] - 1,
      a.tanggalPembuatan[2],
      a.tanggalPembuatan[3],
      a.tanggalPembuatan[4],
      a.tanggalPembuatan[5],
      a.tanggalPembuatan[6]
    );
    const dateB = new Date(
      b.tanggalPembuatan[0],
      b.tanggalPembuatan[1] - 1,
      b.tanggalPembuatan[2],
      b.tanggalPembuatan[3],
      b.tanggalPembuatan[4],
      b.tanggalPembuatan[5],
      b.tanggalPembuatan[6]
    );

    const compareDates = (date1, date2) => {
      if (date1 > date2) return -1;
      if (date1 < date2) return 1;
      return 0;
    };

    if (a.opened === b.opened) {
      return compareDates(dateA, dateB);
    } else {
      return a.opened ? 1 : -1;
    }
  });

  async function handleIsOpened(id: any) {
    const formStateJson = {
      id: id,
      isOpened: 1,
      isHidden: 0,
      isDelete: 0,
    };

    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, opened: true } : notification
    );

    setNotifications(updatedNotifications);

    try {
      const response = await fetchWithToken(
        "/notification/set_status",
        "PUT",
        formStateJson
      );
      const data = await response.json();
      if (data && data.message) {
        onUpdate();
      } else {
        console.error("No message found in response data");
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  }

  return (
    <div className={`${styles.card4} mb-12`}>
      <div className="flex items-center p-4 ml-2 align-middle">
        <div>
          <FiBell size={32} className="align-middle mt-2 ml-4" />{" "}
          {/* Profile icon */}
        </div>
        <div
          style={PoppinsBold.style}
          className={`${styles.heading_announcement} ml-5 mt-2`}
        >
          Notifikasi
        </div>
      </div>
      <div className="overflow-y-auto overflow-x-hidden max-h-[46vh]">
        {!notifications || notifications.length === 0 ? (
          <div className="mt-32 ml-5 mb-72 align-center items-center text-center">
            Tidak ada Notifikasi.
          </div>
        ) : (
          <div className="overflow-y-auto overflow-x-hidden max-h-[48vh]">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={`${styles.card3} ${
                  !notification.opened ? "bg-[#e6f2ff] " : "bg-white"
                } hover:bg-[#A8D4FF] focus:bg-[#A8D4FF]`}
                onClick={() => handleIsOpened(notification.id)}
                style={{ cursor: "pointer" }}
              >
                <div className={`ml-10 mt-3 mr-5 mb-3`}>
                  <div
                    style={PoppinsBold.style}
                    className={`${styles.heading}`}
                  >
                    {notification.tipe === 0 && <div>Assign Sesi Kelas</div>}

                    {notification.tipe === 1 && (
                      <div className={`text-[#215E9B]`}>Assign Kelas</div>
                    )}
                    {notification.tipe === 2 && (
                      <div className={`text-[#215E9B]`}>Feedback Akademik</div>
                    )}
                    {notification.tipe === 3 && (
                      <div className={`text-[#215E9B]`}>
                        Permintaan Perubahan Jadwal
                      </div>
                    )}
                    {notification.tipe === 4 && (
                      <div className={`text-[#215E9B]`}>
                        Permintaan Pengajar Pengganti
                      </div>
                    )}
                    {notification.tipe === 5 && (
                      <div className={`text-[#215E9B]`}>
                        Permintaan Perubahan Jadwal
                      </div>
                    )}
                    {notification.tipe === 6 && (
                      <div className={`text-[#215E9B]`}>
                        Permintaan Pengajar Pengganti
                      </div>
                    )}
                    {notification.tipe === 7 && (
                      <div className={`text-[#215E9B]`}>
                        Assign PIC Akademik
                      </div>
                    )}
                    {notification.tipe === 8 && (
                      <div className={`text-[#215E9B]`}>Akun Tidak Aktif</div>
                    )}
                  </div>
                  <div
                    className={`${styles.paragraph}`}
                    style={InterMedium.style}
                  >
                    {notification.tipe === 0 && (
                      <div>
                        {"Anda mendapatkan jadwal "}

                        <a
                          href={`/kelas/${notification.isi["idKelas"]}`}
                          className="hover:text-blue-500 focus:text-blue-500"
                        >
                          Sesi Kelas baru
                        </a>
                        {` pada ${notification.isi["waktuSesi"].slice(0, -6)}`}
                      </div>
                    )}
                    {notification.tipe === 1 && (
                      <div>
                        {"Anda mendapatkan jadwal "}

                        <a
                          href={`/kelas/${notification.isi["idKelas"]}`}
                          className="hover:text-blue-500 focus:text-blue-500 text-[#215E9B]"
                          style={PoppinsBold.style}
                        >
                          Kelas Baru
                        </a>
                      </div>
                    )}
                    {notification.tipe === 2 && (
                      <div>
                        <a
                          href={`/feedback/${notification.isi["feedbackId"]}`}
                          className="hover:text-blue-500 focus:text-blue-500 text-[#215E9B]"
                        >
                          {notification.judul}
                        </a>
                      </div>
                    )}
                    {notification.tipe === 3 &&
                      notification.isi["status"] == "disetujui" && (
                        <div>
                          {"Permintaan perubahan "}
                          <a
                            href={`/kelas/${notification.isi["idKelas"]}`}
                            className="hover:text-blue-500 focus:text-blue-500 text-[#215E9B]"
                          >
                            Sesi Kelas
                          </a>
                          {" disetujui"}
                        </div>
                      )}
                    {notification.tipe === 3 &&
                      notification.isi["status"] == "ditolak" && (
                        <div>Permintaan pengajar pengganti ditolak</div>
                      )}
                    {notification.tipe === 4 &&
                      notification.isi["status"] == "disetujui" && (
                        <div>
                          <a
                            href={`/kelas/${notification.isi["idKelas"]}`}
                            className="hover:text-blue-500 focus:text-blue-500"
                          >
                            Sesi Kelas
                          </a>
                          {` pada ${notification.isi["waktuSesi"].slice(
                            0,
                            -6
                          )} digantikan oleh ${notification.isi["pengganti"]}`}
                        </div>
                      )}
                    {notification.tipe === 4 &&
                      notification.isi["status"] == "ditolak" && (
                        <div>Permintaan pengajar pengganti ditolak</div>
                      )}
                    {notification.tipe === 5 && (
                      <div>
                        {"Terdapat "}
                        <a
                          href={`/perubahan-kelas`}
                          className="hover:text-blue-500 focus:text-blue-500"
                        >
                          {"permintaan perubahan jadwal"}
                        </a>
                        {" baru"}
                      </div>
                    )}
                    {notification.tipe === 6 && (
                      <div>
                        {"Terdapat "}
                        <a
                          href={`/perubahan-kelas`}
                          className="hover:text-blue-500 focus:text-blue-500"
                        >
                          {"permintaan pengajar pengganti"}
                        </a>
                        {" baru"}
                      </div>
                    )}
                    {notification.tipe === 7 && <div>{notification.judul}</div>}
                    {notification.tipe === 8 && (
                      <div>
                        <a
                          href={`/pengajar/${notification.isi["idPengajar"]}`}
                          className="hover:text-blue-500 focus:text-blue-500"
                        >
                          {notification.isi["namaPengajar"]}
                        </a>
                        {" tidak aktif selama 3 bulan"}
                      </div>
                    )}
                  </div>
                  <div
                    className={`${styles.time_tx}`}
                    style={InterReguler.style}
                  >
                    {notification.tanggalPembuatan[2] +
                      " " +
                      months[notification.tanggalPembuatan[1] - 1] +
                      " " +
                      notification.tanggalPembuatan[0] +
                      " pada " +
                      notification.tanggalPembuatan[3] +
                      ":" +
                      notification.tanggalPembuatan[4]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="ml-5 align-middle items-center text-center"><br></br></div>
    </div>
  );
};
