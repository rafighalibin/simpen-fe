"use client"

import IsLoggedIn from "../../../../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../../../../common/utils/authContext";
import { Breadcrumbs } from "../../../../../components/breadcrumbs/breadcrumbs";
import { UpdateZoom } from "../../../../../components/platformPage/zoom/updateZoom";

const Page = () => {
    const { checkPermission } = useAuthContext();
  return (
    checkPermission(true, false, false) && (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <UpdateZoom />
    </div>
    )
  );
};

export default IsLoggedIn(Page);