"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import CalendarIcon from "../../common/components/icons/CalendarIcon";
import { MuridRead, MuridSelect } from "../../common/types/murid";
import Loading from "../../common/components/Loading";
import { DataTable as DataTableMurid } from "../muridPage/muridTable/murid-data-table";
import { columns as ColumnsMurid } from "../muridPage/muridTable/columns";
import { useAuthContext } from "../../common/utils/authContext";

const DetailKelas = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const { pengguna: userLoggedIn } = useAuthContext();
  const router = useRouter();
  const [muridRendered, setMuridRendered] = useState(false);
  const { isLoading, error, data } = useQuery({
    queryKey: ["kelasDetail"],
    queryFn: () => fetchWithToken(`/kelas/${id}`).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data);
      if (data.status != "OK") {
        window.alert(data.message);
        router.push("/dashboard");
      }
      data.content.listMurid.forEach((e) => {
        muridSelected.push({
          value: e,
          label: e,
        });
      });
    },
  });

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/${id}`, "DELETE").then((res) => res.json()),
    onSuccess: () => {
      alert("Kelas berhasil dihapus");
      window.location.href = "/kelas";
    },
  });

  const [muridSelected, setMuridSelected] = useState<MuridSelect[]>([]);

  useEffect(() => {
    if (muridSelected.length > 0) {
      setMuridRendered(true);
    }
  }, [muridSelected]);

  if (isLoading) return <Loading />;

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
    zoom,
    namaPengajar,
    status,
  } = data.content;

  const listMuridShow: MuridRead[] = listMurid;

  // Function to convert timestamps to readable dates
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      await deleteMutation();
    }
  };
  return (
    <div>
      <h1 className=" flex justify-center text-5xl font-bold text-neutral/100 my-10">
        Detail Kelas
      </h1>
      <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg border">
        <div>
          <label className="block font-medium text-neutral/70">Id Kelas</label>
          <input
            disabled
            type="text"
            value={id}
            className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium text-neutral/70">Pengajar</label>
          <input
            disabled
            type="text"
            value={namaPengajar}
            className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
          />
        </div>

        <div className="flex flex-row gap-4  ">
          <div className="w-1/2">
            <label className="block font-medium text-neutral/70">Program</label>
            <input
              disabled
              type="text"
              value={programName}
              className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full  rounded-md"
            />
          </div>

          <div className="w-1/2">
            <label className="block font-medium text-neutral/70">
              Jenis Kelas
            </label>
            <input
              disabled
              type="text"
              value={jenisKelasName}
              className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-neutral/70">
            Link Group Kelas
          </label>
          <input
            disabled
            type="text"
            value={linkGroup}
            className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
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
                type="text"
                value={formatDate(tanggalMulai)}
                className="read-only:text-neutral/60 bg-neutral/5 p-2 pl-10 w-full rounded-md bg-gray-100 cursor-not-allowed"
                readOnly
              />
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <CalendarIcon className="text-neutral/80" />
              </div>
            </div>
          </div>

          <div className="w-1/2 relative">
            <label className="block font-medium text-neutral/70">
              Tanggal Kelas Selesai
            </label>
            <div className="flex mt-1 relative">
              <input
                disabled
                type="text"
                value={formatDate(tanggalSelesai)}
                className="read-only:text-neutral/60 bg-neutral/5 p-2 pl-10 w-full rounded-md bg-gray-100 cursor-not-allowed"
                readOnly
              />
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <CalendarIcon className="text-neutral/80" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium text-neutral/70">Jam</label>
          <input
            disabled
            type="text"
            value="19:00"
            name="platform"
            className=" read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium text-neutral/70">
            Link Platform
          </label>
          <input
            disabled
            type="text"
            value={zoom.link}
            className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
          />
        </div>

        <div className="p-2">
          <DataTableMurid
            columns={ColumnsMurid}
            data={listMuridShow}
            enableFilters={false}
            enablePagination={false}
          />
        </div>

        <div>
          {!(userLoggedIn.role === "pengajar") && (
            <div className="flex justify-center py-7 gap-4">
              <a href={`/kelas/${id}/absen`}>
                <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
                  Absensi Kelas
                </button>
              </a>
              {status === "Scheduled" && (
                <div className="flex justify-center gap-4">
                  <a href={`/kelas/${id}/edit`}>
                    <button className="bg-warning text-white px-4 py-2 rounded-md hover:bg-warningHover">
                      Ubah Detail Kelas
                    </button>
                  </a>
                  <button
                    onClick={handleDelete}
                    className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover"
                  >
                    Hapus Kelas
                  </button>
                </div>
              )}
            </div>
          )}

          {userLoggedIn.role === "pengajar" && (
            <div className="flex justify-center py-7 gap-4">
              <a href={`/error/construction`}>
                <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
                  Zoom Kelas
                </button>
              </a>
              <a href={`/kelas/${id}/absen`}>
                <button className="bg-warning text-white px-4 py-2 rounded-md hover:bg-warningHover">
                  Absensi Kelas
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailKelas;
