"use client";

import React from 'react'
import {UpdateForm} from "../../../components/profilePage/updateForm"
import  useFetchWithToken from "../../../common/hooks/fetchWithToken";
import DetailAkun from "../../../components/profilePage/detailAkun";
import { useAuthContext } from "../../../common/utils/authContext";
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';

const Page= () =>{
  const fetchWithToken = useFetchWithToken();
  const { checkPermission } = useAuthContext();
  return (
    checkPermission(true, true, true) && (
      <div className="px-[8vw] py-8">
      <Breadcrumbs/>
    <DetailAkun
    buttons={
      <div className="flex justify-center py-7 gap-4">
        <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
          <a href={`/user/profile/edit`}> Ubah Detail Akun </a>
        </button>
      </div>
    }
  />
  </div>
  ))
}

export default Page;
