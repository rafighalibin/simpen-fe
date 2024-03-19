"use client";

import IsLoggedIn from "../../../../common/utils/IsLoggedIn";
import Absen from "../../../../components/DetailKelas/Absen/Absen";
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AbsenKelas = () => {
  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <Absen />
    </div>
  );
};

export default IsLoggedIn(AbsenKelas);
