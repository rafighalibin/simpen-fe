"use client";
import { redirect } from "next/navigation";
import { useMutation, useQuery } from "react-query";
import { useState, useRef } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useQueryClient } from "react-query";
import { useAuthContext } from "../../common/utils/authContext";
import Loading from "../../common/components/Loading";

export const UpdateForm = () => {
  const fetchWithToken = useFetchWithToken();
  const queryClient = useQueryClient();
  const { pengguna, isAuthenticated } = useAuthContext();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const nikRef = useRef(null);
  const passReff = useRef(null);
  const [formState, setFormState] = useState({
    id: "",
    role: "",
    alamatKTP: "",
    password: "",
    konfirmasiPassword: "",
    domisiliKota: "",
    nama: "",
    fotoDiri: null,
    emailPribadi: "",
    email: "",
    jenisKelamin: "",
    noTelp: "",
    backupPhoneNum: "",
    noRekBank: "",
    namaBank: "",
    namaPemilikRek: "",
    fotoBukuTabungan: null,
    pendidikanTerakhir: "",
    pekerjaanLainnya: "",
    tglMasukKontrak: "",
    nik: "",
    fotoKtp: null,
    npwp: "",
    memilikiNPWP: "",
    fotoNpwp: null,
    namaKontakDarurat: "",
    noTelpDarurat: "",
    nikError: "",
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ["detailAkun"],
    queryFn: () => fetchWithToken(`/auth/login`).then((res) => res.json()),
    onSuccess: (detailAkun) => {
      console.log(detailAkun);
      setFormState((prev) => ({
        ...prev,
        id: detailAkun.content.id,
        role: detailAkun.content.role,
        alamatKTP: detailAkun.content.alamatKTP,
        password: null,
        konfirmasiPassword: null,
        nama: detailAkun.content.nama,
        domisiliKota: detailAkun.content.domisiliKota,
        fotoDiri: detailAkun.content.fotoDiri,
        emailPribadi: detailAkun.content.emailPribadi,
        email: detailAkun.content.email,
        jenisKelamin: detailAkun.content.jenisKelamin,
        noTelp: detailAkun.content.noTelp,
        backupPhoneNum: detailAkun.content.backupPhoneNum,
        noRekBank: detailAkun.content.noRekBank,
        namaBank: detailAkun.content.namaBank,
        namaPemilikRek: detailAkun.content.namaPemilikRek,
        fotoBukuTabungan: detailAkun.content.fotoBukuTabungan,
        pendidikanTerakhir: detailAkun.content.pendidikanTerakhir,
        pekerjaanLainnya: detailAkun.content.pekerjaanLainnya,
        tglMasukKontrak: detailAkun.content.tglMasukKontrak,
        nik: detailAkun.content.nik,
        fotoKtp: detailAkun.content.fotoKtp,
        npwp: detailAkun.content.npwp,
        memilikiNPWP: detailAkun.content.memilikiNPWP,
        fotoNpwp: detailAkun.content.fotoNpwp,
        namaKontakDarurat: detailAkun.content.namaKontakDarurat,
        noTelpDarurat: detailAkun.content.noTelpDarurat,
      }));
    },
  });

  const {
    mutateAsync: updateProfileMutation,
    data: editResponse,
    isSuccess,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/user`, "PUT", formState).then((res) => res.json()),
    onSuccess: () => {
      console.log(formState);
    },
  });

  const handleConfirmPassword = () => {
    if (formState.password !== formState.konfirmasiPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    if (name === "memilikiNPWP") {
      if (value === "Tidak") {
        // Jika opsi "Tidak" dipilih, atur nilai NPWP menjadi kosong dan disable field
        setFormState((prevState) => ({
          ...prevState,
          memilikiNPWP: value,
          npwp: "",
        }));
      } else {
        // Jika opsi "Ya" dipilih, atur memilikiNPWP dan enable field NPWP
        setFormState((prevState) => ({
          ...prevState,
          memilikiNPWP: value,
        }));
      }
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      // Update formState untuk field NPWP
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(pengguna.role);

    if (
      pengguna.role === "pengajar" &&
      (formState.nik.length !== 16 || !/^\d+$/.test(formState.nik))
    ) {
      setFormState({
        ...formState,
        nikError: "NIK harus terdiri dari 16 digit angka",
      });
      // Setelah menetapkan pesan kesalahan, fokuskan kembali ke input NIK
      nikRef.current.focus();
      return; // Menghentikan proses submit jika terdapat kesalahan
    }
    if (formState.password !== formState.konfirmasiPassword) {
      console.log(formState.password, formState.konfirmasiPassword);
      passReff.current.focus();
      return;
    }
    updateProfileMutation();
  };

  const handleFotoDiriChange = (e) => {
    formState.fotoDiri = e.target.files[0];

    getBase64(formState.fotoDiri)
      .then((result) => {
        setFormState((prevState) => ({
          ...prevState,
          fotoDiri: result,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFotoKtpChange = (e) => {
    formState.fotoKtp = e.target.files[0];

    getBase64(formState.fotoKtp)
      .then((result) => {
        setFormState((prevState) => ({
          ...prevState,
          fotoKtp: result,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFotoBukuTabunganChange = (e) => {
    formState.fotoBukuTabungan = e.target.files[0];

    getBase64(formState.fotoBukuTabungan)
      .then((result) => {
        setFormState((prevState) => ({
          ...prevState,
          fotoBukuTabungan: result,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFotoNPWPChange = (e) => {
    formState.fotoNpwp = e.target.files[0];

    getBase64(formState.fotoNpwp)
      .then((result) => {
        setFormState((prevState) => ({
          ...prevState,
          fotoNpwp: result,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function getBase64(file) {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result as string; // Explicitly cast reader.result to string
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  }

  if (isLoading) {
    return <Loading />;
  }

  // Fungsi untuk mengubah tanggal dalam format dd/mm/yyyy menjadi format yang sesuai untuk nilai input dengan tipe date (yyyy-mm-dd)
  function formatDateFromTimestampToInputValue(timestamp) {
    // Buat objek Date dari timestamp
    const date = new Date(timestamp);
    
    // Ambil tanggal, bulan, dan tahun dari objek Date
    const day = date.getDate().toString().padStart(2, '0'); // Tambahkan nol di depan jika hanya satu digit
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tambahkan nol di depan jika hanya satu digit
    const year = date.getFullYear();
  
    // Gabungkan tanggal, bulan, dan tahun menjadi format yyyy-mm-dd
    return `${year}-${month}-${day}`;
  }
  

  if (isSuccess) {
    queryClient.invalidateQueries("detailAkun");
    localStorage.setItem("updateSuccess", "true");
    redirect(`/user/profile`);
  }

  return (
    <div>
      <div className=" px-80 py-20 space-y-10 flex-grow flex flex-col justify-center">
        <h1 className=" flex justify-center text-6xl pb-4 font-bold text-neutral/100 ">
          Detail Akun
        </h1>
        {pengguna.role === "pengajar" && (
          <form onSubmit={handleSubmit}>
            <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg ">
              <div className="flex flex-col items-center pb-16">
                <label className="block font-medium text-neutral/70">
                  Foto Diri
                </label>
                <div className="mt-1 relative w-48 h-48 flex items-center justify-center rounded-full overflow-hidden">
                  <input
                    required={!formState.fotoDiri} 
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFotoDiriChange}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  {formState.fotoDiri ? (
                    <img
                      src={formState.fotoDiri}
                      alt="Foto Diri"
                      className="object-cover w-full h-full"
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    <div className="bg-neutral/5 rounded-full flex items-center justify-center w-full h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-12 w-12 text-neutral/50"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                  )}
                </div>
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
                    readOnly
                    type="text"
                    name="email"
                    value={formState.email == null ? "" : formState.email}
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>

                <div className="w-1/2">
                  <label className="block font-medium text-neutral/70">
                    Jenis Kelamin
                  </label>
                  <div className="flex items-center mt-1">
                    <input
                      required
                      type="radio"
                      id="laki-laki"
                      name="jenisKelamin"
                      value="laki-laki"
                      onChange={handleChange}
                      checked={formState.jenisKelamin == "laki-laki"}
                      className="mr-2"
                    />
                    <label htmlFor="laki-laki" className="mr-4">
                      Laki-laki
                    </label>
                    <input
                      required
                      type="radio"
                      id="perempuan"
                      name="jenisKelamin"
                      value="perempuan"
                      onChange={handleChange}
                      checked={formState.jenisKelamin === "perempuan"}
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
                      required
                      type="text"
                      name="nama"
                      onChange={handleChange}
                      placeholder="Nama Lengkap"
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                      value={formState.nama == null ? "" : formState.nama}
                    />
                  </div>
                </div>
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    NIK
                  </label>
                  <div
                    className={`flex mt-1 relative ${
                      formState.nikError ? "border-red-500" : ""
                    }`}
                  >
                    <input
                      required
                      type="text"
                      name="nik"
                      value={formState.nik == null ? "" : formState.nik}
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md"
                      ref={nikRef}
                      placeholder="NIK"
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.value = input.value.replace(/[^0-9]/g, ""); // Menghapus karakter selain angka
                      }}
                    />
                  </div>
                  {formState.nikError && (
                    <p className="text-red-500 text-sm mt-1">
                      {formState.nikError}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral/70">
                  Alamat KTP
                </label>
                <input
                  required
                  type="text"
                  name="alamatKTP"
                  value={formState.alamatKTP == null ? "" : formState.alamatKTP}
                  onChange={handleChange}
                  placeholder="Alamat KTP"
                  className="bg-base mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div className="flex flex-row gap-4 space-x-8">
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    Email Pribadi
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      type="email"
                      value={
                        formState.emailPribadi == null
                          ? ""
                          : formState.emailPribadi
                      }
                      name="emailPribadi"
                      onChange={handleChange}
                      placeholder="Email Pribadi"
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                    />
                  </div>
                </div>

                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    Alamat Domisili
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      type="text"
                      name="domisiliKota"
                      value={
                        formState.domisiliKota == null
                          ? ""
                          : formState.domisiliKota
                      }
                      onChange={handleChange}
                      placeholder="Alamat Domisili"
                      className="bg-base mt-1 p-2 w-full border rounded-md "
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
                      required
                      type="text"
                      value={formState.noTelp == null ? "" : formState.noTelp}
                      name="noTelp"
                      onChange={handleChange}
                      placeholder="No. Telpon"
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                      min={formState.noTelp}
                      max={formState.noTelp}
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.value = input.value.replace(/[^0-9]/g, ""); // Menghapus karakter selain angka
                      }}
                    />
                  </div>
                </div>

                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    No. Telpon Alternatif
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      type="text"
                      name="backupPhoneNum"
                      placeholder="No. Telpon Alternatif"
                      value={
                        formState.backupPhoneNum == null
                          ? ""
                          : formState.backupPhoneNum
                      }
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.value = input.value.replace(/[^0-9]/g, ""); // Menghapus karakter selain angka
                      }}
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
                      required
                      type="text"
                      value={
                        formState.namaKontakDarurat == null
                          ? ""
                          : formState.namaKontakDarurat
                      }
                      name="namaKontakDarurat"
                      placeholder="Nama Kontak Darurat"
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                    />
                  </div>
                </div>

                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    No. Telpon Kontak Darurat
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      required
                      type="text"
                      name="noTelpDarurat"
                      placeholder="No. Telpon Kontak Darurat"
                      value={
                        formState.noTelpDarurat == null
                          ? ""
                          : formState.noTelpDarurat
                      }
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.value = input.value.replace(/[^0-9]/g, ""); // Menghapus karakter selain angka
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4 space-x-8">
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    Pendidikan Terakhir (Institusi - Jurusan)
                  </label>
                  <div className="mt-1 relative">
                    <input
                      required
                      type="text"
                      name="pendidikanTerakhir"
                      placeholder="(Contoh: UI-Hubungan Internasional)"
                      value={
                        formState.pendidikanTerakhir == null
                          ? ""
                          : formState.pendidikanTerakhir
                      }
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                    />
                  </div>
                </div>
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    Pekerjaan Lainnya Saat ini
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      required
                      type="text"
                      name="pekerjaanLainnya"
                      placeholder=" (Contoh: Guru di Sekolah X)"
                      value={
                        formState.pekerjaanLainnya == null
                          ? ""
                          : formState.pekerjaanLainnya
                      }
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
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
                    required={!formState.fotoKtp} 
                    type="file"
                    accept="image/*"
                    onChange={handleFotoKtpChange} // Gunakan fungsi handleFileChangeKTP untuk foto KTP
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  {formState.fotoKtp && (
                    <img
                      src={formState.fotoKtp}
                      alt="Foto KTP"
                      className="object-cover w-full h-full"
                    />
                  )}
                  {!formState.fotoKtp && (
                    <div className="bg-neutral/5 w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-12 w-12 text-neutral/50"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
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
                      required={!formState.tglMasukKontrak} 
                      type="date"
                      value={formState.tglMasukKontrak ? formatDateFromTimestampToInputValue(formState.tglMasukKontrak) : ""}
                      name="tglMasukKontrak"
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                    />
                  </div>
                </div>

                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    Nama Bank Penerima
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      required
                      type="text"
                      name="namaBank"
                      placeholder="Nama Bank Penerima"
                      value={
                        formState.namaBank == null ? "" : formState.namaBank
                      }
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
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
                      required
                      type="text"
                      value={
                        formState.noRekBank == null ? "" : formState.noRekBank
                      }
                      name="noRekBank"
                      placeholder="Nomor Rekening Bank"
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                      onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.value = input.value.replace(/[^0-9]/g, ""); // Menghapus karakter selain angka
                      }}
                    />
                  </div>
                </div>
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    Nama Pemilik Rekening
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      required
                      type="text"
                      value={
                        formState.namaPemilikRek == null
                          ? ""
                          : formState.namaPemilikRek
                      }
                      name="namaPemilikRek"
                      placeholder="Nama Pemilik Rekening Bank"
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
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
                    required={!formState.fotoBukuTabungan} 
                    type="file"
                    accept="image/*"
                    onChange={handleFotoBukuTabunganChange} // Gunakan fungsi handleFileChangeBukuTabungan untuk foto buku tabungan
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  {formState.fotoBukuTabungan && (
                    <img
                      src={formState.fotoBukuTabungan}
                      alt="Foto Buku Tabungan"
                      className="object-cover w-full h-full"
                    />
                  )}
                  {!formState.fotoBukuTabungan && (
                    <div className="bg-neutral/5 w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-12 w-12 text-neutral/50"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4 space-x-8">
                  <div className="w-1/2 relative">
                    <label className="block font-medium text-neutral/70">
                      Apakah Memiliki NPWP?
                    </label>
                    <div className="flex mt-1 relative">
                      <select
                        onChange={handleChange}
                        className="bg-base mt-1 p-2 w-full border rounded-md"
                        name="memilikiNPWP"
                        value={
                          formState.memilikiNPWP == null
                            ? ""
                            : formState.memilikiNPWP
                        }
                      >
                        <option value="">Pilih</option>
                        <option value="Ya">Ya</option>
                        <option value="Tidak">Tidak</option>
                      </select>
                    </div>
                  </div>

                  {formState.memilikiNPWP === "Ya" && (
                    <>
                      <div className="w-1/2 relative">
                        <label className="block font-medium text-neutral/70">
                          NPWP
                        </label>
                        <div className="flex mt-1 relative">
                          <input
                          required
                            type="text"
                            placeholder="NPWP"
                            value={formState.npwp == null ? "" : formState.npwp}
                            onChange={handleChange}
                            className="bg-base mt-1 p-2 w-full border rounded-md"
                            name="npwp"
                            onInput={(e) => {
                              const input = e.target as HTMLInputElement;
                              input.value = input.value.replace(/[^0-9]/g, ""); // Menghapus karakter selain angka
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {formState.memilikiNPWP === "Ya" && (
                  <div className="relative">
                    <label className="block font-medium text-neutral/70">
                      Foto NPWP
                    </label>
                    <div className="mt-1 relative w-full h-80 flex items-center justify-center rounded-lg overflow-hidden">
                      <input
                      required={!formState.fotoNpwp} 
                        type="file"
                        accept="image/*"
                        value={""}
                        onChange={handleFotoNPWPChange}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      {formState.fotoNpwp && (
                        <img
                          src={formState.fotoNpwp}
                          alt="Foto NPWP"
                          className="object-cover w-full h-full"
                        />
                      )}
                      {!formState.fotoNpwp && (
                        <div className="bg-neutral/5 w-full h-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-12 w-12 text-neutral/50"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <h1 className=" flex text-3xl pt-12 font-bold text-neutral/100 ">
                Ubah Password
              </h1>
              <div className="flex flex-row gap-4 space-x-8">
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    Password Baru
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password Baru"
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                    />
                  </div>
                </div>
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    Konfirmasi Password
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      type="password"
                      name="konfirmasiPassword"
                      placeholder="Konfirmasi Password"
                      onChange={handleChange}
                      ref={passReff}
                      onBlur={handleConfirmPassword}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                    />
                  </div>
                  {!passwordsMatch && (
                    <p className="text-red-500">Password tidak cocok</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-neutral/50">
                Jika tidak ingin mengubah password, kosongkan field ini.
              </p>
              <div className="flex justify-center py-4 gap-4">
                <button
                  type="submit"
                  className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover"
                >
                  Ubah Detail Akun
                </button>
                <button className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
        {(pengguna.role === "akademik" || pengguna.role === "operasional") && (
          <form onSubmit={handleSubmit}>
            <div className="bg-base flex flex-col space-y-4 px-8 py-4 shadow-md rounded-lg">
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
                    value={formState.email == null ? "" : formState.email}
                    className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block font-medium text-neutral/70">
                    Jenis Kelamin
                  </label>
                  <div className="flex items-center mt-1">
                    <input
                      type="radio"
                      id="laki-laki"
                      name="jenisKelamin"
                      value="laki-laki"
                      onChange={handleChange}
                      checked={formState.jenisKelamin == "laki-laki"}
                      className="mr-2"
                    />
                    <label htmlFor="laki-laki" className="mr-4">
                      Laki-laki
                    </label>
                    <input
                      type="radio"
                      id="perempuan"
                      name="jenisKelamin"
                      value="perempuan"
                      onChange={handleChange}
                      checked={formState.jenisKelamin === "perempuan"}
                      className="mr-2"
                    />
                    <label htmlFor="perempuan">Perempuan</label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-medium text-neutral/70">
                  Nama Lengkap
                </label>
                <input
                required
                  type="text"
                  name="nama"
                  onChange={handleChange}
                  placeholder="Nama Lengkap"
                  className="bg-base mt-1 p-2 w-full border rounded-md "
                  value={formState.nama == null ? "" : formState.nama}
                />
              </div>
              <div className="flex flex-row gap-4 space-x-8">
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    Email Pribadi
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      type="email"
                      value={
                        formState.emailPribadi == null
                          ? ""
                          : formState.emailPribadi
                      }
                      name="emailPribadi"
                      onChange={handleChange}
                      placeholder="Email Pribadi"
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                    />
                  </div>
                </div>
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    No. Telpon
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      type="number"
                      value={formState.noTelp == null ? "" : formState.noTelp}
                      name="noTelp"
                      onChange={handleChange}
                      placeholder="No. Telpon"
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                    />
                  </div>
                </div>
              </div>
              <h1 className=" flex text-3xl pt-12 font-bold text-neutral/100 ">
                Ubah Password
              </h1>
              <div className="flex flex-row gap-4 space-x-8">
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    Password Baru
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password Baru"
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                    />
                  </div>
                </div>
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    Konfirmasi Password
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      type="password"
                      name="konfirmasiPassword"
                      placeholder="Konfirmasi Password"
                      onChange={handleChange}
                      onBlur={handleConfirmPassword}
                      className="bg-base mt-1 p-2 w-full border rounded-md "
                    />
                  </div>
                  {!passwordsMatch && (
                    <p className="text-red-500">Password tidak cocok</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-neutral/50">
                Jika tidak ingin mengubah password, kosongkan field ini.
              </p>
              <div className="flex justify-center py-4 gap-4">
                <button
                  type="submit"
                  className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover"
                >
                  Ubah Detail Akun
                </button>
                <button className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
