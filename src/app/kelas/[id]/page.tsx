"use client";
import { useParams } from "next/navigation";

import DetailKelas from "../../../components/DetailKelas/DetailKelas";
import { useToken } from "../../../common/hooks/useToken";
import IsLoggedIn from "../../../common/utils/IsLoggedIn";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useMutation } from "react-query";

const Page = () => {
  const { id } = useParams();
  const { parseToken } = useToken();
  const claims = parseToken();
  const role = claims["role"];
  const fetchWithToken = useFetchWithToken();

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/${id}`, "DELETE").then((res) => res.json()),
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      await deleteMutation();
    }
  };

  return (
    <div>
      {(role === "superadmin" ||
        role === "akademik" ||
        role === "operasional") && (
        <DetailKelas
          buttons={
            <div className="flex justify-center py-7 gap-4">
              <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
                <a href={`/kelas/${id}/absen`}> Absensi Kelas </a>
              </button>
              <button className="bg-warning text-white px-4 py-2 rounded-md hover:bg-warningHover">
                <a href={`/kelas/${id}/edit`}>Ubah Detail Kelas</a>
              </button>
              <button
                onClick={handleDelete}
                className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover"
              >
                Hapus Kelas
              </button>
            </div>
          }
        />
      )}
      {role === "pengajar" && (
        <DetailKelas
          buttons={
            <div className="flex justify-center py-7 gap-4">
              <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
                <a href={`/error/construction`}> Zoom Kelas</a>
              </button>
              <button className="bg-warning text-white px-4 py-2 rounded-md hover:bg-warningHover">
                <a href={`/kelas/${id}/absen`}>Absensi Kelas</a>
              </button>
            </div>
          }
        />
      )}
    </div>
  );
};

export default IsLoggedIn(Page);
