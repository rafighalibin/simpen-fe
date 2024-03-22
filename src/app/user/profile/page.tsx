"use client";

import React from 'react'
import {UpdateForm} from "../../../components/profilePage/updateForm"
import  useFetchWithToken from "../../../common/hooks/fetchWithToken";
import DetailAkun from "../../../components/profilePage/detailAkun";

const Page= () =>{
  const fetchWithToken = useFetchWithToken();
  return (
    <DetailAkun
    buttons={
      <div className="flex justify-center py-7 gap-4">
        <button className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
          <a href={`/user/profile/edit`}> Ubah Detail Akun </a>
        </button>
      </div>
    }
  />
  )
}

export default Page;
