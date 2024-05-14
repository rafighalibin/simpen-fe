"use client"

import IsLoggedIn from "../../../../common/utils/IsLoggedIn";
import useFetchWithToken from "../../../../common/hooks/fetchWithToken";
import { useMutation } from "react-query";
import { useAuthContext } from "../../../../common/utils/authContext";
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";
import DetailZoom from "../../../../components/platformPage/zoom/detaillZoom";

const Page = () => {
  const { checkPermission } = useAuthContext();
  return (
    checkPermission(true, false, false) && (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <DetailZoom />
    </div>
    )
  );
};

export default IsLoggedIn(Page);