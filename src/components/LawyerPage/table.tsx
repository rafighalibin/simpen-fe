import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useState } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { json } from "stream/consumers";
import { Lawyer } from "../../common/types/lawyer";

// example
export const LawyerTable = () => {
  const fetchWithToken = useFetchWithToken();

  const { isLoading, error, data } = useQuery({
    queryKey: ["lawyers"],
    queryFn: () => fetchWithToken("/lawyer").then((res) => res.json()),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const lawyers: Lawyer[] = data.content;

  return (
    <table className="table table-bordered table-hover">
      <thead>
        <tr className="bg-primary">
          <th className="table-cell text-white">Nama</th>
          <th className="table-cell text-white">Domisili Kota</th>
          <th className="table-cell text-white">Email Pribadi</th>
          <th className="table-cell text-white">Email Kalananti</th>
          <th className="table-cell text-white">Backup Phone Number</th>
        </tr>
      </thead>
      <tbody>
        {lawyers?.map((lawyer, index) => (
          <tr key={index} className="table-row">
            <td className="table-cell">{lawyer.nama}</td>
            <td className="table-cell">{lawyer.domisili_kota}</td>
            <td className="table-cell">{lawyer.email_pribadi}</td>
            <td className="table-cell">{lawyer.email_kalananti}</td>
            <td className="table-cell">{lawyer.backup_phone_num}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
