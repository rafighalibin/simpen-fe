import React from "react";
import { useQuery } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import Loading from "../../common/components/Loading";
import { DataTable as PayrollDataTable } from "./payroll-data-table";
import { columns as ColumnsPayroll } from "./columns";
// import { columns as ColumnsMurid } from "./columns";
import { ReadFeeGrouped } from "../../common/types/fee";
import { useAuthContext } from "../../common/utils/authContext";
import Link from "next/link";


export const PayrollTable = () => {
  const fetchWithToken = useFetchWithToken();
  const { pengguna } = useAuthContext();

  const { isLoading, error, data } = useQuery({
    queryKey: ["fee"],
    queryFn: () => fetchWithToken("/payroll/fee/grouped").then((res) => res.json()),
  });

  if (isLoading) {
    return <Loading />;
  }
  const listFeeGrouped: ReadFeeGrouped[] = data.content;

  if (
    pengguna.role === "pengajar" ||
    pengguna.role === "akademik"
  ) {
    return (
      <div className="flex flex-col space-y-8 my-10">
      <h1 className="flex justify-start text-6xl font-bold text-neutral/100">
        Daftar Fee
      </h1>
      {listFeeGrouped.map((group, index) => (
        <div key={index}>
          <h2 className="text-4xl font-bold mb-2">{group.program.nama}</h2>
          <PayrollDataTable data={group.listFee} columns={ColumnsPayroll} />
        </div>
      ))}
    </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 my-10">
      <h1 className="flex justify-start text-6xl font-bold text-neutral/100">
        Daftar Fee
      </h1>
      <Link href="/payroll/add">
            <button
              className={`px-4 py-2 bg-primary/80 hover:bg-primary text-white rounded`}
            >
              + Tambah Fee
            </button>
          </Link>
      {listFeeGrouped.map((group, index) => (
        <div key={index}>
          <h2 className="text-4xl font-bold mb-2">{group.program.nama}</h2>
          <PayrollDataTable data={group.listFee} columns={ColumnsPayroll} />
        </div>
      ))}
    </div>
  );
};
