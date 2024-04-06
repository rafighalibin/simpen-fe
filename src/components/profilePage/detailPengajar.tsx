"use client";

import { useQuery } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import useFetchAllUser from "../../common/hooks/user/useFetchAllUser";
import Loading from "../../common/components/Loading";
import { useAuthContext } from "../../common/utils/authContext";
import { useParams, usePathname, useRouter } from "next/navigation";
import { PoppinsBold, InterMedium } from "../../font/font";
import styles from "./DetailUser.module.css";
import { useEffect, useState } from "react";
import useFetchPengajarDetail from "../../common/hooks/user/useFetchPengajarDetail";

const DetailPengajar = ({ buttons }) => {
  const { id } = useParams();
  const { pengguna, isAuthenticated } = useAuthContext();
  const path = usePathname();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const { isLoading: PengajarLoading, listPengajarExisting: pengajar, refetch } =
    useFetchPengajarDetail();

    console.log(pengajar);

    useEffect(() => {
      // Refetch data whenever component mounts
      refetch();
    }, [refetch]);

  useEffect(() => {
    // Check if localStorage is available
    if (typeof localStorage !== "undefined") {
      // Check success status in localStorage
      const updateSuccess = localStorage.getItem("addTagSuccess");

      // Show Success Alert if tag is successfully created
      if (updateSuccess === "true") {
        setShowSuccessAlert(true);

        // Remove success status from localStorage after displaying
        localStorage.removeItem("addTagSuccess");
      }
    }
  }, []);

  if (PengajarLoading) return <Loading />;

  const cariIdSama = (data: any[], idYangDicari) => {
    const hasilPencarian = [];

    // Loop melalui setiap objek dalam data
    for (let i = 0; i < data.length; i++) {
      // Mengecek jika objek memiliki properti id dan nilai id yang sama dengan id yang dicari
      if (data[i].id === idYangDicari) {
        // Menyimpan objek yang cocok ke dalam array hasilPencarian
        hasilPencarian.push(data[i]);
        console.log(data[i]);
      }
    }
    return hasilPencarian;
  };
  const specificUser = cariIdSama(pengajar, id)[0];
  console.log(specificUser);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US");
  };

  return (
    <div>
      <div className=" px-48 py-20 space-y-10 flex-grow flex flex-col justify-center">
        <h1 className=" flex justify-center text-6xl font-bold text-neutral/100 ">
          Detail Akun
        </h1>
        {/* Success Alert */}
        {showSuccessAlert && (
          <div className="pb-2">
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline">
                {" "}
                Tag successfully updated.
              </span>
              <span
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setShowSuccessAlert(false)}
              >
                <svg
                  className="fill-current h-6 w-6 text-green-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path
                    fillRule="evenodd"
                    d="M14.348 5.652a.5.5 0 0 1 0 .707l-8 8a.5.5 0 1 1-.707-.707l8-8a.5.5 0 0 1 .707 0z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M5.652 5.652a.5.5 0 0 0-.707 0l-8 8a.5.5 0 0 0 .707.707l8-8a.5.5 0 0 0 0-.707z"
                  />
                </svg>
              </span>
            </div>
          </div>
        )}
        { specificUser &&(
          <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-md rounded-lg ">
            <div className="flex justify-between flex-col items-center pb-8">
              <label className="block font-medium text-neutral/70">
                Foto Diri
              </label>
              <div className="mt-1 relative w-48 h-48 flex items-center justify-center rounded-full overflow-hidden">
                <input
                  disabled
                  type="file"
                  value={""}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                  {!specificUser.fotoDiri && (
                    <div className="bg-neutral/5 rounded-full flex items-center justify-center w-full h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    </div>
                  )}
                {specificUser.fotoDiri && (
                  <img
                    src={specificUser.fotoDiri}
                    alt="Foto Diri"
                    className="object-cover w-full h-full"
                    style={{ borderRadius: "50%" }}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-3 pt-8">
                {specificUser.listTag.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center space-x-2 bg-gray-200 rounded-md p-2"
                  >
                    <span>{tag.nama}</span>
                  </div>
                ))}
              </div>
            </div>
              <div className="flex justify-end">
              {buttons}
            </div>
            <h1 className=" flex text-3xl font-bold text-neutral/100 ">
              Data Diri
            </h1>
            <div className="flex flex-row gap-4 space-x-8">
              <div className="w-1/2">
                <label className="block font-medium text-neutral/70">
                  Email Kalananti
                </label>
                <input
                  disabled
                  type="text"
                  name="email"
                  value={specificUser.email == null ? "" : specificUser.email}
                  className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium text-neutral/70">
                  Jenis Kelamin
                </label>
                <div className="flex items-center mt-1">
                  <input
                    disabled
                    type="radio"
                    id="laki-laki"
                    name="jenisKelamin"
                    value="laki-laki"
                    checked={specificUser.jenisKelamin === "laki-laki"}
                    className="mr-2"
                  />
                  <label htmlFor="laki-laki" className="mr-4">
                    Laki-laki
                  </label>
                  <input
                    disabled
                    type="radio"
                    id="perempuan"
                    name="jenisKelamin"
                    value="perempuan"
                    checked={specificUser.jenisKelamin === "perempuan"}
                    className="mr-2"
                  />
                  <label htmlFor="perempuan">Perempuan</label>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 space-x-8">
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Nama Lengkap
                </label>
                <div className="flex mt-1 relative">
                  <input
                    disabled
                    readOnly
                    type="text"
                    value={specificUser.nama == null ? "" : specificUser.nama}
                    name="nama"
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md "
                  />
                </div>
              </div>

              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">NIK</label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    name="nik"
                    value={specificUser.nik == null ? "" : specificUser.nik}
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral/70">
                Alamat KTP
              </label>
              <input
                disabled
                readOnly
                type="text"
                name="alamatKTP"
                value={
                  specificUser.alamatKTP == null ? "" : specificUser.alamatKTP
                }
                className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div className="flex flex-row gap-4 space-x-8">
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Email Pribadi
                </label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    value={
                      specificUser.emailPribadi == null
                        ? ""
                        : specificUser.emailPribadi
                    }
                    name="emailPribadi"
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>

              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Domisili Kota
                </label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    name="domisiliKota"
                    value={
                      specificUser.domisiliKota == null
                        ? ""
                        : specificUser.domisiliKota
                    }
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 space-x-8">
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  No. Telpon
                </label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    value={
                      specificUser.noTelp == null ? "" : specificUser.noTelp
                    }
                    name="noTelp"
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>

              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  No. Telpon Alternatif
                </label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    name="backupPhoneNum"
                    value={
                      specificUser.backupPhoneNum == null
                        ? ""
                        : specificUser.backupPhoneNum
                    }
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 space-x-8">
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Nama Kontak Darurat
                </label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    value={
                      specificUser.namaKontakDarurat == null
                        ? ""
                        : specificUser.namaKontakDarurat
                    }
                    name="namaKontakDarurat"
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>

              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  No. Telpon Kontak Darurat
                </label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    name="noTelpDarurat"
                    value={
                      specificUser.noTelpDarurat == null
                        ? ""
                        : specificUser.noTelpDarurat
                    }
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 space-x-8">
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Pendidikan Terakhir
                </label>
                <div className="mt-1 relative">
                  <input
                    aria-readonly
                    disabled
                    value={
                      specificUser.pendidikanTerakhir == null
                        ? ""
                        : specificUser.pendidikanTerakhir
                    }
                    name="pendidikanTerakhir"
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Pekerjaan Lainnya
                </label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    name="pekerjaanLainnya"
                    value={
                      specificUser.pekerjaanLainnya == null
                        ? ""
                        : specificUser.pekerjaanLainnya
                    }
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block font-medium text-neutral/70">
                Foto KTP
              </label>
              <div className="mt-1 relative w-full h-80 flex items-center justify-center rounded-lg overflow-hidden">
                <input
                  disabled
                  type="file"
                  accept="image/*"
                  value={""}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                {specificUser.fotoKtp && (
                  <img
                    src={specificUser.fotoKtp}
                    alt="Foto KTP"
                    className="object-cover w-full h-full"
                  />
                )}
                {!specificUser.fotoKtp && (
                  <div className="bg-neutral/5 w-full h-full flex items-center justify-center">
                    <svg
                      data-slot="icon"
                      fill="none "
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-20 h-20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <h1 className=" flex text-3xl pt-12 font-bold text-neutral/100 ">
              Data Pengajar
            </h1>
            <div className="flex flex-row gap-4 space-x-8">
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Tanggal Masuk Kontrak
                </label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    value={
                      specificUser.tglMasukKontrak == null
                        ? ""
                        : formatDate(specificUser.tglMasukKontrak)
                    }
                    name="tglMasukKontrak"
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>

              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Nama Bank Penerima
                </label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    name="namaBank"
                    value={
                      specificUser.namaBank == null ? "" : specificUser.namaBank
                    }
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 space-x-8">
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Nomor Rekening Bank
                </label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    value={
                      specificUser.noRekBank == null
                        ? ""
                        : specificUser.noRekBank
                    }
                    name="noRekBank"
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Nama Pemilik Rekening Bank
                </label>
                <div className="flex mt-1 relative">
                  <input
                    readOnly
                    disabled
                    type="text"
                    value={
                      specificUser.namaPemilikRek == null
                        ? ""
                        : specificUser.namaPemilikRek
                    }
                    name="namaPemilikRek"
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block font-medium text-neutral/70">
                Foto Buku Tabungan
              </label>
              <div className="mt-1 relative w-full h-80 flex items-center justify-center rounded-lg overflow-hidden">
                <input
                  disabled
                  type="file"
                  accept="image/*"
                  value={""}
                  // Gunakan fungsi handleFileChangeBukuTabungan untuk foto buku tabungan
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                {specificUser.fotoBukuTabungan && (
                  <img
                    src={specificUser.fotoBukuTabungan}
                    alt="Foto Buku Tabungan"
                    className="object-cover w-full h-full"
                  />
                )}
                {!specificUser.fotoBukuTabungan && (
                  <div className="bg-neutral/5 w-full h-full flex items-center justify-center">
                    <svg
                      data-slot="icon"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-20 w-20"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block font-medium text-neutral/70">NPWP</label>
              <input
                disabled
                readOnly
                type="text"
                name="npwp"
                value={specificUser.npwp == null ? "" : specificUser.npwp}
                className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium text-neutral/70">
                Foto NPWP
              </label>
              <div className="mt-1 relative w-full h-80 flex items-center justify-center rounded-lg overflow-hidden">
                <input
                  disabled
                  type="file"
                  accept="image/*"
                  value={""}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                {specificUser.fotoNpwp && (
                  <img
                    src={specificUser.fotoNpwp}
                    alt="Foto NPWP"
                    className="object-cover w-full h-full"
                  />
                )}
                {!specificUser.fotoNpwp && (
                  <div className="bg-neutral/5 w-full h-full flex items-center justify-center">
                    <svg
                      data-slot="icon"
                      fill="none"
                      strokeWidth="1.5"
                      className="w-20 h-20"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPengajar;
