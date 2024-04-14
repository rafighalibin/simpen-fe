import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Filter, fuzzyFilter } from "../../../../common/utils/table/filter";
import { DebouncedInput } from "../../../../common/utils/table/debounceInput";
import styles from "../PerubahanKelasTable.module.css"; // Assuming the same CSS module is applicable

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(
    Math.ceil(data.length / pagination.pageSize)
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    state: {
      pagination,
      globalFilter,
      columnFilters,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  // Function to render pagination buttons
  const renderPageNumbers = () => {
    let pageNumbers = [];
    for (let i = 0; i <= totalPages - 1; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => table.setPageIndex(i)} // Adjust for 0-based index
          className={`${styles.paginatioan_tx} px-3 py-1 mx-1 ${
            pagination.pageIndex === i
              ? "bg-[#215E9B] text-white"
              : "bg-[#FFFFFF] border border-[#DFE4EA] text-[#637381] hover:bg-[#A8D4FF] hover:text-white"
          } rounded`}
        >
          {i + 1}
        </button>
      );
    }
    return pageNumbers;
  };

  // Update pagination when data changes
  useEffect(() => {
    if (table.getFilteredRowModel().rows.length) {
      setTotalPages(
        Math.ceil(table.getFilteredRowModel().rows.length / pagination.pageSize)
      );
    }
  }, [getFilteredRowModel()]);

  return (
    <div>
      <div className="flex items-center mb-6 w-full space-x-2">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="flex-grow px-2 py-2 border border-[#DFE4EA] text-[#637381] rounded"
          placeholder="Search Permintaan..."
        />
        {table.getHeaderGroups().map((headerGroup) => (
          <div key={headerGroup.id} className="flex row-span-2">
            {headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className={` ${
                  header.index === 0
                    ? "rounded-tl-lg"
                    : header.index + 1 === headerGroup.headers.length
                    ? "rounded-tr-lg"
                    : ""
                }`}
              >
                {header.column.getCanFilter() ? (
                  <div>
                    <Filter column={header.column} table={table} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="shadow-lg rounded-lg ">
        <table data-testid="" className="table-auto w-full">
          <thead className="bg-baseForeground rounded-t-lg">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-6 py-6 text-left bg-baseForeground ${
                      header.index === 0
                        ? "rounded-tl-lg"
                        : header.index + 1 === headerGroup.headers.length
                        ? "rounded-tr-lg"
                        : ""
                    }`}
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " ▲",
                        desc: " ▼",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={styles.table_items_text}>
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center bg-gray-100 py-4"
                >
                  No data found
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b-2">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-6 whitespace-nowrap ">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center my-4">
        <div className={`${styles.pagination_container} p-2`}>
          {
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className={`px-3 py-1 mx-1 bg-white border border-[#DFE4EA] text-[#637381] rounded ${
                table.getCanPreviousPage()
                  ? "hover:bg-[#A8D4FF]"
                  : "hover:bg-[#DFE4EA]"
              } hover:text-white`}
            >
              {"<"}
            </button>
          }
          {renderPageNumbers()}
          {
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`px-3 py-1 mx-1 bg-white border border-[#DFE4EA] text-[#637381] rounded ${
                table.getCanNextPage()
                  ? "hover:bg-[#A8D4FF]"
                  : "hover:bg-[#DFE4EA]"
              } hover:text-white`}
            >
              {">"}
            </button>
          }
        </div>
      </div>
    </div>
  );
}
