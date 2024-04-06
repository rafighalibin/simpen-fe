// src/components/KelasTable/columns.ts
import { ColumnDef, RowData } from "@tanstack/react-table";

import Link from "next/link";
import { ReadPermintaanPerubahan } from "../../../../common/types/permintaanPerubahan";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filter: boolean;
  }
}

export const columns: ColumnDef<ReadPermintaanPerubahan>[] = [
  {
    accessorKey: "kelasId",
    header: "Kelas",
    meta: {
      filter: false,
    },
  },
  {
    accessorKey: "tipePermintaan",
    header: "Tipe Permintaan",
    meta: {
      filter: false,
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "waktuPermintaan",
    header: "Waktu Permintaan",
    cell: ({ row }) =>
      new Date(row.original.waktuPermintaan).toLocaleDateString(),
    meta: {
      filter: false,
    },
  },
  {
    header: "",
    id: "actions", // It's a good practice to provide a unique id for columns without an accessorKey
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div className="flex space-x-4">
          <Link href={`/kelas/${row.original.kelasId.toString()}`}>
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
