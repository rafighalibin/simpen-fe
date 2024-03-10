"use client";
import { useQuery } from "react-query";
import React from "react";
import { AddForm } from "../../components/LawyerPage/addForm";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { Lawyer } from "../../common/types/lawyer";
import { LawyerTable } from "../../components/LawyerPage/table";

export default function Page() {
  return (
    <div className="overflow-x-auto">
      <AddForm />
      <LawyerTable />
    </div>
  );
}
