"use client";

import IsLoggedIn from "../../../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../../../common/utils/authContext";
// import component
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";
import { UpdateFee } from "../../../../components/payrollPage/updatePayroll";


const Page = () => {
  const { checkPermission } = useAuthContext();
  return (
    checkPermission(true, false, false) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs/>
        <UpdateFee/>
      </div>
    )
  );
};

export default IsLoggedIn(Page);
