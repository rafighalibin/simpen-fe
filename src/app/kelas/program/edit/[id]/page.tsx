"use client";

// import component
import { useParams } from "next/navigation";
import { useFetchProgramDetail } from "../../../../../common/hooks/program/useFetchProgramDetail";
import Loading from "../../../../loading";
import { useEffect } from "react";
import { EditProgramForm } from "../../../../../components/programPage/editProgramForm";
import { Breadcrumbs } from "../../../../../components/breadcrumbs/breadcrumbs";

const ProgramEditPage = () => {
  const { id } = useParams();
  const { isLoading: programLoading, error, program, refetch } = useFetchProgramDetail(id);

  useEffect(() => {
    // Refetch data whenever component mounts
    refetch();
  }, [refetch]);

  if (error || !program) {
    return <div>Error fetching program.</div>;
  }

  return (
    <main className="pb-24">
    <div className="px-[8vw] py-8">
      <Breadcrumbs excludeId={true} />
      {programLoading ? <Loading /> : <EditProgramForm data={program} />}
    </div>
    </main>
  );
}

export default ProgramEditPage;
