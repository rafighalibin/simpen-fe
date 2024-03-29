export type SesiRead = {
  sesi_id: string;
  waktuPelaksanaan: string;
  status: string;
};

export type SesiSelect = {
  value: string;
  label: string;
};

export type SesiDetail = {
  nomorPertemuan: number;
  sesi_id: string;
  waktuPelaksanaan: string;
  status: string;
  listMuridSesi: MuridSesi[];
  persentaseKehadiran: number;
  averageRating: number;
};

export type MuridSesi = {
  id: string;
  nama: string;
  namaOrtu: string;
  emailOrtu: string;
  noHpOrtu: string;
  muridId: number;
  sesiId: string;
  isPresent: boolean;
  rating: number;
  komentar: string;
};
