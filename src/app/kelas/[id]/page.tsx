"use client";
import { useParams } from "next/navigation";

import DetailKelas from "../../../components/DetailKelas/DetailKelas";

const Page = () => {
  const { id } = useParams();

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
  />;
};

export default Page;
