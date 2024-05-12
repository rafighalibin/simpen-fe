import { useEffect, useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { Feedback } from "../../types/feedback";
import { useQuery } from "react-query";

const useFetchAllFeedback = () => {
  const fetchWithToken = useFetchWithToken();
  const [listFeedback, setListFeedback] = useState<Feedback[]>([]);

  const { isLoading, error, data, refetch } = useQuery("listFeedback", () =>
    fetchWithToken("/feedback").then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const listFeedbackTemp: Feedback[] = data.content;
      setListFeedback(listFeedbackTemp);
    }
  }, [data]);

  return { isLoading, error, listFeedback, refetch };
};

export default useFetchAllFeedback;
