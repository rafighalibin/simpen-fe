"use client";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import React from "react";
import { request } from "http";
import { KelasTable } from "../../components/kelasPage/kelasTable/kelasTable";
import IsLoggedIn from "../../common/utils/IsLoggedIn";
import { Breadcrumbs } from "../../components/breadcrumbs/breadcrumbs";

const Page = () => {
  return (
    <main className="pb-24">
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <KelasTable />
    </div>
    </main>
  );
};

export default IsLoggedIn(Page);
