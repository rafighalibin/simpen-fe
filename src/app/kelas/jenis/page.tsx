"use client";
import React from "react";
import { JenisKelasTable } from "../../../components/jenisKelasPage/jenisKelasTable";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";

export default function Page() {
  return (
    <main className="pb-24">
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <JenisKelasTable />
    </div>
    </main>
  );
}