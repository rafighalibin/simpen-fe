"use client"

import IsLoggedIn from "../../../../common/utils/IsLoggedIn";
import useFetchWithToken from "../../../../common/hooks/fetchWithToken";
import { useMutation } from "react-query";
import { useAuthContext } from "../../../../common/utils/authContext";
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";
import DetailRuangan from "../../../../components/platformPage/ruangan/detailRuangan";

const Page = () => {
  const { checkPermission } = useAuthContext();
  return (
    checkPermission(true, false, false) && (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <DetailRuangan />
    </div>
    )
  );
};

export default IsLoggedIn(Page);