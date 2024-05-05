"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useFetchFeedbackById } from "../../../common/hooks/feedback/useFetchFeedbackById";
import { Breadcrumbs } from "../../../components/breadcrumbs/breadcrumbs";
import Loading from "../../loading";
import { FormFeedback } from "../../../components/fillFeedbackPage/FormFeedback";

const FeedbackFillPage = () => {
  const { id } = useParams();
  const {
    isLoading: feedbackoading,
    error,
    feedback,
    refetch,
  } = useFetchFeedbackById(id);

  useEffect(() => {
    // Refetch data whenever component mounts
    refetch();
  }, [refetch]);

  console.log(feedback);

  if (error || !feedback) {
    return <div>Error fetching user.</div>;
  }

  return (
    <div className="px-[8vw] py-8">
      <Breadcrumbs excludeId={true} />
      {feedbackoading ? <Loading /> : <FormFeedback data={feedback} />}
    </div>
  );
};

export default FeedbackFillPage;
