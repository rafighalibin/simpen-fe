"use client";

import { useRouter } from "next/navigation";
import Loading from "../../loading";

const DetailPage = () => {
  const router = useRouter();

  setTimeout(() => {
    router.replace("/user");
  }, 1000);

  return (
    <div>
      <Loading />
    </div>
  );
};

export default DetailPage;
