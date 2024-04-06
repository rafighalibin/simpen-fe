import React, { use, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../../../common/hooks/fetchWithToken";
import { useState } from "react";
import { Kelas } from "../../../../common/types/kelas";
import { Program } from "../../../../common/types/program";
import { JenisKelas } from "../../../../common/types/jenis";
import useFetchPengajar from "../../../../common/hooks/user/useFetchPengajar";
import { PengajarSelect } from "../../../../common/types/pengajar";
import Select from "react-select";
import { MuridDetail, MuridSelect } from "../../../../common/types/murid";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../../../common/utils/authContext";

const AddKelas = () => {
  const queryClient = useQueryClient();
  const fetchWithToken = useFetchWithToken();
  const { pengguna } = useAuthContext();

  const router = useRouter();

  const [programId, setProgramId] = useState("");
  const [jumlahPertemuan, setJumlahPertemuan] = useState(0);
  const [jumlahLevel, setJumlahLevel] = useState(0);

  const [bahasa, setBahasa] = useState("");
  const [modaPertemuan, setModaPertemuan] = useState("");
  const [tipe, setTipe] = useState("");
  const [jenisKelasNama, setJenisKelasNama] = useState("");
  const [jenisKelas, setJenisKelas] = useState<JenisKelas>(null);
  const [jenisKelasId, setJenisKelasId] = useState("");

  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTime, setSelectedTime] = useState("00:00");
  const [listJadwalKelas, setListJadwalKelas] = useState([]);

  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");

  const [pengajarSelected, setPengajarSelected] =
    useState<PengajarSelect>(null);
  const [pengajarId, setPengajarId] = useState("");

  const [muridSelected, setMuridSelected] = useState<MuridSelect[]>([]);
  const [muridValues, setMuridValues] = useState([]);

  const [level, setLevel] = useState(0);
  const [platform, setPlatform] = useState("");
  const [linkGroup, setLinkGroup] = useState("");

  const payload = {
    programId,
    jenisKelasId,
    jadwalKelas: listJadwalKelas,
    tanggalMulai,
    tanggalSelesai,
    pengajarId,
    listMurid: muridValues,
    level,
    platform,
    linkGroup,
  };

  const { isLoading: listUserLoading, listPengajarExisting } =
    useFetchPengajar();
  const [listProgram, setListProgram] = useState([]);
  const [listJenisKelas, setListJenisKelas] = useState([]);
  const [listBahasa, setListBahasa] = useState([]);
  const [listModePertemuan, setListModePertemuan] = useState([]);
  const [listTipe, setListTipe] = useState([]);
  const [listMuridExisting, setListMuridExisting] = useState([]);
  const daysOfWeek = [
    { id: 0, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];

  const handleChangeMurid = (e) => {
    const murid = e.map((e) => e.value);
    setMuridSelected(e);
    setMuridValues(murid);
  };

  const { mutateAsync: addKelasMutation, data, error} = useMutation({
    mutationFn: () =>
      fetchWithToken("/kelas", "POST", payload).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data.content as Kelas);
      router.push("/kelas");
      queryClient.invalidateQueries("kelas");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { isLoading: isLoadingProgram, data: dataProgram } = useQuery({
    queryKey: ["program"],
    queryFn: () =>
      fetchWithToken("/kelas/program", "GET").then((res) => res.json()),
    onSuccess: (data) => {
      const listProgramTemp = data.content.map((program: Program) => ({
        value: program.id,
        label: program.nama,
        jumlahPertemuan: program.jumlahPertemuan,
        jumlahLevel: program.jumlahLevel,
      }));
      setListProgram(listProgramTemp);
    },
  });

  const {} = useQuery({
    queryKey: ["listMurid"],
    queryFn: () => fetchWithToken("/murid").then((res) => res.json()),
    onSuccess: (listMurid) => {
      let murid = listMurid.content.map((murid: MuridDetail) => ({
        value: murid.id,
        label: murid.nama,
      }));
      setListMuridExisting(murid);
    },
  });

  const {isLoading: isLoadingJenisAttributes, data: dataJenisAttributes, refetch: getJenisKelas,} = useQuery({
    queryKey: ["jenis", jenisKelas],
    queryFn: () =>
      fetchWithToken(
        `/kelas/jenis/find?nama=${jenisKelasNama}&modaPertemuan=${modaPertemuan}&bahasa=${bahasa}&tipe=${tipe}`,
        "GET"
      ).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data);
      const jenisKelas = data.content as JenisKelas;
      setJenisKelas(jenisKelas);
      setJenisKelasId(jenisKelas.id);
    },
    enabled: !!jenisKelasNama && !!tipe && !!modaPertemuan && !!bahasa,
  });

  const {isLoading: isLoadingJenisKelas, data: dataJenisKelas, refetch: getJenisAttributes,} = useQuery({
    queryKey: ["jenis", jenisKelasNama],
    queryFn: () =>
      fetchWithToken(
        `/kelas/jenis/existing-attributes-detail?nama=${jenisKelasNama}`,
        "GET"
      ).then((res) => res.json()),
    onSuccess: (data) => {
      setListBahasa(data.content.bahasa);
      setListModePertemuan(data.content.modaPertemuan);
      setListTipe(data.content.tipe);
    },
    enabled: !!jenisKelasNama,
  });

  const {
    isLoading: isLoadingJenis,
    data: dataListJenisKelas,
    refetch: getListJenisKelas,
  } = useQuery({
    queryKey: ["listJenis", programId],
    queryFn: () =>
      fetchWithToken(`/kelas/program/${programId}/jenis-kelas`, "GET").then(
        (res) => res.json()
      ),
    onSuccess: (data) => {
      const listJenisKelasTemp = data.content.map((jenis: JenisKelas) => ({
        value: jenis.id,
        label: jenis.nama,
      }));
      setListJenisKelas(listJenisKelasTemp);
    },
    enabled: !!programId,
  });

  const handleDayChange = (dayId) => {
    const index = selectedDays.indexOf(dayId);
    if (index > -1) {
      setSelectedDays(selectedDays.filter((id) => id !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const generateClassDates = () => {
    if (
      programId &&
      jenisKelasNama &&
      tanggalMulai &&
      selectedDays.length > 0 &&
      selectedTime
    ) {
      const startDate = new Date(tanggalMulai);
      const classDates = [];
      const numMeetings = jumlahPertemuan;
      let currentDate = new Date(startDate);

      // Loop until the required number of meetings are generated
      while (classDates.length < numMeetings) {
        const dayOfWeek = currentDate.getDay();
        if (selectedDays.includes(dayOfWeek)) {
          // Format the date string as "YYYY-MM-DD HH:mm:ss"
          const dateString = currentDate
            .toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
            .replace(/\//g, "-")
            .replace(",", "");
          classDates.push(dateString);
        }
        if (classDates.length === numMeetings) {
          setTanggalSelesai(currentDate.toISOString().split("T")[0]);
        }
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
      setListJadwalKelas(classDates);
    }
  };

  useEffect(() => {
    generateClassDates();
  }, [selectedDays, selectedTime, tanggalMulai]);

  useEffect(() => {
    if (programId) {
      getListJenisKelas();
    }
    if (jenisKelasNama) {
      getJenisAttributes();
    }
  }, [programId, jenisKelasNama]);

  useEffect(() => {
    generateClassDates();
  }, [selectedDays, selectedTime, tanggalMulai]);

  useEffect(() => {
    if (bahasa && tipe && modaPertemuan) {
      getJenisKelas();
    }
  }, [bahasa, tipe, modaPertemuan]);

  useEffect(() => {
    if (jenisKelasId) {
      console.log(jenisKelasId);
    }
  }, [jenisKelasId]);

  const handleChangeProgram = (e) => {
    const selectedProgramId = e.value;
    console.log(e);
    setProgramId(selectedProgramId);
    if (selectedProgramId) {
      setJumlahPertemuan(e.jumlahPertemuan);
      setJumlahLevel(e.jumlahLevel);
    } else {
      setJumlahPertemuan(0);
      setJumlahLevel(0);
    }
  }

  const handleChangeJenisKelas = (e) => {
    setJenisKelasNama(e.label);
    setJenisKelasId(e.value);
  }

  return (
    <div>
      {isLoadingProgram ||
      isLoadingJenis ||
      isLoadingJenisAttributes ||
      listUserLoading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      ) : null}
      <div className="flex flex-col space-y-8 my-10">
        <h1 className=" flex justify-center text-6xl font-bold text-neutral/100 ">
          Tambah Kelas
        </h1>
        <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg border">
            <form
              onSubmit={(e) => {
                console.log(payload);
                e.preventDefault();
                addKelasMutation();
              }}
              className="space-y-6"
            >
            <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block font-medium text-neutral/70">
                Program
              </label>
              <Select
                defaultValue={programId}
                name="colors"
                onChange={handleChangeProgram}
                options={listProgram}
                className="bg-base mt-1 p-1 w-full border rounded-md"
                classNamePrefix="select"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "none",
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: "#EDF6FF",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? "#215E9B"
                      : provided.backgroundColor,
                    color: state.isSelected ? "white" : provided.color,
                    fontWeight: state.isSelected ? "bold" : provided.fontWeight,
                  }),
                }}
                />
            </div>
            <div>
              <label>Jumlah Pertemuan</label>
              <input
                disabled
                placeholder={jumlahPertemuan.toString()}
                onChange={(e) => setJumlahPertemuan(parseInt(e.target.value))}
                className={`appearance-none relative block w-full px-3 py-3 mt-1 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              />
            </div>
          </div>

          <div className="">
            <label className="block font-medium text-neutral/70">
              Jenis
            </label>
            <Select
              defaultValue={jenisKelasNama}
              isDisabled={programId === ""}
              name="colors"
              onChange={handleChangeJenisKelas}
              options={listJenisKelas}
              className="bg-base mt-1 p-1 w-full border rounded-md"
              classNamePrefix="select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  border: "none",
                  boxShadow: "none",
                  backgroundColor: "none",
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#EDF6FF",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#215E9B"
                    : provided.backgroundColor,
                  color: state.isSelected ? "white" : provided.color,
                  fontWeight: state.isSelected ? "bold" : provided.fontWeight,
                }),
              }}
            />
          </div>

          <div className="form-control flex flex-wrap items-center">
            <label className="label mr-4 block font-medium text-neutral/70">Bahasa</label>
            {listBahasa.map((bahasaItem, index) => (
              <div key={index} className="flex items-center mr-4">
                <input
                  type="radio"
                  name="bahasa"
                  value={bahasaItem}
                  onChange={(e) => {
                    setBahasa(e.target.value);
                  }}
                  className="mr-1"
                />
                <label className="mr-1 block font-medium text-neutral/70">
                  {jenisKelasNama === "" ? "Select Bahasa" : bahasaItem}
                </label>
              </div>
            ))}
          </div>

          <div className="form-control flex flex-wrap items-center">
            <label className="label mr-4 block font-medium text-neutral/70">Moda Pertemuan</label>
            {listModePertemuan.map((modaItem, index) => (
              <div key={index} className="flex items-center mr-4">
                <input
                  type="radio"
                  name="moda_pertemuan"
                  value={modaItem}
                  onChange={(e) => {
                    setModaPertemuan(e.target.value);
                  }}
                  className="mr-1"
                />
                <label className="mr-1 block font-medium text-neutral/70">
                {jenisKelasNama === "" ? "Select Jenis Kelas" : modaItem}
                </label>
              </div>
            ))}
          </div>

          <div className="form-control flex flex-wrap items-center">
            <label className="label mr-4 block font-medium text-neutral/70">Tipe:</label>
            {listTipe.map((tipeItem, index) => (
              <div key={index} className="flex items-center mr-4">
                <input
                  type="radio"
                  name="tipe"
                  value={tipeItem}
                  onChange={(e) => {
                    setTipe(e.target.value);
                  }}
                  className="mr-1"
                  disabled={jenisKelasNama === ""}
                />
                <label className="mr-1 block font-medium text-neutral/70">
                {jenisKelasNama === "" ? "Select Tipe Kelas" : tipeItem}
                  </label>
              </div>
            ))}
          </div>

          <div className="form-control flex flex-row">
            <label className="label mr-4 block font-medium text-neutral/70">Hari:</label>
            {daysOfWeek.map((day) => (
              <div key={day.id} className="flex items-center mr-4">
                <input
                  type="checkbox"
                  id={`day-${day.id}`}
                  value={day.id}
                  checked={selectedDays.includes(day.id)}
                  onChange={() => handleDayChange(day.id)}
                  className="bg-base -mb-0.5 p-2 w-full border rounded-md mr-1"
                />
                <label
                  htmlFor={`day-${day.id}`} className="block font-medium text-neutral/70">{day.name}</label>
              </div>
            ))}
          </div>

          <div className="form-control">
            <label className="label">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="relative">
                <label className="block font-medium text-neutral/70">
                  Tanggal Kelas Dimulai
                </label>
                <div className="flex mt-1 relative">
                  <input
                    type="date"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="bg-base mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block font-medium text-neutral/70">
                  Tanggal Kelas Selesai
                </label>
                <div className="flex mt-1 relative">
                  <input
                    type="date"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="bg-base mt-1 p-2 w-full border rounded-md"
                    disabled={true}
                  />
                </div>
              </div>
          </div>

          {/* Display generated class dates */}
          <div className="form-control">
            <label className="label">List Jadwal Kelas</label>
            {listJadwalKelas.map((classDate, index) => (
              <div key={index}>{classDate.toString()}</div>
            ))}
          </div>

          <div className="form-control">
            <label className="label">Pengajar</label>
            <Select
              defaultValue={pengajarSelected}
              name="colors"
              onChange={(e) => {
                setPengajarSelected(e);
                setPengajarId(e.value);
              }}
              options={listPengajarExisting}
              className="bg-base mt-1 p-2 w-full border rounded-md"
              classNamePrefix="select"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  border: "none", // Remove border
                  boxShadow: "none", // Remove box shadow
                  backgroundColor: "none", // Match platform input background color
                }),
                multiValue: (provided) => ({
                  ...provided,
                  backgroundColor: "#EDF6FF", // Match platform input background color
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#215E9B"
                    : provided.backgroundColor, // Change background color for selected option
                  color: state.isSelected ? "white" : provided.color, // Change text color for selected option
                  fontWeight: state.isSelected ? "bold" : provided.fontWeight, // Change font weight for selected option
                }),
              }}
            />
          </div>
          <div className="form-control">
            <label className="label">List Murid</label>
            <Select
                defaultValue={muridSelected}
                isMulti
                name="colors"
                onChange={handleChangeMurid}
                options={listMuridExisting}
                className="bg-base mt-1 p-1 w-full border rounded-md"
                classNamePrefix="select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: "none",
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: "#EDF6FF",
                  }),
                }}
              />
          </div>
          <div className="form-control">
            <label className="label">Level</label>
            <select
              value={level.toString()}
              onChange={(e) => setLevel(parseInt(e.target.value))}
              className="input"
            >
              <option value="0">Select Level</option>
              {Array.from({ length: jumlahLevel }, (_, i) => (
                <option key={i} value={(i + 1).toString()}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">Platform</label>
            <input
              type="text"
              className="input"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">Link Group</label>
            <input
              type="text"
              className="input"
              value={linkGroup}
              onChange={(e) => setLinkGroup(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover"
          >
            Buat Kelas
          </button>
            </form>
              </div>
            </div>
        
      </div>
  );
};

export default AddKelas;
