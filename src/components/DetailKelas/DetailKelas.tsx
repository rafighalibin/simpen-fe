"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import CalendarIcon from "../../common/components/icons/CalendarIcon";
import { MuridSelect } from "../../common/types/murid";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DetailKelas = ({ buttons }) => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams();
  const [muridRendered, setMuridRendered] = useState(false);
  const { isLoading, error, data } = useQuery({
    queryKey: ["kelasDetail"],
    queryFn: () => fetchWithToken(`/kelas/${id}`).then((res) => res.json()),
    onSuccess: (data) => {
      data.content.listMurid.forEach((e) => {
        muridSelected.push({
          value: e,
          label: e,
        });
      });
    },
  });
  const [muridSelected, setMuridSelected] = useState<MuridSelect[]>([]);

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/${id}`, "DELETE").then((res) => res.json()),
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      await deleteMutation();
    }
  };

  useEffect(() => {
    if (muridSelected.length > 0) {
      setMuridRendered(true);
    }
  }, [muridSelected]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error fetching class details.</div>;
  }

  const {
    programName,
    jenisKelasName,
    listSesi,
    tanggalMulai,
    tanggalSelesai,
    pengajarId,
    linkGroup,
    listMurid,
    level,
    platform,
    namaPengajar,
  } = data.content;

  // Function to convert timestamps to readable dates
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US");
  };

  return (
    <div>
      <div className=" px-7 py-20 space-y-4">
        <h1 className=" flex justify-center text-5xl font-bold text-neutral/100 ">
          Detail Kelas
        </h1>
        <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg">
          <div>
            <label className="block font-medium text-neutral/70">
              Id Kelas
            </label>
            <input
              disabled
              type="text"
              value={id}
              className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral/70">
              Pengajar
            </label>
            <input
              disabled
              type="text"
              value={namaPengajar}
              className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
            />
          </div>

          <div className="flex flex-row gap-4  ">
            <div className="w-1/2">
              <label className="block font-medium text-neutral/70">
                Program
              </label>
              <input
                disabled
                type="text"
                value={programName}
                className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full  rounded-md"
              />
            </div>

            <div className="w-1/2">
              <label className="block font-medium text-neutral/70">
                Jenis Kelas
              </label>
              <input
                disabled
                type="text"
                value={jenisKelasName}
                className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-neutral/70">
              Link Group Kelas
            </label>
            <input
              disabled
              type="text"
              value={linkGroup}
              className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
            />
          </div>

          <div className="flex flex-row gap-4">
            <div className="w-1/2 relative">
              <label className="block font-medium text-neutral/70">
                Tanggal Kelas Dimulai
              </label>
              <div className="flex mt-1 relative">
                <input
                  disabled
                  type="text"
                  value={formatDate(tanggalMulai)}
                  className="read-only:text-neutral/60 bg-neutral/5 p-2 pl-10 w-full rounded-md bg-gray-100 cursor-not-allowed"
                  readOnly
                />
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <CalendarIcon className="text-neutral/80" />
                </div>
              </div>
            </div>

            <div className="w-1/2 relative">
              <label className="block font-medium text-neutral/70">
                Tanggal Kelas Selesai
              </label>
              <div className="flex mt-1 relative">
                <input
                  disabled
                  type="text"
                  value={formatDate(tanggalSelesai)}
                  className="read-only:text-neutral/60 bg-neutral/5 p-2 pl-10 w-full rounded-md bg-gray-100 cursor-not-allowed"
                  readOnly
                />
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <CalendarIcon className="text-neutral/80" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center mr-4">
                <input
                  disabled
                  type="checkbox"
                  className="bg-base -mb-0.5 p-2 w-full border rounded-md"
                />
                <label className="block font-medium text-neutral/70 ml-0.5">
                  {day}
                </label>
              </div>
            ))}
          </div>

          <div>
            <label className="block font-medium text-neutral/70">Jam</label>
            <input
              disabled
              type="text"
              value="19:00"
              name="platform"
              className=" read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="flex flex-row gap-4">
            {!muridRendered &&
              (muridSelected.length > 2 ? (
                <>
                  <div className="w-1/2">
                    <label className="block font-medium text-neutral/70">
                      Murid Kelas
                    </label>
                    <div className="mt-1">
                      {/* Distribute elements between both columns */}
                      {muridSelected
                        .slice(0, Math.ceil(muridSelected.length / 2))
                        .map((murid, index) => (
                          <div
                            key={index}
                            className="flex items-center py-2 border-b"
                          >
                            <div className="w-8 h-8 rounded-full bg-neutral/5 mr-4"></div>
                            <input
                              key={index}
                              type="text"
                              value={murid.label}
                              className="flex-1 bg-transparent border-none cursor-not-allowed"
                              disabled
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="block font-medium text-neutral/70">
                      <br />
                    </label>
                    <div className="mt-1">
                      {/* Distribute elements between both columns */}
                      {muridSelected
                        .slice(Math.ceil(muridSelected.length / 2))
                        .map((murid, index) => (
                          <div
                            key={index}
                            className="flex items-center py-2 border-b"
                          >
                            <div className="w-8 h-8 rounded-full bg-neutral/5 mr-4"></div>
                            <input
                              key={index}
                              type="text"
                              value={murid.label}
                              className="flex-1 bg-transparent border-none cursor-not-allowed"
                              disabled
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-1/2">
                  <label className="block font-medium text-neutral/70">
                    Murid Kelas
                  </label>
                  <div className="mt-1">
                    {/* Display all elements in the first column */}

                    {muridSelected.map((murid, index) => (
                      <div
                        key={index}
                        className="flex items-center py-2 border-b"
                      >
                        <div className="w-8 h-8 rounded-full bg-neutral/5 mr-4"></div>
                        <input
                          key={index}
                          type="text"
                          value={murid.label}
                          className="flex-1 bg-transparent border-none cursor-not-allowed"
                          disabled
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          <div>
            <label className="block font-medium text-neutral/70">
              Platform
            </label>
            <input
              disabled
              type="text"
              value={platform}
              className="read-only:text-neutral/60 bg-neutral/5 mt-1 p-2 w-full rounded-md"
            />
          </div>
          {buttons}
        </div>
      </div>
    </div>
  );
};

export default DetailKelas;
