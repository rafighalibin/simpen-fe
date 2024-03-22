"use client";
import { redirect, useParams } from "next/navigation";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";

export const UpdateForm = () => {
  const fetchWithToken = useFetchWithToken();
  const [formState, setFormState] = useState({
    alamatKTP: "",
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
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ["detailAkun"],
    queryFn: () => fetchWithToken(`/auth/login`).then((res) => res.json()),
    onSuccess: (detailAkun) => {
      console.log(detailAkun);
      setFormState((prev) => ({
        ...prev,
        alamatKTP: detailAkun.content.alamatKTP,
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
        tglMasukKontrak: new Date(detailAkun.content.tglMasukKontrak).toISOString().split("T")[0],
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
      fetchWithToken("/user", "PUT", formState).then((res) => res.json()),
  });

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
      // Update formState untuk field NPWP
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleChangePendidikanTerakhir = (e) => {
    const { value } = e;
    setFormState((prev) => ({ ...prev, pendidikanTerakhir: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Ambil file yang dipilih oleh pengguna
    if (file) {
      // Jika ada file yang dipilih
      const reader = new FileReader(); // Buat objek FileReader
      reader.onloadend = () => {
        // Saat selesai membaca file
        setFormState((prev) => ({
          // Update state formState dengan file gambar yang dipilih
          ...prev,
          fotoDiri: file,
        }));
      };
      reader.readAsDataURL(file); // Baca file sebagai data URL
    }
  };

  const handleFileChangeKTP = (e) => {
    const file = e.target.files[0]; // Ambil file yang dipilih oleh pengguna
    if (file) {
      // Jika ada file yang dipilih
      const reader = new FileReader(); // Buat objek FileReader
      reader.onloadend = () => {
        // Saat selesai membaca file
        setFormState((prev) => ({
          // Update state formState dengan file gambar yang dipilih
          ...prev,
          fotoKtp: file,
        }));
      };
      reader.readAsDataURL(file); // Baca file sebagai data URL
    }
  };

  const handleFileChangeBukuTabungan = (e) => {
    const file = e.target.files[0]; // Ambil file yang dipilih oleh pengguna
    if (file) {
      // Jika ada file yang dipilih
      const reader = new FileReader(); // Buat objek FileReader
      reader.onloadend = () => {
        // Saat selesai membaca file
        setFormState((prev) => ({
          // Update state formState dengan file gambar buku tabungan yang dipilih
          ...prev,
          fotoBukuTabungan: file,
        }));
      };
      reader.readAsDataURL(file); // Baca file sebagai data URL
    }
  };

  const handleFileChangeNPWP = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({
          ...prev,
          fotoNpwp: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateProfileMutation();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isSuccess) redirect(`/user`);

  return (
    <div>
      <div className=" px-80 py-20 space-y-10 flex-grow flex flex-col justify-center">
        <h1 className=" flex justify-center text-5xl font-bold text-neutral/100 ">
          Detail Akun
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-md rounded-lg ">
            <div className="flex flex-col items-center pb-16">
              <label className="block font-medium text-neutral/70">
                Foto Diri
              </label>
              <div className="mt-1 relative w-48 h-48 flex items-center justify-center rounded-full overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                {formState.fotoDiri && (
                  <img
                    src={URL.createObjectURL(formState.fotoDiri)}
                    alt="Foto Diri"
                    className="object-cover w-full h-full"
                    style={{ borderRadius: "50%" }}
                  />
                )}
                {!formState.fotoDiri && (
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
                  value={formState.email}
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
                    checked={formState.jenisKelamin === "laki-laki"}
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
            <div className="flex flex-row gap-4 space-x-8">
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Nama Lengkap
                </label>
                <div className="flex mt-1 relative">
                  <input
                    type="text"
                    value={formState.nama}
                    name="nama"
                    onChange={handleChange}
                    className="bg-base mt-1 p-2 w-full border rounded-md "
                  />
                </div>
              </div>

              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">NIK</label>
                <div className="flex mt-1 relative">
                  <input
                    type="text"
                    name="nik"
                    value={formState.nik}
                    onChange={handleChange}
                    className="bg-base mt-1 p-2 w-full border rounded-md "
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral/70">
                Alamat KTP
              </label>
              <input
                type="text"
                name="alamatKTP"
                value={formState.alamatKTP}
                onChange={handleChange}
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
                    type="text"
                    value={formState.emailPribadi}
                    name="emailPribadi"
                    onChange={handleChange}
                    className="bg-base mt-1 p-2 w-full border rounded-md "
                  />
                </div>
              </div>

              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Domisili Kota
                </label>
                <div className="flex mt-1 relative">
                  <input
                    type="text"
                    name="domisiliKota"
                    value={formState.domisiliKota}
                    onChange={handleChange}
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
                    type="text"
                    value={formState.noTelp}
                    name="noTelp"
                    onChange={handleChange}
                    className="bg-base mt-1 p-2 w-full border rounded-md "
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
                    value={formState.backupPhoneNum}
                    onChange={handleChange}
                    className="bg-base mt-1 p-2 w-full border rounded-md "
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
                    type="text"
                    value={formState.namaKontakDarurat}
                    name="namaKontakDarurat"
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
                    type="text"
                    name="noTelpDarurat"
                    value={formState.noTelpDarurat}
                    onChange={handleChange}
                    className="bg-base mt-1 p-2 w-full border rounded-md "
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
                  <select
                    value={formState.pendidikanTerakhir}
                    name="pendidikanTerakhir"
                    onChange={handleChange}
                    className="bg-base p-2 w-full border rounded-md"
                  >
                    <option value="">Pilih Pendidikan Terakhir</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
              </div>
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Pekerjaan Lainnya
                </label>
                <div className="flex mt-1 relative">
                  <input
                    type="text"
                    name="pekerjaanLainnya"
                    value={formState.pekerjaanLainnya}
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
                  type="file"
                  accept="image/*"
                  onChange={handleFileChangeKTP} // Gunakan fungsi handleFileChangeKTP untuk foto KTP
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                {formState.fotoKtp && (
                  <img
                    src={URL.createObjectURL(formState.fotoKtp)}
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
                    type="date"
                    value={formState.tglMasukKontrak}
                    name="tanggalMasukKontrak"
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
                    type="text"
                    name="namaBank"
                    value={formState.namaBank}
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
                    type="text"
                    value={formState.noRekBank}
                    name="noRekBank"
                    onChange={handleChange}
                    className="bg-base mt-1 p-2 w-full border rounded-md "
                  />
                </div>
              </div>
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Nama Pemilik Rekening Bank
                </label>
                <div className="flex mt-1 relative">
                  <input
                    type="text"
                    value={formState.namaPemilikRek}
                    name="namaPemilikRek"
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
                  type="file"
                  accept="image/*"
                  onChange={handleFileChangeBukuTabungan} // Gunakan fungsi handleFileChangeBukuTabungan untuk foto buku tabungan
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                {formState.fotoBukuTabungan && (
                  <img
                    src={URL.createObjectURL(formState.fotoBukuTabungan)}
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
                    value={formState.memilikiNPWP}
                  >
                    <option value="">Pilih</option>
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </div>
              </div>
              {formState.memilikiNPWP === "Ya" && (
                <div className="w-1/2 relative">
                  <label className="block font-medium text-neutral/70">
                    NPWP
                  </label>
                  <div className="flex mt-1 relative">
                    <input
                      type="text"
                      value={formState.npwp}
                      onChange={handleChange}
                      className="bg-base mt-1 p-2 w-full border rounded-md"
                      name="npwp"
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium text-neutral/70">
                Foto NPWP
              </label>
              <div className="mt-1 relative w-full h-80 flex items-center justify-center rounded-lg overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChangeNPWP}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                {formState.fotoNpwp && (
                  <img
                    src={URL.createObjectURL(formState.fotoNpwp)}
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
            <div className="flex justify-center py-7 gap-4">
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
      </div>
    </div>
  );
};
