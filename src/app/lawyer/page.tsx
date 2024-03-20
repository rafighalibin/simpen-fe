"use client";
import React from "react";
import { LawyerForm } from "../../components/lawyerPage/lawyerForm";
import { LawyerTable } from "../../components/lawyerPage/lawyerTable";

export default function Page() {
  return (
    <div className="overflow-x-auto">
      <LawyerForm />
      <LawyerTable />
    </div>
  );
}
