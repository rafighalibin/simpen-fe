import React, { useEffect, useState } from "react";
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
import { Filter, fuzzyFilter } from "../../common/utils/table/filter";
import { DebouncedInput } from "../../common/utils/table/debounceInput";
import styles from "./PayrollTable.module.css"; // Assuming the same CSS module is applicable
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enablePagination?: boolean; // Optional prop for enabling pagination
  enableFilters?: boolean; // Optional prop for enabling filters
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enablePagination = false,
  enableFilters = true,
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
    onPaginationChange: enablePagination ? setPagination : undefined,
    onGlobalFilterChange: enableFilters ? setGlobalFilter : undefined,
    onColumnFiltersChange: enableFilters ? setColumnFilters : undefined,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
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

  useEffect(() => {
    // Update totalPages only when data is available and not undefined
    if (data) {
      setTotalPages(Math.ceil(data.length / pagination.pageSize));
    }
  }, [data, pagination.pageSize]);

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

  return (
    <div>

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

      {enablePagination && (
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
      )}
    </div>
  );
}
