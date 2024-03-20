"use client";

import IsLoggedIn from "../../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../../common/utils/authContext";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import { DetailMurid } from "../../../components/muridPage/detailMurid/DetailMurid";

const Page = () => {
  const { checkPermission } = useAuthContext();

  return (
    checkPermission(true, false, false) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs />
        <DetailMurid />
      </div>
    )
  );
};

export default IsLoggedIn(Page);
