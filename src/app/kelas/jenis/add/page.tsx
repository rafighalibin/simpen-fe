"use client";

// import component
import { AddJenisKelasForm } from "../../../../components/jenisKelasPage/addJenisKelasForm";
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";

export default function App() {
  return (
    <main className="pb-24">
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <AddJenisKelasForm />
    </div>
    </main>
  );
}
