"use client";

import IsLoggedIn from "../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../common/utils/authContext";
// import component
import { PayrollTable } from "../../components/payrollPage/payrollTable";
import { Breadcrumbs } from "../../components/breadcrumbs/breadcrumbs";

const Page = () => {
  const { checkPermission } = useAuthContext();
  return (
    checkPermission(true, true, true) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs/>
        <PayrollTable/>
      </div>
    )
  );
};

export default IsLoggedIn(Page);
