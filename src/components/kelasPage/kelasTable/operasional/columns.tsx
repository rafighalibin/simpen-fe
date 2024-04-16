// src/components/KelasTable/columns.ts
import { ColumnDef, RowData } from "@tanstack/react-table";

import { KelasRead } from "../../../../common/types/kelas";
import Link from "next/link";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filter: boolean;
  }
}

export const columns: ColumnDef<KelasRead>[] = [
  {
    accessorKey: "id",
    header: "Kode Kelas",
    meta: {
      filter: false,
    },
  },
  {
    accessorKey: "programName",
    header: "Program",
  },
  {
    accessorKey: "jenisKelasName",
    header: "Jenis Kelas",
  },
  {
    accessorKey: "pengajar",
    header: "Pengajar",
  },
  {
    accessorKey: "tanggalMulai",
    header: "Tanggal Mulai",
    accessorFn: (row) => new Date(row.tanggalMulai).toLocaleDateString("en-GB"),
    cell: ({ row }) =>
      new Date(row.original.tanggalMulai).toLocaleDateString("en-GB"),
  },
  {
    accessorKey: "tanggalSelesai",
    header: "Tanggal Selesai",
    accessorFn: (row) =>
      new Date(row.tanggalSelesai).toLocaleDateString("en-GB"),
    cell: ({ row }) =>
      new Date(row.original.tanggalSelesai).toLocaleDateString("en-GB"),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    header: "",
    id: "actions", // It's a good practice to provide a unique id for columns without an accessorKey
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div className="flex space-x-4">
          {row.original.status != "Canceled" && (
            <Link href={`/kelas/${row.original.id.toString()}/absen`}>
              <button
                className={`bg-transparent hover:bg-accent text-accent  hover:text-white py-1 px-4 border border-accent hover:border-transparent rounded-full`}
              >
                Absen
              </button>
            </Link>
          )}
          <Link href={`/kelas/${row.original.id.toString()}`}>
            <button
              className={`bg-transparent hover:bg-primary text-primary  hover:text-white py-1 px-4 border border-primary hover:border-transparent rounded-full`}
            >
              Detail
            </button>
          </Link>
        </div>
      </div>
    ),
  },
];
