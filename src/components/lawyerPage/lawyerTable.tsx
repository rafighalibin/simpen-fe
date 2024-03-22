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
import Link from "next/link";

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
    <div className="flex justify-center py-10">
      <div className="overflow-x-auto border-1 border-base-300 rounded-lg  shadow-md ">
        <table className="table ">
          <thead>
            <tr className="bg-base-200 border-1 border-base-300">
              <th className="px-6 table-cell text-neutral font-medium">NO</th>
              <th className="pr-20 table-cell text-neutral font-medium">
                DOMISILI KOTA
              </th>
              <th className="pr-20 table-cell text-neutral font-medium">
                EMAIL PRIBADI
              </th>
              <th className="pr-20 table-cell text-neutral font-medium">
                EMAIL KALANANTI
              </th>
              <th className="pr-20 table-cell text-neutral font-medium">
                PHONE NUMBER
              </th>
              <th className="pr-20 table-cell text-neutral font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {lawyers?.map((lawyer, index) => (
              <tr key={index} className="table-row border-1 border-base-300">
                <td className="px-6 table-cell">{index + 1}</td>
                <td className="pr-20 table-cell">{lawyer.domisili_kota}</td>
                <td className="pr-20 table-cell">{lawyer.email_pribadi}</td>
                <td className="pr-20 table-cell">{lawyer.email_kalananti}</td>
                <td className="pr-20 table-cell">{lawyer.backup_phone_num}</td>
                <td className="pr-20 table-cell">
                  <Link href={`/lawyer/${index}`}>
                    <button className="rounded-full btn btn-outline  btn-primary shadow-md">
                      Detail
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
