import { ReadJadwalZoom, ReadZoom } from "./platform";

export type SesiRead = {
  sesi_id: string;
  waktuPelaksanaan: string;
  status: string;
  zoom?: ReadZoom;
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
  jadwalZoom?: ReadJadwalZoom;
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
