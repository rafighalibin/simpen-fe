"use client";
import React from "react";
import UpdateForm from "../../../../components/kelasPage/UpdateForm";
import { useToken } from "../../../../common/hooks/useToken";
import IsLoggedIn from "../../../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../../../common/utils/authContext";
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";

const EditPage = () => {
  const { parseToken } = useToken();
  const { checkPermission } = useAuthContext();
  const claims = parseToken();
  const role = claims["role"];

  return (
    checkPermission(true, true, false) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs />
        <UpdateForm />
      </div>
    )
  );
};

export default IsLoggedIn(EditPage);
