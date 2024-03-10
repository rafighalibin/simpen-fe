export interface Lawyers {
  Lawyer: Lawyer[];
}

export type Lawyer = {
  user_id: number;
  nama: string;
  domisili_kota: string;
  email_pribadi: string;
  email_kalananti: string;
  backup_phone_num: string;
};

export type Author = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};
