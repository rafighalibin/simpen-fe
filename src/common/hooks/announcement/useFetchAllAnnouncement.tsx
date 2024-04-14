import { useEffect, useState } from "react";
import useFetchWithToken from "../fetchWithToken";
import { User } from "../../types/user";
import { useQuery } from "react-query";
import { Announcement } from "../../types/announcement";

const useFetchAllAnnouncement = () => {
  const fetchWithToken = useFetchWithToken();
  const [listAnnouncement, setListAnnouncement] = useState<Announcement[]>([]);

  const { isLoading, error, data, refetch } = useQuery("listAnnouncement", () =>
    fetchWithToken("/announcement").then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const listAnncTemp: Announcement[] = data.content;
      setListAnnouncement(listAnncTemp);
    }
  }, [data]);

  return { isLoading, error, listAnnouncement, refetch };
};

export default useFetchAllAnnouncement;
