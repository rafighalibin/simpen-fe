"use client";
import React from "react";
import { LawyerForm } from "../../components/LawyerPage/lawyerForm";
import { LawyerTable } from "../../components/LawyerPage/lawyerTable";

export default function Page() {
  return (
    <div className="overflow-x-auto">
      <LawyerForm />
      <LawyerTable />
    </div>
  );
}
