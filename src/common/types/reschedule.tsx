import { SesiRead } from "./sesi";

export type ReadReschedule = {
  id: string;
  waktuAwal: string;
  waktuBaru: string;
  alasan: string;
  status: string;
  waktuPermintaan: string;
};
export type ReadSesiReschedule = {
  sesiKelas: SesiRead;
  listReschedule: ReadReschedule[];
};

export type CreateRescheduleForm = {
  sesiKelasId: string;
  tanggalBaru: string;
  waktuBaru: string;
  alasan: string;
  ischanged: boolean;
};

export type CreateReschedulePayload = {
  sesiKelasId: string;
  waktuBaru: string;
  alasan: string;
  ischanged: boolean;
};
