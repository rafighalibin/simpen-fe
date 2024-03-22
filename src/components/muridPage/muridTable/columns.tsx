import { ColumnDef, RowData } from "@tanstack/react-table";

import { MuridRead } from "../../../common/types/murid";
import Link from "next/link";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filter: boolean;
  }
}

export const columns: ColumnDef<MuridRead>[] = [
  {
    accessorKey: "no",
    header: "No",
    meta: {
      filter: false,
    },
    enableSorting: false,
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "nama",
    header: "Nama Murid",
  },
  {
    accessorKey: "namaOrtu",
    header: "Nama Orang Tua",
  },
  {
    accessorKey: "emailOrtu",
    header: "Email Orang Tua",
  },
  {
    accessorKey: "noHpOrtu",
    header: "HP Orang Tua",
  },
  {
    header: "",
    id: "actions", // It's a good practice to provide a unique id for columns without an accessorKey
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div className="flex space-x-4">
          <Link href={`/murid/${row.original.id.toString()}`}>
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
