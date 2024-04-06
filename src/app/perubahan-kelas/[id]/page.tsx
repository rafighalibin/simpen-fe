"use client";

import IsLoggedIn from "../../../common/utils/IsLoggedIn";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import DetailRequestPerubahanKelas from "../../../components/perubahanKelasPage/detailRequestPerubahanKelas/DetailRequestPerubahanKelas";

const Page = () => {
  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <DetailRequestPerubahanKelas />
    </div>
  );
};

export default IsLoggedIn(Page);
