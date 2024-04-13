import { PeriodePayroll } from "./PeriodePayroll";

    export type absenPengajarRead = {
    id: string;
    kodeKelas: number;
    pengajar: string;
    jenisKelasName: string;
    programName: string;
    fee : number;
    tanggalAbsen: string;
    listPeriodePayroll: PeriodePayroll[];
  };
  
  export type absenPengajarSelect = {
    value: string;
    label: string;
  };

  export type absenPengajarDetail = {
    id: string;
    nama: string;
  };