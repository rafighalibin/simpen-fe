"use client";

import React from "react";
import { UpdateForm } from "../../../../components/profilePage/updateForm";
import useFetchWithToken from "../../../../common/hooks/fetchWithToken";
import DetailPengajar from "../../../../components/profilePage/detailPengajar";
import { useAuthContext } from "../../../../common/utils/authContext";
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";
import { useParams } from "next/navigation";
import { AvailabilityPengajar } from "../../../../components/availabilityPage/AvalaibilityPengajar";

const Page = () => {
  const fetchWithToken = useFetchWithToken();
  const { checkPermission } = useAuthContext();
  const { id } = useParams();
  return (
    checkPermission(true, true, false) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs />
        <AvailabilityPengajar />
      </div>
    )
  );
};

export default Page;
