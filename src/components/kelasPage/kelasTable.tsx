import React from "react";
import { useQuery } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { KelasRead } from "../../common/types/kelas";
import Loading from "../../common/components/Loading";

export const KelasTable = () => {
  const fetchWithToken = useFetchWithToken();

  const { isLoading, error, data } = useQuery({
    queryKey: ["kelas"],
    queryFn: () => fetchWithToken("/kelas").then((res) => res.json()),
  });

  if (isLoading) {
    return <Loading />;
  }
  const listKelas: KelasRead[] = data.content;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kode Kelas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pengajar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jumlah Murid
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {listKelas?.map((kelas) => (
            <tr key={kelas.id}>
              <td className="px-6 py-4 whitespace-nowrap">{kelas.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{kelas.pengajar}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {kelas.jumlah_murid}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{kelas.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a
                  href={`/kelas/${kelas.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Detail
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
