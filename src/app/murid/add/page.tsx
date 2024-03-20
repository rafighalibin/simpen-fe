"use client";

import IsLoggedIn from "../../../common/utils/IsLoggedIn";
// import component
import { AddForm } from "../../../components/muridPage/addMurid/AddMurid";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";

const App = () => {
  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <AddForm />
    </div>
  );
};

export default IsLoggedIn(App);
