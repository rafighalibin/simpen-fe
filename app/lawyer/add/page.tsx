"use client";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "react-query";
import { useState } from "react";
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
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await addLawyerMutation();
        }}
      >
        <input
          type="text"
          value={alamat_ktp}
          onChange={(e) => setAlamatKtp(e.target.value)}
          placeholder="Alamat KTP"
        />
        <input
          type="text"
          value={domisili_kota}
          onChange={(e) => setDomisiliKota(e.target.value)}
          placeholder="Domisili Kota"
        />
        <input
          type="text"
          value={email_pribadi}
          onChange={(e) => setEmailPribadi(e.target.value)}
          placeholder="Email Pribadi"
        />
        <input
          type="text"
          value={email_kalananti}
          onChange={(e) => setEmailKalananti(e.target.value)}
          placeholder="Email Kalananti"
        />
        <input
          type="text"
          value={backup_phone_num}
          onChange={(e) => setBackupPhoneNum(e.target.value)}
          placeholder="Backup Phone Number"
        />
        <button type="submit">Add Lawyer</button>
      </form>
    </div>
  );
}
