import { useState } from 'react';
import axios from 'axios';

const UpdateTeacher = () => {
  const [formData, setFormData] = useState({
    // Inisialisasi formData sesuai dengan atribut pengajar yang akan diupdate
    password: '',
    // confirmPassword: '',// Tambahkan bidang untuk konfirmasi password
    alamatKTP: '',
    domisiliKota: '',
    emailPribadi: '',
    backupPhoneNum: '',
    noRekBank: '',
    namaBank: '',
    namaPemilikRek: '',
    pendidikanTerakhir: '',
    pekerjaanLainnya: '',
    nik: '',
    Npwp: '',
    namaKontakDarurat: '',
    noTelpDarurat: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi konfirmasi password
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    // Kirim permintaan pembaruan data ke backend
    try {
      const response = await axios.put('API_ENDPOINT/user', formData);
      setSuccessMessage('Data pengajar berhasil diperbarui');
    } catch (error) {
      setError('Gagal memperbarui data pengajar');
    }
  };

  return (
    <div>
      <h1>Update Data Pengajar</h1>
      <form onSubmit={handleSubmit}>
        {/* Tambahkan bidang input untuk setiap atribut pengajar yang dapat diedit */}
        {/* Contoh: */}
        {/* <input type="text" name="alamatKTP" value={formData.alamatKTP} onChange={handleChange} /> */}
        <input
          type="password"
          name="password"
          placeholder="Password baru"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="alamatKTP"
          placeholder="Alamat KTP"
          value={formData.alamatKTP}
          onChange={handleChange}
        />
        <input
          type="text"
          name="domisiliKota"
          placeholder="Domisili Kota"
          value={formData.domisiliKota}
          onChange={handleChange}
        />
        <input
          type="email"
          name="emailPribadi"
          placeholder="Email Pribadi"
          value={formData.emailPribadi}
          onChange={handleChange}
        />
        <input
          type="text"
          name="backupPhoneNum"
          placeholder="Nomor Telepon Backup"
          value={formData.backupPhoneNum}
          onChange={handleChange}
        />
        <input
          type="text"
          name="noRekBank"
          placeholder="Nomor Rekening Bank"
          value={formData.noRekBank}
          onChange={handleChange}
        />
        <input
          type="text"
          name="namaBank"
          placeholder="Nama Bank"
          value={formData.namaBank}
          onChange={handleChange}
        />
        <input
          type="text"
          name="namaPemilikRek"
          placeholder="Nama Pemilik Rekening"
          value={formData.namaPemilikRek}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pendidikanTerakhir"
          placeholder="Pendidikan Terakhir"
          value={formData.pendidikanTerakhir}
          onChange={handleChange}
        />
        <input
          type="text"
          name="pekerjaanLainnya"
          placeholder="Pekerjaan Lainnya"
          value={formData.pekerjaanLainnya}
          onChange={handleChange}
        />
        <input
          type="text"
          name="nik"
          placeholder="NIK"
          value={formData.nik}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Npwp"
          placeholder="NPWP"
          value={formData.Npwp}
          onChange={handleChange}
        />
        <input
          type="text"
          name="namaKontakDarurat"
          placeholder="Nama Kontak Darurat"
          value={formData.namaKontakDarurat}
          onChange={handleChange}
        />
        <input
          type="text"
          name="noTelpDarurat"
          placeholder="Nomor Telepon Darurat"
          value={formData.noTelpDarurat}
          onChange={handleChange}
        />
        {/* <input
        type="file"
        name="fotoDiri"
        onChange={handleFileChange} // handleFileChange untuk mengelola file yang diunggah
        />
        <input
        type="date"
        name="tglMasukKontrak"
        value={formData.tglMasukKontrak}
        onChange={handleChange}
        /> */}
        {/* Tampilkan pesan kesalahan atau keberhasilan */}
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
        <button type="submit">Simpan Perubahan</button>
      </form>
    </div>
  );
};

export default UpdateTeacher;
