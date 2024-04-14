import { Program } from "./program";

export type JenisKelas = {
    id: string;
    nama: string;
    pertemuan: string;
    tipe: string;
    bahasa: string;
    picAkademikId: string;
    picAkademikNama: string;
    listProgram: Program[];
};

export type JenisKelasSelect = {
  value: string;
  label: string;
};