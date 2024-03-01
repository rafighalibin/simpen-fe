"use client";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "react-query";
import { useState } from "react";

interface Lawyer {
  user_id: number;
  alamat_ktp: string;
  domisili_kota: string;
  email_pribadi: string;
  email_kalananti: string;
  backup_phone_num: string;
}

export default function Page() {
  const [alamat_ktp, setAlamatKtp] = useState("");
  const [domisili_kota, setDomisiliKota] = useState("");
  const [email_pribadi, setEmailPribadi] = useState("");
  const [email_kalananti, setEmailKalananti] = useState("");
  const [backup_phone_num, setBackupPhoneNum] = useState("");

  const { mutateAsync: addLawyerMutation, data } = useMutation({
    mutationFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/lawyer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: document.cookie
            .split("; ")
            .find((row) => row.startsWith("Authorization="))
            ?.split("=")[1],
        },
        body: JSON.stringify({
          alamat_ktp,
          domisili_kota,
          email_pribadi,
          email_kalananti,
          backup_phone_num,
        }),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data.content as Lawyer);
    },
  });

  return (
    <div className="max-w-md mx-auto mt-8">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await addLawyerMutation();
        }}
        className="space-y-6"
      >
        <input
          type="text"
          value={alamat_ktp}
          onChange={(e) => setAlamatKtp(e.target.value)}
          placeholder="Alamat KTP"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        />
        <input
          type="text"
          value={domisili_kota}
          onChange={(e) => setDomisiliKota(e.target.value)}
          placeholder="Domisili Kota"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        />
        <input
          type="text"
          value={email_pribadi}
          onChange={(e) => setEmailPribadi(e.target.value)}
          placeholder="Email Pribadi"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        />
        <input
          type="text"
          value={email_kalananti}
          onChange={(e) => setEmailKalananti(e.target.value)}
          placeholder="Email Kalananti"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        />
        <input
          type="text"
          value={backup_phone_num}
          onChange={(e) => setBackupPhoneNum(e.target.value)}
          placeholder="Backup Phone Number"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Lawyer
        </button>
      </form>
    </div>
  );
}
