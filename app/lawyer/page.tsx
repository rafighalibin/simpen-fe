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
  alamat_ktp: string;
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
      }).then((res) => res.json()),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const lawyers: Lawyer[] = data.content;

  return (
    <ul>
      {lawyers?.map((user) => {
        return <li key={user.user_id}>{user.domisili_kota}</li>;
      })}
    </ul>
  );
}
