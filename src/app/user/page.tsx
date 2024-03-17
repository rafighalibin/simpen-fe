"use client";

import IsLoggedIn from "../../common/utils/IsLoggedIn";
// import component
import { Breadcrumbs } from "../../components/breadcrumbs/breadcrumbs";
import { UserListTable } from "../../components/userList/UserListTable";

const App = () => {
  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <UserListTable />
    </div>
  );
};

export default IsLoggedIn(App);
