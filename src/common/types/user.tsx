export type Notification = {
  id: string;
  judul: string;
  isi: {
    [key: string]: string;
  };
  expirationDate: string;
  isOpened: boolean;
  isHidden: boolean;
  isDeleted: boolean;
  tipe: number;
  tanggalPembuatan: Date;
};

export type User = {
  id: string;
  nama: string;
  email: string;
  emailPribadi: string;
  password: string;
  jenisKelamin: string;
  noTelp: string;
  isDeleted: boolean;
  role: string;
  lastLogin: string;
  isInactive: boolean;
  notifikasi: Notification[];
};
