"use client";

import { useParams } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useState } from "react";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { json } from "stream/consumers";

const Page = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const { isLoading, error, data } = useQuery({
    queryKey: ["kelasDetail"],
    queryFn: () => fetchWithToken(`/kelas/${id}`).then((res) => res.json()),
  });

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/${id}`, "DELETE").then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data);
      // Here, you might want to redirect or refetch data
    },
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      await deleteMutation();
      // Redirect or handle post-delete logic here
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error fetching class details.</div>;
  }

  const {
    programName,
    jenisKelasName,
    listSesi,
    tanggalMulai,
    tanggalSelesai,
    pengajarId,
    linkGroup,
    listMurid,
    level,
    platform,
  } = data.content;

  // Function to convert timestamps to readable dates
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US");
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}
      >
        Delete Class
      </button>
      <h1>ID: {id}</h1>
      <h2>
        {programName} - {jenisKelasName}
      </h2>
      <div>Start Date: {formatDate(tanggalMulai)}</div>
      <div>End Date: {formatDate(tanggalSelesai)}</div>
      <div>Teacher ID: {pengajarId}</div>
      <div>
        Group Link: <a href={linkGroup}>{linkGroup}</a>
      </div>
      <div>Level: {level}</div>
      <div>Platform: {platform}</div>
      <div>
        <h3>Students:</h3>
        <ul>
          {listMurid.map((murid, index) => (
            <li key={index}>{murid}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
