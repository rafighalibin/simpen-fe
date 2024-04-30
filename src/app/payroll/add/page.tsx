"use client";

import IsLoggedIn from "../../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../../common/utils/authContext";
import React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import { AddPayroll } from "../../../components/payrollPage/addPayroll";

const Page = () =>{
  const { checkPermission } = useAuthContext();
  return (
    checkPermission(true, false, false) && (
      <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <AddPayroll />
    </div>
    )
  );
}

export default IsLoggedIn(Page);
