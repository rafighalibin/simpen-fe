"use client";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import React from "react";
import { request } from "http";
import { KelasTable } from "../../components/kelasPage/kelasTable";
import IsLoggedIn from "../../common/utils/IsLoggedIn";

const Page = () => {
  return (
    <div>
      <KelasTable />
    </div>
  );
};

export default IsLoggedIn(Page);
