"use client";

import IsLoggedIn from "../../../../common/utils/IsLoggedIn";
import Absen from "../../../../components/kelasPage/absenKelas/Absen";
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";
import { useAuthContext } from "../../../../common/utils/authContext";

const AbsenKelas = () => {
  const { checkPermission } = useAuthContext();

  return (
    checkPermission(true, false, true) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs />
        <Absen />
      </div>
    )
  );
};

export default IsLoggedIn(AbsenKelas);
