import React, { use, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useState } from "react";
import { Kelas } from "../../common/types/kelas";
import { Program } from "../../common/types/program";
import { JenisKelas } from "../../common/types/jenis";
import useFetchPengajar from "../../common/hooks/user/useFetchPengajar";
import { PengajarSelect } from "../../common/types/pengajar";
import Select from "react-select";
import { MuridSelect } from "../../common/types/murid";
import { useRouter } from "next/navigation";


export const AddKelas = () => {
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

    const [pengajarSelected, setPengajarSelected] = useState<PengajarSelect>(null);
    const [pengajarId, setPengajarId] = useState("");

    const [listMuridExisting, setListMuridExisting] = useState<MuridSelect[]>([]);
    const listMuridExistingTemp: MuridSelect[] = [
        {
          value: "Student1",
          label: "Student1",
        },
        {
          value: "Student2",
          label: "Student2",
        },
        {
          value: "Student3",
          label: "Student3",
        },
        {
          value: "Student4",
          label: "Student4",
        },
      ];
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

    const fetchWithToken = useFetchWithToken();
    const { isLoading: listUserLoading, listPengajarExisting } = useFetchPengajar();
    const [listProgram, setListProgram] = useState([]);
    const [listJenisKelas, setListJenisKelas] = useState([]);
    const [listBahasa, setListBahasa] = useState([]);
    const [listModePertemuan, setListModePertemuan] = useState([]);
    const [listTipe, setListTipe] = useState([]);
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

    const { mutateAsync: addKelasMutation, data, error } = useMutation({
        mutationFn: () =>
            fetchWithToken("/kelas", "POST", payload).then((res) =>
                res.json()
            ),
        onSuccess: (data) => {
            console.log(data.content as Kelas);
            router.push("/kelas");
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const {
        isLoading: isLoadingProgram,
        data: dataProgram,
    } = useQuery({
        queryKey: ["program"],
        queryFn: () =>
            fetchWithToken("/kelas/program", "GET").then((res) => res.json()),
        onSuccess: (data) => {
            setListProgram(data.content);
        },
    });

    const {
        isLoading: isLoadingJenisAttributes,
        data: dataJenisAttributes,
        refetch: getJenisKelas,
    } = useQuery({
        queryKey: ["jenis", jenisKelas],
        queryFn: () =>
            fetchWithToken(
                `/kelas/jenis/find?nama=${jenisKelasNama}&modaPertemuan=${modaPertemuan}&bahasa=${bahasa}&tipe=${tipe}`,
                "GET"
            ).then((res) => res.json()),
        onSuccess: (data) => {
            console.log(data);
            setJenisKelas(data.content);
            setJenisKelasId(data.content.id);
        },
        enabled: !!jenisKelasNama && !!tipe && !!modaPertemuan && !!bahasa,
    });

    const {
        isLoading: isLoadingJenisKelas,
        data: dataJenisKelas,
        refetch: getJenisAttributes,
    } = useQuery({
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
            fetchWithToken(
                `/kelas/program/${programId}/jenis-kelas`,
                "GET"
            ).then((res) => res.json()),
        onSuccess: (data) => {
            setListJenisKelas(data.content);
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
                        const dateString = currentDate.toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                        }).replace(/\//g, '-').replace(',', '');
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
            if(jenisKelasId){
                console.log(jenisKelasId);
            }
        }, [jenisKelasId]);

        return (
            <div>
            {isLoadingProgram || isLoadingJenis || isLoadingJenisAttributes || listUserLoading ? (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            ) : null}
            <div className="max-w-md mx-auto mt-8">
                <form
                    onSubmit={(e) => {
                        console.log(payload);
                        e.preventDefault();
                        addKelasMutation();
                    }}
                    className="space-y-6"
                >
                    <div className="form-control">
                        <label className="label">
                            Program
                            <select
                                value={programId}
                                onChange={(e) => {
                                    const selectedProgramId = e.target.value;
                                    setProgramId(selectedProgramId);
                                    if (selectedProgramId) {
                                        setJumlahPertemuan(
                                            listProgram.find((program) => program.id === selectedProgramId).jumlahPertemuan
                                        );
                                        setJumlahLevel(
                                            listProgram.find((program) => program.id === selectedProgramId).jumlahLevel
                                        );
                                    } else {
                                        setJumlahPertemuan(0);
                                        setJumlahLevel(0);
                                    }
                                }}
                                className="input"
                            >
                                <option value="">Select a program</option>
                                {listProgram.map((program) => (
                                    <option
                                        key={program.id}
                                        value={program.id}
                                    >
                                        {program.nama}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Jumlah Pertemuan: {jumlahPertemuan}
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            Jenis
                            <select
                                value={jenisKelasNama}
                                onChange={(e) => {
                                    setJenisKelasNama(e.target.value);
                                }}
                                className="input"
                                disabled={programId === ""}
                            >
                                <option value="">Select a jenis</option>
                                {listJenisKelas.map((jenis) => (
                                    <option
                                        key={jenis.nama}
                                        value={jenis.nama}
                                    >
                                        {jenis.nama}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label">Bahasa</label>
                        {listBahasa.map((bahasaItem, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    name="bahasa"
                                    value={bahasaItem}
                                    onChange={(e) => {
                                        setBahasa(e.target.value);
                                    }}
                                />
                                <label>{bahasaItem}</label>
                            </div>
                        ))}
                    </div>

                    <div className="form-control">
                        <label className="label">Moda Pertemuan</label>
                        {listModePertemuan.map((modaItem, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    name="moda_pertemuan"
                                    value={modaItem}
                                    onChange={(e) => {
                                        // Handle radio button change
                                        setModaPertemuan(e.target.value);
                                    }}
                                />
                                <label>{modaItem}</label>
                            </div>
                        ))}
                    </div>

                    <div className="form-control">
                        <label className="label">Tipe</label>
                        {listTipe.map((tipeItem, index) => (
                            <div key={index}>
                                <input
                                    type="radio"
                                    name="tipe"
                                    value={tipeItem}
                                    onChange={(e) => {
                                        // Handle radio button change
                                        setTipe(e.target.value);
                                    }}
                                />
                                <label>{tipeItem}</label>
                            </div>
                        ))}
                    </div>

                    <div className="form-control">
                        <label className="label">Days of the Week</label>
                        {daysOfWeek.map((day) => (
                            <div key={day.id}>
                                <input
                                    type="checkbox"
                                    id={`day-${day.id}`}
                                    value={day.id}
                                    checked={selectedDays.includes(day.id)}
                                    onChange={() => handleDayChange(day.id)}
                                />
                                <label htmlFor={`day-${day.id}`}>
                                    {day.name}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="form-control">
                        <label className="label">Time</label>
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) =>
                                setSelectedTime(e.target.value)
                            }
                            className="input"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">Tanggal Mulai</label>
                        <input
                            type="date"
                            value={tanggalMulai}
                            onChange={(e) => 
                                setTanggalMulai(e.target.value)
                            }
                            className="input"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">Tanggal Selesai</label>
                        <input
                            type="date"
                            value={tanggalSelesai}
                            onChange={(e) =>
                                setTanggalSelesai(e.target.value)
                            }
                            className="input"
                            disabled={true}
                        />
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
                                setPengajarSelected(e)
                                setPengajarId(e.value)
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
                            options={listMuridExistingTemp}
                            className="bg-base mt-1 p-2 w-full border rounded-md"
                            classNamePrefix="select"
                            styles={{
                            control: (provided) => ({
                                ...provided,
                                border: "none", // Remove border
                                boxShadow: "none", // Remove box shadow
                                backgroundColor: "none", // Match platform input background color
                            }),
                            multiValue: (provided) => ({
                                ...provided,
                                backgroundColor: "#EDF6FF", // Match platform input background color
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

                    <button type="submit" className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover">
                        Buat Kelas
                    </button>
                </form>
            </div>
        </div>
    );
};
