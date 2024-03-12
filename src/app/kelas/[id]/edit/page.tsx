"use client";
import React from "react";
import UpdateForm from "../../../../components/DetailKelas/UpdateForm";
import { useToken } from "../../../../common/hooks/useToken";
import Unauthorized from "../../../../components/errors/unauthorized";

export default function EditPage() {
  const { parseToken } = useToken();
  const claims = parseToken();
  const role = claims["role"];
  if (role === "superadmin" || role === "akademik" || role === "operasional") {
    return <UpdateForm />;
  }
  return <Unauthorized />;
}
