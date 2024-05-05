import { Kelas } from "./kelas";
import { Pengajar } from "./pengajar";

export type Feedback = {
  id: string;
  namaPengajar: string;
  namaProgram: string;
  tanggalPembuatan: Date;
  isi: string;
  rating: number;
  finished: boolean;
};
