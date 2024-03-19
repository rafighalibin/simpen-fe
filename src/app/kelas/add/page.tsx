"use client";
import React from "react";
import AddKelas from "../../../components/kelasPage/operasional/addKelas";
import { useAuthContext } from "../../../common/utils/authContext";
import { useRouter } from "next/navigation";
import IsLoggedIn from "../../../common/utils/IsLoggedIn";

function Page() {
  const { checkPermission } = useAuthContext();

  return (
    checkPermission(true, true, false) && (
      <div className="px-[8vw] py-8">
        <AddKelas />
      </div>
    )
  );
}

export default IsLoggedIn(Page);
