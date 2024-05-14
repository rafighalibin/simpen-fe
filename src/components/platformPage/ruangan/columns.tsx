import { ColumnDef, RowData } from "@tanstack/react-table";
import { ReadRuangan } from "../../../common/types/platform";
import Link from "next/link";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filter: boolean;
  }
}

export const columns: ColumnDef<ReadRuangan>[] = [
{
    accessorFn: (row: ReadRuangan) => row.nama,
    header: "Nama",

},
  {
    accessorFn: (row: ReadRuangan) => row.cabang,
    header: "Cabang",
  },
  {
    accessorFn: (row: ReadRuangan) => row.kapasitas.toString(),
    header: "Kapasitas",
  },
  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div className="flex space-x-4">
          <Link href={`/platform/ruangan/${row.original.id.toString()}`}>
            <button
              className={`bg-transparent hover:bg-primary text-primary  hover:text-white py-1 px-4 border border-primary hover:border-transparent rounded-full`}
            >
              Detail
            </button>
          </Link>
        </div>
      </div>
    ),
  }
];
