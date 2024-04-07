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
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import Loading from "../../common/components/Loading";

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
  // const [searchKeyword, setSearchKeyword] = useState("");
  const [showDuplicateTagAlert, setShowDuplicateTagAlert] = useState(false);
  // const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const payload = {
    nama,
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["tags"],
    queryFn: () =>
      fetchWithToken(`/tag`).then(
        (res) => res.json()
      ),
  });

  const { mutateAsync: addTagMutation, data: Tag, isSuccess } = useMutation({
    mutationFn: () =>
      fetchWithToken("/tag", "POST", payload).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data.content as Tag);
      if (data.error === "DuplicateTag") {
        setShowDuplicateTagAlert(true);
      }
      queryClient.invalidateQueries("tags");
    },
  });

  const handleAddTag = async () => {
    const existingTag = data.content.find(
      (tag: Tag) => tag.nama.toLowerCase() === nama.toLowerCase()
    );
    if (existingTag) {
      setShowDuplicateTagAlert(true); // Hide success alert when duplicate tag alert is shown
    } else {
      await addTagMutation();
    }
  };

  if (isLoading) {
    return  <Loading />;;
  }

  if (isSuccess){
    localStorage.setItem("tagSuccess", "true");
    redirect(`/tag`);
  }

  return (
    <div className=" flex flex-col" style={{ minHeight: "81vh" }}>
      <div className="px-20 py-20 space-y-10 flex-grow flex flex-col justify-center">
        {/* Duplicate Tag Alert */}
        {showDuplicateTagAlert && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Duplicate Tag!</strong>
            <span className="block sm:inline">
              {" "}
              Tag with the same name already exists.
            </span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setShowDuplicateTagAlert(false)}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path
                  fillRule="evenodd"
                  d="M14.348 5.652a.5.5 0 0 1 0 .707l-8 8a.5.5 0 1 1-.707-.707l8-8a.5.5 0 0 1 .707 0z"
                />
                <path
                  fillRule="evenodd"
                  d="M5.652 5.652a.5.5 0 0 0-.707 0l-8 8a.5.5 0 0 0 .707.707l8-8a.5.5 0 0 0 0-.707z"
                />
              </svg>
            </span>
          </div>
        )}

        <h1 className="text-5xl font-bold mb-6 text-center">Tambah Tag</h1>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleAddTag();
          }}
        >
          <div className=" flex flex-col space-y-16 bg-white p-6 rounded-lg shadow-md">
            <div>
            <label htmlFor="tagInput" className="block font-medium text-neutral/70">
              Nama Tag
            </label>
            <input
              required
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Tag"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
            />
            <p className="text-sm text-gray-500">
              Pastikan membuat tagging yang tidak ambigu dengan tag lainnya.
            </p>
            </div>
            
            <div className="w-full flex justify-center pb-8">
              <input
                type="submit"
                value="Tambah Tag"
                className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover"
              />
            </div>
          </div>
        </form>

        
      </div>
    </div>
  );
};
