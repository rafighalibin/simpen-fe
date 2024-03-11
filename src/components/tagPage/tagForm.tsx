"use client";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "react-query";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useFetchWithToken from "../../hooks/fetchWithToken";

interface Tag {
  id: number;
  nama: string;
  jumlahPengajar: number;
}

export const TagForm = () => {
  const queryClient = useQueryClient();
  const fetchWithToken = useFetchWithToken();
  const [nama, setNama] = useState("");
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showDuplicateTagAlert, setShowDuplicateTagAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const payload = {
    nama,
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["tags"],
    queryFn: () =>
      fetchWithToken(`/tag?nama=${encodeURIComponent(searchKeyword)}`).then(
        (res) => res.json()
      ),
  });

  const { mutateAsync: addTagMutation, data: Tag } = useMutation({
    mutationFn: () =>
      fetchWithToken("/tag", "POST", payload).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data.content as Tag);
      if (data.error === "DuplicateTag") {
        setShowDuplicateTagAlert(true);
        setShowSuccessAlert(false); // Hide success alert when duplicate tag alert is shown
      } else {
        setShowSuccessAlert(true);
        setShowDuplicateTagAlert(false); // Hide duplicate tag alert when success alert is shown
        queryClient.invalidateQueries("tags");
      }
    },
  });

  const handleAddTag = async () => {
    const existingTag = data.content.find(
      (tag: Tag) => tag.nama.toLowerCase() === nama.toLowerCase()
    );
    if (existingTag) {
      setShowDuplicateTagAlert(true);
      setShowSuccessAlert(false); // Hide success alert when duplicate tag alert is shown
    } else {
      await addTagMutation();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const filteredTags: Tag[] = data.content.filter((tag: Tag) =>
  tag.nama.toLowerCase().includes(searchKeyword.toLowerCase())
);

  return (
    <div className="max-w-md mx-auto mt-8">
      {/* Duplicate Tag Alert */}
      {showDuplicateTagAlert && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Duplicate Tag!</strong>
          <span className="block sm:inline"> Tag with the same name already exists.</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setShowDuplicateTagAlert(false)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path fillRule="evenodd" d="M14.348 5.652a.5.5 0 0 1 0 .707l-8 8a.5.5 0 1 1-.707-.707l8-8a.5.5 0 0 1 .707 0z"/>
              <path fillRule="evenodd" d="M5.652 5.652a.5.5 0 0 0-.707 0l-8 8a.5.5 0 0 0 .707.707l8-8a.5.5 0 0 0 0-.707z"/>
            </svg>
          </span>
        </div>
      )}

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Tag successfully added.</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setShowSuccessAlert(false)}>
            <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path fillRule="evenodd" d="M14.348 5.652a.5.5 0 0 1 0 .707l-8 8a.5.5 0 1 1-.707-.707l8-8a.5.5 0 0 1 .707 0z"/>
              <path fillRule="evenodd" d="M5.652 5.652a.5.5 0 0 0-.707 0l-8 8a.5.5 0 0 0 .707.707l8-8a.5.5 0 0 0 0-.707z"/>
            </svg>
          </span>
        </div>
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await handleAddTag();
        }}
        className="space-y-6"
      >
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        />
        <input
          type="submit"
          value="Submit"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        />
      </form>

      <div className="mt-4">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Cari Nama Tag"
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
        />
        <button
          onClick={() => queryClient.invalidateQueries("tags")}
          className="block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm focus:outline-none focus:bg-blue-600"
        >
          Cari
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        {filteredTags.length === 0 ? (
          <div className="text-center">Belum ada tag atau tag tidak ditemukan.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Pengajar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTags.map((tag) => (
                <tr key={tag.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{tag.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tag.jumlahPengajar}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/tag/assign/${tag.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Assign
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
