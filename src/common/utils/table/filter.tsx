import { Column, FilterFn, Table } from "@tanstack/react-table";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { DebouncedInput } from "./debounceInput";
import { useMemo } from "react";

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  // Sort unique values for text-type filters
  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  if (column.columnDef.meta?.filter === false) {
    return null;
  }

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      {/* Number range inputs for numeric columns */}
      <DebouncedInput
        type="number"
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder={`Min (${column.getFacetedMinMaxValues()?.[0] ?? ""})`}
        className="flex-grow px-2 mx-1 py-2 border border-[#DFE4EA] text-[#637381] rounded"
      />
      <DebouncedInput
        type="number"
        min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
        max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder={`Max (${column.getFacetedMinMaxValues()?.[1] ?? ""})`}
        className="flex-grow px-2 mx-1 py-2 border border-[#DFE4EA] text-[#637381] rounded"
      />
    </div>
  ) : (
    <>
      {/* Text input with a datalist for string-type filters */}
      <div className="relative">
        <DebouncedInput
          type={"text"}
          value={(columnFilterValue ?? "") as string}
          onChange={(value) => column.setFilterValue(value)}
          placeholder={`${column.columnDef.header}`}
          className="flex-grow px-2 mx-1 py-2 border border-[#DFE4EA] text-[#637381] rounded"
          list={column.id + "list"}
        />
        {sortedUniqueValues.length > 0 && (
          <datalist id={column.id + "list"}>
            {sortedUniqueValues.slice(0, 5000).map((value: any) => (
              <option value={value} key={value} />
            ))}
          </datalist>
        )}
      </div>
    </>
  );
}
