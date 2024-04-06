"use client";

import React from 'react'
import {UpdateForm} from "../../../components/profilePage/updateForm"
import  useFetchWithToken from "../../../common/hooks/fetchWithToken";
import DetailPengajar from "../../../components/profilePage/detailPengajar";
import { useAuthContext } from "../../../common/utils/authContext";
import { Breadcrumbs } from '../../../components/breadcrumbs/breadcrumbs';
import { useParams } from 'next/navigation';

const Page= () =>{
  const fetchWithToken = useFetchWithToken();
  const { checkPermission } = useAuthContext();
  const {id} = useParams();
  return (
    checkPermission(true, true, false) && (
      <div className="px-[8vw] py-8">
      <Breadcrumbs/>
    <DetailPengajar
    buttons={
      <div className="flex justify-center pt-10 gap-4">
        <button className="bg-info text-white px-6 py-2 rounded-md hover:bg-infoHover">
          <a href={`/pengajar/${id}/tag`}> Update Tag </a>
        </button>
      </div>
    }
  />
  </div>
    )
  )
}

export default Page;
