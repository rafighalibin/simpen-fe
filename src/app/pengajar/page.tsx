"use client";

import React from 'react'
import { DaftarPengajar } from "../../components/daftarPengajarPage/daftarPengajar"
import { useAuthContext } from "../../common/utils/authContext";
import { Breadcrumbs } from '../../components/breadcrumbs/breadcrumbs';
import IsLoggedIn from "../../common/utils/IsLoggedIn";

const Page= () =>{
  const { checkPermission } = useAuthContext();

  return (
    checkPermission(true, true, false) && (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
        <DaftarPengajar/>
    </div>
    )
  )
}
export default IsLoggedIn(Page);
