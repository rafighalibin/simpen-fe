"use client";

import { useParams } from "next/navigation";
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";
import { DetailJenisKelas } from "../../../../components/jenisKelasPage/jenisKelasDetail";
import Loading from "../../../loading";
import { useEffect } from "react";
import { useFetchJenisKelasDetail } from "../../../../common/hooks/jeniskelas/useFetchJenisKelasDetail";

const JenisKelasDetailsPage = () => {
  const { id } = useParams();
  const { isLoading: jeniskelasLoading, error, jeniskelas, refetch } = useFetchJenisKelasDetail(id);

  useEffect(() => {
    // Refetch data whenever component mounts
    refetch();
  }, [refetch]);

  if (error || !jeniskelas) {
    return <div>Error fetching Jenis Kelas.</div>;
  }

  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs excludeId={true} />
      {jeniskelasLoading ? <Loading /> : <DetailJenisKelas />}
    </div>
  );
};

export default JenisKelasDetailsPage;
