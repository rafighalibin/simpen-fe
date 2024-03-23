"use client";

import React from 'react'
import {UpdateForm} from "../../../../components/profilePage/updateForm"
import  useFetchWithToken from "../../../../common/hooks/fetchWithToken";
import DetailPengajar from "../../../../components/profilePage/detailPengajar";
import { useAuthContext } from "../../../../common/utils/authContext";
import { Breadcrumbs } from '../../../../components/breadcrumbs/breadcrumbs';

const Page= () =>{
  const fetchWithToken = useFetchWithToken();
  const { checkPermission } = useAuthContext();
  return (
      <div className="px-[8vw] py-8">
      <Breadcrumbs/>
    <DetailPengajar
    buttons={
      <div className="flex justify-center pt-7 pb-2 gap-4">
        <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
          <a href={`/user/profile/edit`}> Ubah Detail Akun </a>
        </button>
      </div>
    }
  />
  </div>
  )
}

export default Page;