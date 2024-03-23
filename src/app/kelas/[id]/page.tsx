"use client";
import { useParams } from "next/navigation";

import DetailKelas from "../../../components/kelasPage/DetailKelas";
import IsLoggedIn from "../../../common/utils/IsLoggedIn";
import useFetchWithToken from "../../../common/hooks/fetchWithToken";
import { useMutation } from "react-query";
import { useAuthContext } from "../../../common/utils/authContext";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";

const Page = () => {
  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <DetailKelas />
    </div>
  );
};

export default IsLoggedIn(Page);
