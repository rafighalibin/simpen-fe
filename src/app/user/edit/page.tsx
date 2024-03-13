"use client";

// import component
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import { EditUserForm } from "../../../components/EditUserPage/EditUserForm";

const UserEditPage = ({ searchParams }) => {
  const user = JSON.parse(searchParams.user);

  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <EditUserForm data={user} />
    </div>
  );
};

export default UserEditPage;
