"use client";

import IsLoggedIn from "../../../../common/utils/IsLoggedIn";
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";
import { useAuthContext } from "../../../../common/utils/authContext";
import GantiPengajar from "../../../../components/kelasPage/gantiPengajarKelas/GantiPengajar";

const RescheduleKelas = () => {
  const { checkPermission } = useAuthContext();

  return (
    checkPermission(true, false, true) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs />
        <GantiPengajar />
      </div>
    )
  );
};

export default IsLoggedIn(RescheduleKelas);
