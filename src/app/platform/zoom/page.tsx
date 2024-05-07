"use client";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import React from "react";
import { request } from "http";
import IsLoggedIn from "../../../common/utils/IsLoggedIn";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import { useAuthContext } from "../../../common/utils/authContext";
import { ZoomTable } from "../../../components/platformPage/zoom/zoomTable";

const Page = () => {
  const { checkPermission } = useAuthContext();
  return (
    checkPermission(true, false, false) && (
        <div className="px-[8vw] py-8">
        <Breadcrumbs />
        <ZoomTable />
      </div>
      )
  );
};

export default IsLoggedIn(Page);
