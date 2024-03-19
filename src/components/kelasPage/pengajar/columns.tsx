// src/components/KelasTable/columns.ts
import { ColumnDef, RowData } from "@tanstack/react-table";

import { KelasRead } from "../../../common/types/kelas";

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
    accessorKey: "tanggalSelesai",
    header: "Tanggal Selesai",
    meta: { filter: false },
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
            <button
              className={`bg-transparent hover:bg-accent text-accent  hover:text-white py-1 px-4 border border-accent hover:border-transparent rounded-full`}
            >
              <a href={`/kelas/${row.original.id.toString()}/absen`}>Absen</a>
            </button>
          )}
          <button
            className={`bg-transparent hover:bg-primary text-primary  hover:text-white py-1 px-4 border border-primary hover:border-transparent rounded-full`}
          >
            <a href={`/kelas/${row.original.id.toString()}`}>Detail</a>
          </button>
        </div>
      </div>
    ),
  },
];
