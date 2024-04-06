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
  sesiKelasId: string;
  alasan: string;
  ischanged: boolean;
};

export type CreateGantiPengajarPayload = {
  sesiKelasId: string;
  alasan: string;
};
