import { TagDetail, TagRead } from "./tag";

export type Pengajar = {
  id: string;
  nama: string;
};

export type PengajarSelect = {
  value: string;
  label: string;
};

export type PengajarDetail = {
  id: string;
  nama: string;
  alamatKTP: string,
  domisiliKota : string,
  fotoDiri : string,
  emailPribadi : string,
  email: string,
  jenisKelamin: string,
  noTelp: string,
  backupPhoneNum: string,
  noRekBank: string,
  namaBank: string,
  namaPemilikRek: string,
  fotoBukuTabungan: string,
  pendidikanTerakhir: string,
  pekerjaanLainnya: string,
  tglMasukKontrak: string,
  nik: string,
  fotoKtp: string,
  npwp: string,
  fotoNpwp: string,
  namaKontakDarurat: string,
  noTelpDarurat: string,
  role: string
  listTag: TagRead[],
  ratingKelas: number,
  // Add more fields if needed
};
