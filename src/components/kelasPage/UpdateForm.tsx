"use client";
import { useState, useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { PengajarSelect } from "../../common/types/pengajar";
import React from "react";
import Select from "react-select";
import { MuridDetail, MuridSelect } from "../../common/types/murid";
import useFetchPengajar from "../../common/hooks/user/useFetchPengajar";
import { set } from "react-hook-form";
import Loading from "../../common/components/Loading";
import Link from "next/link";
const hoursList = Array.from({ length: 24 }, (_, i) => {
  const hour = i < 10 ? `0${i}` : i;
  return `${hour}:00`;
});

const UpdateForm = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { isLoading: listUserLoading, listPengajarExisting } =
    useFetchPengajar();
  const [pengajarSelected, setPengajarSelected] =
    useState<PengajarSelect>(null);
  const [pengajarRendered, setPengajarRendered] = useState(false);

  const [listMuridExisting, setListMuridExisting] = useState<MuridSelect[]>([]);
  const [muridSelected, setMuridSelected] = useState<MuridSelect[]>([]);
  const [muridRendered, setMuridRendered] = useState(false);
  const [fieldsError, setFieldsError] = useState(false);

  const [formState, setFormState] = useState({
    programName: "",
    jenisKelasName: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    jam: "",
    pengajarId: "",
    namaPengajar: "",
    linkGroup: "",
    level: 0,
    platform: "",
    listMurid: [],
  });

  const {
    isLoading: detailKelasLoading,
    error: fetchDataError,
    isSuccess: fetchDataSuccess,
    data: detailKelas,
  } = useQuery({
    queryKey: ["detailKelas"],
    queryFn: () => fetchWithToken(`/kelas/${id}`).then((res) => res.json()),
    onSuccess: (detailKelas) => {
      setFormState((prev) => ({
        ...prev,
        programName: detailKelas.content.programName,
        jenisKelasName: detailKelas.content.jenisKelasName,
        tanggalMulai: new Date(detailKelas.content.tanggalMulai)
          .toISOString()
          .split("T")[0],
        tanggalSelesai: new Date(detailKelas.content.tanggalSelesai)
          .toISOString()
          .split("T")[0],
        jam: new Date(detailKelas.content.tanggalMulai).toLocaleTimeString(),
        pengajarId: detailKelas.content.pengajarId,
        namaPengajar: detailKelas.content.namaPengajar,
        linkGroup: detailKelas.content.linkGroup,
        level: detailKelas.content.level,
        platform: detailKelas.content.platform,
        listMurid: detailKelas.content.listMurid.map(
          (murid: MuridDetail) => murid.id
        ),
      }));

      detailKelas.content.listMurid.forEach((murid: MuridDetail) => {
        muridSelected.push({
          value: murid.id,
          label: murid.nama,
        });
      });

      setPengajarSelected({
        value: detailKelas.content.pengajarId,
        label: detailKelas.content.namaPengajar,
      });
    },
  });

  const {} = useQuery({
    queryKey: ["listMurid"],
    queryFn: () => fetchWithToken("/murid").then((res) => res.json()),
    onSuccess: (listMurid) => {
      let murid = listMurid.content.map((murid: MuridDetail) => ({
        value: murid.id,
        label: murid.nama,
      }));
      setListMuridExisting(murid);
    },
  });

  const {
    mutateAsync: editKelasMutation,
    data: editResponse,
    isSuccess: editKelasSuccess,
    isError: editKelasError,
    isLoading: editKelasIsLoading,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/${id}`, "PUT", formState).then((res) =>
        res.json()
      ),
    onSuccess: () => {
      queryClient.invalidateQueries("kelasDetail");
      queryClient.invalidateQueries("DetailKelas");
    },
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
    await editKelasMutation();
  };

  useEffect(() => {
    if (muridSelected.length > 0) {
      setMuridRendered(true);
    }
  }, [muridSelected]);

  useEffect(() => {
    queryClient.invalidateQueries("detailKelas");
  }, []);

  if (detailKelasLoading || listUserLoading) return <Loading />;

  if (detailKelas && detailKelas.content.status != "Scheduled")
    redirect(`/kelas/${id}`);

  return (
    <div>
      <h1 className=" flex justify-center text-5xl font-bold text-neutral/100 my-10">
        Ubah Detail Kelas
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg border">
          <div>
            <label className="block font-medium text-neutral/70">
              Id Kelas
            </label>
            <input
              disabled
              type="text"
              value={id}
              className=" read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral/70">
              Pengajar
            </label>
            {!pengajarRendered && (
              <Select
                required
                defaultValue={pengajarSelected}
                name="colors"
                onChange={handleChangePengajar}
                options={listPengajarExisting}
                className="bg-base mt-1 p-2 w-full border rounded-md"
                classNamePrefix="select"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "none",
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: "#EDF6FF",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "#215E9B"
                      : provided.backgroundColor,
                    color: state.isSelected ? "white" : provided.color,
                    fontWeight: state.isSelected ? "bold" : provided.fontWeight,
                  }),
                }}
              />
            )}
          </div>

          <div className="flex flex-row gap-4  ">
            <div className="w-1/2">
              <label className="block font-medium text-neutral/70">
                Program
              </label>
              <input
                disabled
                type="text"
                value={formState.programName}
                readOnly
                className="read-only:text-neutral/60 bg-neutral/5  mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div className="w-1/2">
              <label className="block font-medium text-neutral/70">
                Jenis Kelas
              </label>
              <input
                disabled
                type="text"
                value={formState.jenisKelasName}
                readOnly
                className="read-only:text-neutral/60 bg-neutral/5  mt-1 p-2 w-full border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-neutral/70">
              Link Group Kelas
            </label>
            <input
              required
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
                  disabled
                  type="date"
                  value={formState.tanggalMulai}
                  name="tanggalMulai"
                  onChange={handleChange}
                  className=" read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>

            <div className="w-1/2 relative">
              <label className="block font-medium text-neutral/70">
                Tanggal Kelas Selesai
              </label>
              <div className="flex mt-1 relative">
                <input
                  disabled
                  type="date"
                  value={formState.tanggalSelesai}
                  onChange={handleChange}
                  className=" read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-medium text-neutral/70">Jam</label>
            <input
              disabled
              type="text"
              value={formState.jam}
              name="platform"
              className=" read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral/70">
              Murid Kelas
            </label>
            {!muridRendered && (
              <Select
                required
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
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "none",
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: "#EDF6FF",
                  }),
                }}
              />
            )}
          </div>

          <div className="mt-5">
            {editKelasSuccess && (
              <div className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2">
                Berhasil update kelas
              </div>
            )}
            {editKelasError && (
              <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
                Gagal update kelas
              </div>
            )}
            {fetchDataError && (
              <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
                gagal mengambil data kelas
              </div>
            )}
            {fieldsError && (
              <div className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2">
                Terdapat field yang kosong
              </div>
            )}
          </div>
          <div className="flex justify-center py-7 gap-4">
            <button
              type="submit"
              className={`bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover disabled:opacity-50 relative`}
              disabled={editKelasIsLoading}
            >
              {editKelasIsLoading ? (
                <div className="inset-0 flex items-center justify-center gap-2">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6"></div>
                  <span>On Progress</span>
                </div>
              ) : (
                "Tambah Murid"
              )}
            </button>

            <Link href={`/kelas/${id}`}>
              <button className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover">
                Back
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateForm;
