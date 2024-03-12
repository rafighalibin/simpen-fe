"use client";

// import component
import { AddForm } from "../../../components/addUserPage/addForm";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";

export default function App() {
  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <AddForm />
    </div>
  );
}
