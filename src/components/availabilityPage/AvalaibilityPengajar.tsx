"use client";
import { useState } from "react";
import React from "react";
import ScheduleSelector from "react-schedule-selector";
import { format } from "date-fns";
import { UpdateAvailability } from "../../common/types/availability";
import { useMutation, useQuery } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useParams } from "next/navigation";
export const AvailabilityPengajar = () => {
  const fetchWithToken = useFetchWithToken();
  const [schedule, setSchedule] = useState([]);
  const [payload, setPayload] = useState([] as UpdateAvailability[]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { id } = useParams();

  const {
    isLoading: fetchAvailabilityIsLoading,
    data: fetchAvailabilityResponse,
    isSuccess: fetchAvailabilitySuccess,
    isError: fetchAvailabilityError,
    data: fetchAvailabilityData,
  } = useQuery({
    queryKey: ["availability"],
    queryFn: () =>
      fetchWithToken(`/availability/${id}`).then((res) => res.json()),
    onSuccess: (data) => {
      data.content.availability.map((e) => {
        let dateInstance = new Date(e[0], e[1] - 1, e[2], e[3], e[4]);
        setSchedule((prev) => [...prev, dateInstance]);
      });

      let e = data.content.lastUpdate;
      let dateInstance = new Date(e[0], e[1] - 1, e[2], e[3], e[4]);
      setLastUpdate(dateInstance);
    },
  });

  return (
    <div>
      <h1 className=" flex justify-center text-5xl font-bold text-neutral/100 my-10">
        Availability Pengajar
      </h1>
      <div className="bg-base flex flex-col space-y-4 px-8 py-12 shadow-lg rounded-lg border">
        <div className="px-20">
          <ScheduleSelector
            startDate={
              new Date(
                new Date().getFullYear(),
                new Date("1/4/2024").getMonth(),
                1
              )
            }
            selection={schedule}
            numDays={7}
            minTime={8}
            maxTime={22}
            hourlyChunks={1}
            dateFormat="dddd"
            timeFormat="HH:mm"
          />
        </div>
        <p className="font-medium text-neutral/70 flex justify-center">
          Update terakhir {format(lastUpdate, "DD/MM/YYYY HH:mm:ss")}
        </p>
      </div>
    </div>
  );
};
