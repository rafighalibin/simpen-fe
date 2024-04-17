"use client";

import IsLoggedIn from "../../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../../common/utils/authContext";
// import component
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import { DetailFee } from "../../../components/payrollPage/DetailFee";


const Page = () => {
  const { checkPermission } = useAuthContext();
  return (
    checkPermission(true, true, true) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs/>
        <DetailFee/>
      </div>
    )
  );
};

export default IsLoggedIn(Page);
