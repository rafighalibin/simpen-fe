"use client";

// import component
import { DetailUser } from "../../../components/DetailUser/DetailUser";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";

const UserDetailsPage = ({ searchParams }) => {
  const user = JSON.parse(searchParams.user);

  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <DetailUser data={user} />
    </div>
  );
};

export default UserDetailsPage;
