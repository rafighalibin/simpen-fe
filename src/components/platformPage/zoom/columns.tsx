import { ColumnDef, RowData } from "@tanstack/react-table";
import { ReadZoom } from "../../../common/types/platform";
import Link from "next/link";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filter: boolean;
  }
}

export const columns: ColumnDef<ReadZoom>[] = [
{
    accessorFn: (row: ReadZoom) => row.nama,
    header: "Nama",

},
  {
    accessorFn: (row: ReadZoom) => row.hostKey,
    header: "Host Key",
  },
  {
    accessorFn: (row: ReadZoom) => row.link,
    header: "Link",
  },
  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <div className="flex space-x-4">
          <Link href={`/platform/zoom/${row.original.id.toString()}`}>
            <button
              className={`bg-transparent hover:bg-primary text-primary  hover:text-white py-1 px-4 border border-primary hover:border-transparent rounded-full`}
            >
              Detail
            </button>
          </Link>
          <Link href={`${row.original.link}`}>
          <button
              className={`bg-transparent hover:bg-secondary text-secondary  hover:text-white py-1 px-4 border border-secondary hover:border-transparent rounded-full`}
            >
              Join Zoom
            </button>
          </Link>
        </div>
      </div>
    ),
  }
];
