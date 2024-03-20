"use client";

// import component
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";
import { UpdateMurid } from "../../../../components/muridPage/updateMurid/UpdateMurid";

const UserEditPage = () => {
  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <UpdateMurid />
    </div>
  );
};

export default UserEditPage;
