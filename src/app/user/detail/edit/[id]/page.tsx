"use client";

import { useParams } from "next/navigation";
import { useFetchUserById } from "../../../../../common/hooks/user/useFetchUserById";
import { Breadcrumbs } from "../../../../../components/breadcrumbs/breadcrumbs";
import Loading from "../../../../loading";
import { useEffect } from "react";
import { EditUserForm } from "../../../../../components/EditUserPage/EditUserForm";

const UserEditPage = () => {
  const { id } = useParams();
  const { isLoading: userLoading, error, user, refetch } = useFetchUserById(id);

  useEffect(() => {
    // Refetch data whenever component mounts
    refetch();
  }, [refetch]);

  if (error || !user) {
    return <div>Error fetching user.</div>;
  }

  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs excludeId={true} />
      {userLoading ? <Loading /> : <EditUserForm data={user} />}
    </div>
  );
};

export default UserEditPage;
