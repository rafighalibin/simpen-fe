"use client";

// import component
import { EditJenisKelasForm } from "../../../../../components/jenisKelasPage/editJenisKelasForm";
import { Breadcrumbs } from "../../../../../components/breadcrumbs/breadcrumbs";

export default function App() {
  return (
    <main className="pb-24">
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <EditJenisKelasForm />
    </div>
    </main>
  );
}
