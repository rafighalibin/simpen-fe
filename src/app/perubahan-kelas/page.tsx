"use client";

import React from "react";
import { PerubahanKelasTable } from "../../components/perubahanKelasPage/perubahanKelasTable/perubahanKelasTable";
import IsLoggedIn from "../../common/utils/IsLoggedIn";
import { Breadcrumbs } from "../../components/breadcrumbs/breadcrumbs";

const Page = () => {
  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <PerubahanKelasTable />
    </div>
  );
};

export default IsLoggedIn(Page);
