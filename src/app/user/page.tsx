"use client";

// import component
import { Breadcrumbs } from "../../components/breadcrumbs/breadcrumbs";
import { UserListTable } from "../../components/userList/UserListTable";

export default function App() {
  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <UserListTable />
    </div>
  );
}
