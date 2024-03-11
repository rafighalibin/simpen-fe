"use client";
import { useState, useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { PengajarSelect } from "../../common/types/pengajar";
import React from "react";
import Select from "react-select";
import { MuridSelect } from "../../common/types/murid";
import useFetchPengajar from "../../common/hooks/user/useFetchPengajar";
import CalendarIcon from "../../common/components/icons/CalendarIcon";

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

const UpdateForm = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const { isLoading: listUserLoading, listPengajarExisting } =
    useFetchPengajar();
  const [pengajarSelected, setPengajarSelected] =
    useState<PengajarSelect>(null);
  const [listMuridExisting, setListMuridExisting] = useState<MuridSelect[]>([]);
  const [muridSelected, setMuridSelected] = useState<MuridSelect[]>([]);
  const [formState, setFormState] = useState({
    programName: "",
    jenisKelasName: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    pengajarId: "",
    namaPengajar: "",
    linkGroup: "",
    level: 0,
    platform: "",
    listMurid: [],
  });

  const {
    isLoading: detailKelasLoading,
    error: detailKelasError,
    data: detailKelas,
  } = useQuery({
    queryKey: ["detailKelas"],
    queryFn: () => fetchWithToken(`/kelas/${id}`).then((res) => res.json()),
    onSuccess: (detailKelas) => {
      setFormState((prev) => ({
        ...prev,
        tanggalMulai: new Date(detailKelas.content.tanggalMulai)
          .toISOString()
          .split("T")[0],
        tanggalSelesai: new Date(detailKelas.content.tanggalSelesai)
          .toISOString()
          .split("T")[0],
        pengajarId: detailKelas.content.pengajarId,
        namaPengajar: detailKelas.content.namaPengajar,
        linkGroup: detailKelas.content.linkGroup,
        level: detailKelas.content.level,
        platform: detailKelas.content.platform,
        listMurid: detailKelas.content.listMurid,
        programName: detailKelas.content.programName,
        jenisKelasName: detailKelas.content.jenisKelasName,
      }));

      detailKelas.content.listMurid.forEach((e) => {
        muridSelected.push({
          value: e,
          label: e,
        });
      });

      setPengajarSelected({
        value: detailKelas.content.pengajarId,
        label: detailKelas.content.namaPengajar,
      });

      setListMuridExisting(listMuridExistingTemp);
    },
  });

  const {
    mutateAsync: editKelasMutation,
    data: editResponse,
    isSuccess,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/${id}`, "PUT", formState).then((res) =>
        res.json()
      ),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePengajar = (e) => {
    const { value } = e;
    setFormState((prev) => ({ ...prev, pengajarId: value }));
  };

  const handleChangeMurid = (e) => {
    const murid = e.map((e) => e.value);
    setFormState((prev) => ({ ...prev, listMurid: murid }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    editKelasMutation();
  };

  if (detailKelasLoading || listUserLoading) return <p>Loading...</p>;

  if (isSuccess) redirect(`/kelas/${id}`);

  return (
    <div>
      <div className=" px-7 py-20 space-y-4">
        <h1 className=" flex justify-center text-5xl font-bold text-neutral/100 ">
          Ubah Detail Kelas
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg">
            <div>
              <label className="block font-medium text-neutral/70">
                Id Kelas
              </label>
              <input
                disabled
                type="text"
                value={id}
                className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral/70">
                Pengajar
              </label>
              <Select
                defaultValue={pengajarSelected}
                onChange={handleChangePengajar}
                options={listPengajarExisting}
              />
            </div>

            <div className="flex flex-row gap-4  ">
              <div className="w-1/2">
                <label className="block font-medium text-neutral/70">
                  Program
                </label>
                <input
                  type="text"
                  value={formState.programName}
                  readOnly
                  className="bg-base mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div className="w-1/2">
                <label className="block font-medium text-neutral/70">
                  Jenis Kelas
                </label>
                <input
                  type="text"
                  value={formState.jenisKelasName}
                  readOnly
                  className="bg-base mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral/70">
                Link Group Kelas
              </label>
              <input
                type="text"
                value={formState.linkGroup}
                name="linkGroup"
                onChange={handleChange}
                className="bg-base mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div className="flex flex-row gap-4">
              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Tanggal Kelas Dimulai
                </label>
                <div className="flex mt-1 relative">
                  <input
                    type="date"
                    value={formState.tanggalMulai}
                    name="tanggalMulai"
                    onChange={handleChange}
                    className="bg-base mt-1 p-2 w-full border rounded-md "
                  />
                </div>
              </div>

              <div className="w-1/2 relative">
                <label className="block font-medium text-neutral/70">
                  Tanggal Kelas Selesai
                </label>
                <div className="flex mt-1 relative">
                  <input
                    type="date"
                    value={formState.tanggalSelesai}
                    onChange={handleChange}
                    className="bg-base mt-1 p-2 w-full border rounded-md "
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium text-neutral/70">
                Murid Kelas
              </label>
              <Select
                defaultValue={muridSelected}
                isMulti
                name="colors"
                onChange={handleChangeMurid}
                options={listMuridExisting}
                className="bg-base mt-1 p-2 w-full border rounded-md"
                classNamePrefix="select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "none", // Remove border
                    boxShadow: "none", // Remove box shadow
                    backgroundColor: "none", // Match platform input background color
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: "#EDF6FF", // Match platform input background color
                  }),
                }}
              />
            </div>

            <div>
              <label className="block font-medium text-neutral/70">
                Platform
              </label>
              <input
                type="text"
                value={formState.platform}
                name="platform"
                onChange={handleChange}
                className=" bg-base mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div className="flex justify-center py-7 gap-4">
              <button
                type="submit"
                className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover"
              >
                Ubah Kelas
              </button>
              <button className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateForm;
