import { SesiRead } from "./sesi";

export type ReadGantiPengajar = {
  id: string;
  namaPengajarPenggati: string;
  idPengajarPengganti: string;
  alasan: string;
  status: string;
  waktuPermintaan: string;
};
export type ReadGantiPengajarSesi = {
  sesiKelas: SesiRead;
  activeGantiPengajar: ReadGantiPengajar;
  activeGantiPengajarNamaPengajar: string;
  activeGantiPengajarIdPengajar: string;
  listGantiPengajar: ReadGantiPengajar[];
};

export type CreateGantiPengajarForm = {
  id?: string;
  sesiKelasId: string;
  alasan: string;
  ischanged: boolean;
  pengajarPenggantiId?: string;
};

export type CreateGantiPengajarPayload = {
  id?: string;
  sesiKelasId: string;
  pengajarPenggantiId?: string;
  alasan: string;
};
