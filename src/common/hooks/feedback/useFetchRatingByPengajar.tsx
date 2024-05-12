import React, { useEffect, useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { Rating } from "../../types/rating";
import { useQuery } from "react-query";

export const useFetchRatingByPengajar = (id) => {
  const fetchWithToken = useFetchWithToken();
  const [rating, setRating] = useState<Rating[]>([]);

  const { isLoading, error, data, refetch } = useQuery(["rating", id], () =>
    fetchWithToken(`/rating/${id}`).then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      // Assuming the response structure is similar to what you provided earlier
      setRating(data.content);
    }
  }, [data]);

  return { isLoading, error, rating, refetch };
};
