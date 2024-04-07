"use client";
import React from "react";
import AddKelas from "../../../components/kelasPage/kelasTable/operasional/addKelas";
import { useAuthContext } from "../../../common/utils/authContext";
import { useRouter } from "next/navigation";
import IsLoggedIn from "../../../common/utils/IsLoggedIn";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";

function Page() {
  return (
      <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <AddKelas />
    </div>
  );
}

export default IsLoggedIn(Page);
