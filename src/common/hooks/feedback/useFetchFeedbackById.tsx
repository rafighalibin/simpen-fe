import React, { useEffect, useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { useQuery } from "react-query";
import { Feedback } from "../../types/feedback";

export const useFetchFeedbackById = (id) => {
  const fetchWithToken = useFetchWithToken();
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  const { isLoading, error, data, refetch } = useQuery("feedback", () =>
    fetchWithToken(`/feedback/${id}`).then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const feedbackTemp: Feedback[] = data.content;
      setFeedback(feedbackTemp);
    }
  }, [data]);

  return { isLoading, error, feedback, refetch };
};
