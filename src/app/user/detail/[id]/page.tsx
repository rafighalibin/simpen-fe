"use client";

import { useParams } from "next/navigation";
import { useFetchUserById } from "../../../../common/hooks/user/useFetchUserById";
import { Breadcrumbs } from "../../../../components/breadcrumbs/breadcrumbs";
import { DetailUser } from "../../../../components/DetailUser/DetailUser";
import Loading from "../../../loading";
import { useEffect } from "react";

const UserDetailsPage = () => {
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
      {userLoading ? <Loading /> : <DetailUser data={user} />}
    </div>
  );
};

export default UserDetailsPage;
