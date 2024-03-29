"use client";
import React from "react";
import { ProgramTable } from "../../../components/programPage/ProgramTable";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";

export default function App() {
  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <ProgramTable />
    </div>
  );
}