"use client";

import React from 'react'
import {UpdateTagPengajar} from "../../../../components/profilePage/updateTagpengajar"
import { useAuthContext } from "../../../../common/utils/authContext";

export default function EditProfilePage(){
  const { checkPermission } = useAuthContext();

  return (
    checkPermission(true, true, false) &&(
    <UpdateTagPengajar/>
    )
  )
}
