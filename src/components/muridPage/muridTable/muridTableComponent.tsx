import React from "react";
import { useQuery } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { MuridRead } from "../../../common/types/murid";
import Loading from "../../../common/components/Loading";
import { DataTable as DataTableMurid } from "./murid-data-table";
import { columns as ColumnsMurid } from "./columns";
import { useAuthContext } from "../../../common/utils/authContext";

export const MuridTable = () => {
  const fetchWithToken = useFetchWithToken();
  const { pengguna } = useAuthContext();

  const { isLoading, error, data } = useQuery({
    queryKey: ["murid"],
    queryFn: () => fetchWithToken("/murid").then((res) => res.json()),
  });

  if (isLoading) {
    return <Loading />;
  }
  const listMurid: MuridRead[] = data.content;

  return (
    <div className="flex flex-col space-y-8 my-10">
      <h1 className=" flex justify-start text-6xl font-bold text-neutral/100 ">
        Daftar Murid
      </h1>
      <DataTableMurid columns={ColumnsMurid} data={listMurid} />
    </div>
  );
};
