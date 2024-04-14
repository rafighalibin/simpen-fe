"use client";

import { useParams } from "next/navigation";
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";
import Loading from "../../../loading";
import { useEffect } from "react";
import { useFetchProgramDetail } from "../../../../common/hooks/program/useFetchProgramDetail";
import { DetailProgram } from "../../../../components/programPage/programDetail";

const ProgramDetailsPage = () => {
  const { id } = useParams();
  const { isLoading: programLoading, error, program, refetch } = useFetchProgramDetail(id);

  useEffect(() => {
    // Refetch data whenever component mounts
    refetch();
  }, [refetch]);

  if (error || !program) {
    return <div>Error fetching Program.</div>;
  }

  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs excludeId={true} />
      {programLoading ? <Loading /> : <DetailProgram />}
    </div>
  );
};

export default ProgramDetailsPage;
