import { ColumnDef, RowData } from "@tanstack/react-table";
import { ReadFee } from "../../common/types/fee";
import Link from "next/link";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filter: boolean;
  }
}

export const columns: ColumnDef<ReadFee>[] = [
{
    accessorFn: (row: ReadFee) => row.jenisKelas.nama,
    header: "Jenis Kelas",
},
  {
    accessorFn: (row: ReadFee) => row.jenisKelas.pertemuan,
    header: "Mode Pertemuan",
  },
  {
    accessorFn: (row: ReadFee) => row.jenisKelas.tipe,
    header: "Tipe",
  },
  {
    accessorFn: (row: ReadFee) => row.jenisKelas.bahasa,
    header: "Bahasa",
  },
  {
    accessorKey: "baseFee",
    header: "Fee Dasar",
    cell: ({ row }) =>
      row.original.baseFee.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
  },
  {
    accessorKey: "lastUpdated",
    header: "Terakhir Diubah",
    cell: ({ row }) =>
      new Date(row.original.lastUpdated).toLocaleDateString("en-GB"),
  },
  {
    header: "",
    id: "actions", // It's a good practice to provide a unique id for columns without an accessorKey
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div className="flex space-x-4">
          <Link href={`/payroll/${row.original.id.toString()}`}>
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
