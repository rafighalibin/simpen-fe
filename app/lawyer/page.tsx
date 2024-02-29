"use client";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import React from "react";
import { request } from "http";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  );
}

interface Lawyer {
  user_id: number;
  nama: string;
  domisili_kota: string;
  email_pribadi: string;
  email_kalananti: string;
  backup_phone_num: string;
}

function Page() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["lawyers"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/lawyer`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: document.cookie
            .split("; ")
            .find((row) => row.startsWith("Authorization="))
            ?.split("=")[1],
        },
      }).then((res) => res.json()),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(data);
  const lawyers: Lawyer[] = data.content;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Domisili Kota
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email Pribadi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email Kalananti
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Backup Phone Number
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lawyers?.map((lawyer) => (
            <tr key={lawyer.user_id}>
              <td className="px-6 py-4 whitespace-nowrap">{lawyer.nama}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {lawyer.domisili_kota}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {lawyer.email_pribadi}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {lawyer.email_kalananti}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {lawyer.backup_phone_num}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
