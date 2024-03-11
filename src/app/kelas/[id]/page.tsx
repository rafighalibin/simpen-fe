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
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-2">ID: {id}</h1>
      <h2 className="text-lg mb-2">
        {programName} - {jenisKelasName}
      </h2>
      <div className="mb-2">Start Date: {formatDate(tanggalMulai)}</div>
      <div className="mb-2">End Date: {formatDate(tanggalSelesai)}</div>
      <div className="mb-2">Teacher ID: {pengajarId}</div>
      <div className="mb-2">
        Link Group Wa:{" "}
        <a href={linkGroup} className="text-blue-500">
          {linkGroup}
        </a>
      </div>
      <div className="mb-2">Level: {level}</div>
      <div className="mb-2">Platform: {platform}</div>
      <div className="mb-2">
        <h3 className="text-lg font-bold mb-1">Students:</h3>
        <ul>
          {listMurid.map((murid, index) => (
            <li key={index} className="ml-4">
              {murid}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end space-x-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">
          <a href={`/kelas/${id}/edit`}>Edit Class</a>
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
        >
          Delete Class
        </button>
      </div>
    </div>
  );
};

export default Page;
