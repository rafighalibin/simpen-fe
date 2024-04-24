"use client";
import React, { useEffect, useState } from "react";
import { CreateAvailability } from "../../../components/availabilityPage/createAvalaibility";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import LoadingPage from "../../../common/components/Loading";

const CreateAvailabilityPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);
  return isLoading ? (
    <LoadingPage />
  ) : (
    <div className="px-[8vw] py-8">
      <Breadcrumbs />
      <CreateAvailability />
    </div>
  );
};

export default CreateAvailabilityPage;
