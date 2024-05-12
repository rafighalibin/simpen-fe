export type ReadJadwalZoom = {
  id: string;
  platformId: string;
  nama: string;
  hostKey: string;
  link: string;
  namaPengajar: string;
  waktu: number[];
};

export type ReadJadwalRuangan = {
  id: string;
  platformId: string;
  nama: string;
  cabang: string;
  kapasitas: number;
  namaPengajar: string;
  waktu: number[];
};

export type ZoomSelect = {
  value: string;
  label: string;
};

export type RuanganSelect = {
  value: string;
  label: string;
};

export type ReadZoom = {
  id: string;
  nama: string;
  hostKey: string;
  link: string;
};

export type ReadRuangan = {
  id: string;
  nama: string;
  cabang: string;
  kapasitas: number;
};

export type ReadDetailZoom = {
  nama: string;
  hostKey: string;
  link: string;
  jadwalPemakaian: ReadJadwalZoom[];
};

export type ReadDetailRuangan = {
  nama: string;
  cabang: string;
  kapasitas: number;
  jadwalPemakaian: ReadJadwalRuangan[];
};

export type ScheduleZoom = {
  title: string;
  start: Date;
  end: Date;
  desc: string;
}

export type ScheduleRuangan = {
  title: string;
  start: Date;
  end: Date;
  desc: string;
}

export type PlatformSchedule = {
  id: string;
  title: string;
  start: number[];
  end: number[];
  desc: string;
};