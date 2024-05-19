import { JenisKelas } from "./jeniskelas";
import { Program } from "./program";

export type RatingMurid = {
  program: Program[];
  jenisKelas: JenisKelas[];
  rating: number;
  linkPlaylist: string;
  tanggalSelesai: Date;
};

export type Rating = {
  idPengajar: string;
  namaPengajar: string;
  listRatingMurid: RatingMurid[];
};
