"use client";

import IsLoggedIn from "../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../common/utils/authContext";
// import component
import { Breadcrumbs } from "../../components/breadcrumbs/breadcrumbs";
import { FeedbackListTable } from "../../components/feedbackList/FeedbackListTable";
import { UserListTable } from "../../components/userList/UserListTable";

const App = () => {
  const { checkPermission } = useAuthContext();
  return (
    checkPermission(true, true, false) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs />
        <FeedbackListTable />
      </div>
    )
  );
};

export default IsLoggedIn(App);
