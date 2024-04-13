export type PeriodePayroll = {
    id: string;
    bulan: string;
    tahun: number;
    tanggalMulai: string;
    tanggalSelesai: string;
  };
  
  export type PeriodePayrollSelect = {
    value: string;
    label: string;
  };
  
  export type PeriodePayrollDetail = {
    id: string;
    nama: string;
    // Add more fields if needed
  };