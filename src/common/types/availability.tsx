export type Availability = {
  hari: string;
  waktu: number;
};

export type UpdateAvailability = {
  waktu: string;
};

export type FilterAvailability = {
  hari: string;
  waktuStart: string;
  waktuEnd: string;
};
