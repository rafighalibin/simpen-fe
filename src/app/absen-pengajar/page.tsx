"use client";

import React from 'react'
import { DaftarAbsenPengajar } from "../../components/absenPengajarPage/daftarAbsenPengajar"
import { useAuthContext } from "../../common/utils/authContext";
import { Breadcrumbs } from '../../components/breadcrumbs/breadcrumbs';
import IsLoggedIn from "../../common/utils/IsLoggedIn";

const Page= () =>{
  const { checkPermission } = useAuthContext();

  return (
    checkPermission(true, true, true) && (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
        <DaftarAbsenPengajar/>
    </div>
    )
  )
}
export default IsLoggedIn(Page);
