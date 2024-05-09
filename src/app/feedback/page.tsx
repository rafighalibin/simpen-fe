"use client";

import IsLoggedIn from "../../common/utils/IsLoggedIn";
import { useAuthContext } from "../../common/utils/authContext";
// import component
import { Breadcrumbs } from "../../components/breadcrumbs/breadcrumbs";
import { FeedbackListPengajarTable } from "../../components/feedbackPage/FeedbackListPengajarTable";
import { FeedbackListTable } from "../../components/feedbackPage/FeedbackListTable";
import { UserListTable } from "../../components/userList/UserListTable";

const App = () => {
  const { pengguna, checkPermission } = useAuthContext();
  return (
    checkPermission(true, true, true) && (
      <div className="px-[8vw] py-8">
        <Breadcrumbs />
        {pengguna.role === "operasional" || pengguna.role === "akademik" ? (
          <FeedbackListTable />
        ) : (
          <FeedbackListPengajarTable />
        )}
      </div>
    )
  );
};

export default IsLoggedIn(App);
