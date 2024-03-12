"use client";
import { useParams } from "next/navigation";

import DetailKelas from "../../../components/DetailKelas/DetailKelas";
import { useToken } from "../../../common/hooks/useToken";

const Page = () => {
  const { id } = useParams();
  const { parseToken } = useToken();
  const claims = parseToken();
  const role = claims["role"];
  return (
    <div>
      {(role === "superadmin" ||
        role === "akademik" ||
        role === "operasional") && (
        <DetailKelas
          buttons={
            <div className="flex justify-center py-7 gap-4">
              <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
                Absensi Kelas
              </button>
              <button className="bg-warning text-white px-4 py-2 rounded-md hover:bg-warningHover">
                <a href={`/kelas/${id}/edit`}>Ubah Detail Kelas</a>
              </button>
              <button className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover">
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
                Zoom Kelas
              </button>
              <button className="bg-warning text-white px-4 py-2 rounded-md hover:bg-warningHover">
                <a href={`/kelas/pengajar/${id}/absen`}>Absensi Kelas</a>
              </button>
            </div>
          }
        />
      )}
    </div>
  );
};

export default Page;
