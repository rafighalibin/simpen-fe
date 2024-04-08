import React from "react";
import { useQuery } from "react-query";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import Loading from "../../../common/components/Loading";
import { DataTable as DataTablePermintaanPerubahanOps } from "./operasional/permintaan-perubahan-data-table";
import { columns as ColumnsKelasOps } from "./operasional/columns";
import { DataTable as DataTablePermintaanPerubahanPengajar } from "./pengajar/permintaan-perubahan-data-table";
import { columns as ColumnsKelasPengajar } from "./pengajar/columns";
import { useAuthContext } from "../../../common/utils/authContext";
import { ReadPermintaanPerubahan } from "../../../common/types/permintaanPerubahan";

export const PerubahanKelasTable = () => {
  const fetchWithToken = useFetchWithToken();
  const { pengguna } = useAuthContext();

  const { isLoading, error, data } = useQuery({
    queryKey: ["permintaan-perubahan"],
    queryFn: () =>
      fetchWithToken("/permintaan-perubahan").then((res) => res.json()),
  });

  if (isLoading) {
    return <Loading />;
  }
  const listPermintaanPerubahan: ReadPermintaanPerubahan[] = data.content;

  if (
    pengguna.role === "operasional" ||
    pengguna.role === "akademik" ||
    pengguna.role === "superadmin"
  ) {
    return (
      <div className="flex flex-col space-y-8 my-10">
        <h1 className=" flex justify-start text-6xl font-bold text-neutral/100 ">
          Daftar Permintaan Perubahan Kelas
        </h1>
        <DataTablePermintaanPerubahanOps
          columns={ColumnsKelasOps}
          data={listPermintaanPerubahan}
        />
      </div>
    );
  }

  if (pengguna.role === "pengajar") {
    return (
      <div className="flex flex-col space-y-8 my-10">
        <h1 className=" flex justify-start text-6xl font-bold text-neutral/100 ">
          Daftar Kelas Pengajaran
        </h1>
        <DataTablePermintaanPerubahanPengajar
          columns={ColumnsKelasPengajar}
          data={listPermintaanPerubahan}
        />
      </div>
    );
  }
};
