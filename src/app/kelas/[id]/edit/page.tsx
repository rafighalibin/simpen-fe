"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useFetchWithToken from "../../../../common/hooks/fetchWithToken";
import { Pengajar } from "../../../../common/types/pengajar";

const EditPage = () => {
  const fetchWithToken = useFetchWithToken();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [listPengajarExisting, setListPengajarExisting] = useState<Pengajar[]>(
    []
  );
  const [formState, setFormState] = useState({
    tanggalMulai: "",
    tanggalSelesai: "",
    pengajarId: "",
    linkGroup: "",
    listMurid: [],
    level: 0,
    platform: "",
  });

  const {
    isLoading: detailKelasLoading,
    error: detailKelasError,
    data: detailKelas,
  } = useQuery({
    queryKey: ["detailKelas"],
    queryFn: () => fetchWithToken(`/kelas/${id}`).then((res) => res.json()),
    onSuccess: (data) => {},
  });

  const {
    isLoading: listUserLoading,
    error: listUserError,
    data: listUser,
  } = useQuery({
    queryKey: ["listUser"],
    queryFn: () => fetchWithToken(`/user`).then((res) => res.json()),
    onSuccess: (data) => {},
  });

  useEffect(() => {
    if (listUser) {
      const listPengajarTemp: Pengajar[] = listUser.content[2].user.map(
        (user: any) => ({
          id: user.id, // Assuming 'id' is the field you want to map to 'user_id'
          nama: user.nama,
        })
      );
      listPengajarExisting.push(...listPengajarTemp);
      console.log(listPengajarExisting);
    }
  }, [listUser]);

  useEffect(() => {
    if (detailKelas) {
      setFormState((prev) => ({
        ...prev,
        tanggalMulai: new Date(detailKelas.content.tanggalMulai)
          .toISOString()
          .split("T")[0],
        tanggalSelesai: new Date(detailKelas.content.tanggalSelesai)
          .toISOString()
          .split("T")[0],
        pengajarId: detailKelas.content.pengajarId,
        linkGroup: detailKelas.content.linkGroup,
        listMurid: detailKelas.content.listMurid,
        level: detailKelas.content.level,
        platform: detailKelas.content.platform,
      }));
    }
  }, [detailKelas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  if (detailKelasLoading || listUserLoading) {
    return <p>Loading...</p>;
  }

  return (
    <form
      onSubmit={async (e) => {}}
      className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg"
    >
      <h1 className="text-2xl font-bold mb-4">Edit Class ID: {id}</h1>
      <div className="mb-4">
        <label className="block font-medium">Start Date:</label>
        <input
          type="date"
          name="tanggalMulai"
          value={formState.tanggalMulai}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">End Date:</label>
        <input
          type="date"
          name="tanggalSelesai"
          value={formState.tanggalSelesai}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="pengajarId" className="block font-medium">
          Teacher
        </label>
        <select
          name="pengajarId"
          id="pengajarId"
          value={formState.pengajarId}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        >
          {/* Option for not selecting any teacher */}
          <option value="">Select a Teacher</option>

          {/* Dynamically creating options for each teacher */}

          {listPengajarExisting.map((pengajar) => (
            <option key={pengajar.id} value={pengajar.id}>
              {pengajar.nama}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Group Link:</label>
        <input
          type="text"
          name="linkGroup"
          value={formState.linkGroup}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Students (comma-separated):</label>
        <input
          type="text"
          name="listMurid"
          value={formState.listMurid}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Level:</label>
        <input
          type="number"
          name="level"
          value={formState.level}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Platform:</label>
        <input
          type="text"
          name="platform"
          value={formState.platform}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
      >
        Save Changes
      </button>
    </form>
  );
};

export default EditPage;
