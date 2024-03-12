import { JenisKelas } from "./jenis";

export type Program ={
    id: string;
    nama: string;
    jumlahLevel: number;
    jumlahPertemuan: number;
    listJenisKelas: JenisKelas[];
};

