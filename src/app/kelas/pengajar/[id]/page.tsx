"use client";

import { useParams } from "next/navigation";
import DetailKelas from "../../../../components/DetailKelas/DetailKelas";

const Page = () => {
  const { id } = useParams();
  return (
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
  );
};

export default Page;
