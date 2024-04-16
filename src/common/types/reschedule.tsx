import { SesiRead } from "./sesi";

export type ReadReschedule = {
  id: string;
  waktuAwal: string;
  waktuBaru: string;
  alasan: string;
  status: string;
  waktuPermintaan: string;
};
export type ReadRescheduleSesi = {
  sesiKelas: SesiRead;
  activeReschedule: ReadReschedule;
  activeRescheduleDate: string;
  activeRescheduleTime: string;
  listReschedule: ReadReschedule[];
};

export type CreateRescheduleForm = {
  id?: string;
  zoomId?: string;
  sesiKelasId: string;
  tanggalBaru: string;
  waktuBaru: string;
  alasan: string;
  ischanged: boolean;
};

export type CreateReschedulePayload = {
  id?: string;
  zoomId?: string;
  waktuBaru?: string;
  sesiKelasId: string;
  alasan: string;
};

const getLatestRescheduleDate = (reschedule: ReadReschedule) => {
  return new Date(reschedule.waktuBaru).getDate();
};
