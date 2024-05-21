"use client";

import IsLoggedIn from "../../../common/utils/IsLoggedIn";
// import component
import { AddForm } from "../../../components/addUserPage/addForm";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import { UserListTable } from "../../../components/userList/UserListTable";

const App = () => {
  return (
    <main className="pb-24">
      <div className="px-[8vw] py-8 p-24">
        <Breadcrumbs />
        <UserListTable />
      </div>
    </main>
  );
};

export default IsLoggedIn(App);
