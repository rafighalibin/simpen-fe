"use client";

import React from 'react'
import {UpdateForm} from "../../../../components/profilePage/updateForm"
import { useAuthContext } from "../../../../common/utils/authContext";

export default function EditProfilePage(){
  const { checkPermission } = useAuthContext();

  return (
    <UpdateForm/>
  )
}
