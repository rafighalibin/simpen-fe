"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useFetchWithToken from "../../../../common/hooks/fetchWithToken";
import { PengajarSelect } from "../../../../common/types/pengajar";
import React from "react";
import Select from "react-select";
import { MuridSelect } from "../../../../common/types/murid";

const EditPage = () => {
  const fetchWithToken = useFetchWithToken();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [listPengajarExisting, setListPengajarExisting] = useState<
    PengajarSelect[]
  >([]);
  const [listMuridExisting, setListMuridExisting] = useState<MuridSelect[]>([]);
  const [muridSelected, setMuridSelected] = useState<MuridSelect[]>([]);
  const [formState, setFormState] = useState({
    tanggalMulai: "",
    tanggalSelesai: "",
    pengajarId: "",
    linkGroup: "",
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
      const listPengajarTemp: PengajarSelect[] = listUser.content[2].user.map(
        (user: any) => ({
          value: user.id, // Assuming 'id' is the field you want to map to 'user_id'
          label: user.nama,
        })
      );
      listPengajarExisting.push(...listPengajarTemp);

      const listMuridExistingTemp: MuridSelect[] = [
        {
          value: "Student1",
          label: "Student1",
        },
        {
          value: "Student2",
          label: "Student2",
        },
        {
          value: "Student3",
          label: "Student3",
        },
        {
          value: "Student4",
          label: "Student4",
        },
      ];

      listMuridExisting.push(...listMuridExistingTemp);
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
        level: detailKelas.content.level,
        platform: detailKelas.content.platform,
      }));
      let count = 0;

      detailKelas.content.listMurid.forEach((e) => {
        muridSelected.push({
          value: e,
          label: e,
        });
      });
    }
  }, [detailKelas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePengajar = (e) => {
    const { value } = e;
    setFormState((prev) => ({ ...prev, pengajarId: value }));
  };

  const handleChangeMurid = (e) => {
    const { value } = e;
    setFormState((prev) => ({ ...prev, pengajarId: value }));
  };
  const handleSubmit = async (e) => {
    const payload = {
      tanggalMulai: formState.tanggalMulai,
      tanggalSelesai: formState.tanggalSelesai,
      pengajarId: formState.pengajarId,
      linkGroup: formState.linkGroup,
      level: formState.level,
      platform: formState.platform,
      listMurid: muridSelected.map((e) => e.value),
    };
    e.preventDefault();
    console.log(payload);
  };

  if (detailKelasLoading || listUserLoading) {
    return <p>Loading...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
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
        <Select
          defaultValue={{
            value: formState.pengajarId,
            label: "NAMA",
          }}
          onChange={handleChangePengajar}
          options={listPengajarExisting}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Group Link:</label>
        <input
          type="text"
          name="linkGroup"
          value={formState.linkGroup}
          onChange={handleChangeMurid}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Students (comma-separated):</label>
        <Select
          defaultValue={muridSelected}
          isMulti
          name="colors"
          options={listMuridExisting}
          className="basic-multi-select"
          classNamePrefix="select"
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
