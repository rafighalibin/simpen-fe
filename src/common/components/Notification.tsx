import React, { useState } from "react";
import {
  PoppinsBold,
  PoppinsMedium,
  InterMedium,
  InterReguler,
} from "../../font/font";
import styles from "./Notification.module.css";
import { useMutation } from "react-query";
import useFetchWithToken from "../hooks/fetchWithToken";

export const Notification = ({ data, onUpdate }) => {
  const fetchWithToken = useFetchWithToken();
  const [notifications, setNotifications] = useState(data);
  const [formState, setFormState] = useState();

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
    <div className="px-4 text-16px md:block hidden relative  ">
      <div className="flex items-center"></div>
      {notifications.length > 0 && (
        <div className="absolute z-10 top-full right-10 mt-3 bg-white border border-gray-200 rounded-lg shadow-md max-h-[3  0vh] overflow-y-auto">
          <div
            className={`pl-2 pt-2 ${styles.title} text-center`}
            style={PoppinsMedium.style}
          >
            Notifikasi untuk Anda
          </div>
          <ul className="pt-2">
            {notifications.map((notification, index) => (
              <li
                key={index}
                className={`p-2 border border-gray-200 ${
                  !notification.opened ? "bg-[#e6f2ff] " : "bg-white"
                } hover:bg-[#fff8e1] focus:bg-[#fff8e1]`}
                onClick={() => handleIsOpened(notification.id)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <div
                    style={PoppinsBold.style}
                    className={`${styles.heading}`}
                  >
                    {notification.tipe === 1 && <div>Assign Kelas</div>}
                    {notification.tipe === 2 && <div>Feedback</div>}
                    {notification.tipe === 3 && (
                      <div>Permintaan Perubahan Jadwal</div>
                    )}
                    {notification.tipe === 4 && (
                      <div>Permintaan Pengajar Pengganti</div>
                    )}
                    {notification.tipe === 5 && (
                      <div>Permintaan Perubahan Jadwal</div>
                    )}
                    {notification.tipe === 6 && (
                      <div>Permintaan Pengajar Pengganti</div>
                    )}
                    {notification.tipe === 7 && <div>Assign PIC Akademik</div>}
                    {notification.tipe === 8 && <div>Akun Tidak Aktif</div>}
                  </div>
                  <div
                    className={`${styles.paragraph}`}
                    style={InterMedium.style}
                  >
                    {notification.tipe === 1 && (
                      <div>
                        {"Anda mendapatkan jadwal "}

                        <a
                          href={`/kelas/${notification.isi["idKelas"]}`}
                          className="hover:text-blue-500 focus:text-blue-500"
                        >
                          kelas baru
                        </a>
                      </div>
                    )}
                    {notification.tipe === 2 && <div>Ini feedback</div>}
                    {notification.tipe === 3 &&
                      notification.isi["status"] == "disetujui" && (
                        <div>
                          {"Permintaan perubahan "}
                          <a
                            href={`/sesi/${notification.isi["sesiKelas"]}`}
                            className="hover:text-blue-500 focus:text-blue-500"
                          >
                            Sesi kelas
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
                            href={`/sesi/${notification.isi["sesiKelas"]}`}
                            className="hover:text-blue-500 focus:text-blue-500"
                          >
                            Sesi kelas
                          </a>
                          {" digantikan oleh " + notification.isi["pengganti"]}
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
                          href={`/permintaan-kelas`}
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
                          href={`/permintaan-kelas`}
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
                      "-" +
                      notification.tanggalPembuatan[1] +
                      "-" +
                      notification.tanggalPembuatan[0] +
                      " pada " +
                      notification.tanggalPembuatan[3] +
                      ":" +
                      notification.tanggalPembuatan[4]}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
