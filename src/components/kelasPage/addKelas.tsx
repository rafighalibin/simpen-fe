import React, { use, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useState } from "react";
import { Kelas } from "../../common/types/kelas";
import { Program } from "../../common/types/program";
import { JenisKelas } from "../../common/types/jenis";
import { set } from "react-hook-form";

export const AddKelas = () => {
    const [programId, setProgramId] = useState("");
    const [jenisKelasId, setJenisKelasId] = useState("");
    const [tanggalMulai, setTanggalMulai] = useState("");
    const [tanggalSelesai, setTanggalSelesai] = useState("");
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedTime, setSelectedTime] = useState("00:00");
    const [listJadwalKelas, setListJadwalKelas] = useState([]);
    const [jumlahPertemuan, setJumlahPertemuan] = useState(0);

    const queryClient = useQueryClient();

    const fetchWithToken = useFetchWithToken();

    const payload = {
        programId,
        jenisKelasId,
        listJadwalKelas,
        tanggalMulai,
        tanggalSelesai,
    };

    const { mutateAsync: addKelasMutation, data } = useMutation({
        mutationFn: () =>
            fetchWithToken("/kelas", "POST", payload).then((res) =>
                res.json()
            ),
        onSuccess: (data) => {
            console.log(data.content as Kelas);
        },
    });

    const [listProgram, setListProgram] = useState([]);

    const [listJenisKelas, setListJenisKelas] = useState([]);

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

    const [listBahasa, setListBahasa] = useState([]);
    const [listModePertemuan, setListModePertemuan] = useState([]);
    const [listTipe, setListTipe] = useState([]);

    const {
        isLoading: isLoadingJenisAttributes,
        data: dataJenisAttributes,
        refetch: getJenisAttributes,
    } = useQuery({
        queryKey: ["jenis", jenisKelasId],
        queryFn: () =>
            fetchWithToken(
                `/kelas/jenis/existing-attributes-detail?nama=${jenisKelasId}`,
                "GET"
            ).then((res) => res.json()),
        onSuccess: (data) => {
            const { bahasa, modaPertemuan, tipe } = data.content;
            setListBahasa(bahasa);
            setListModePertemuan(modaPertemuan);
            setListTipe(tipe);
        },
        enabled: !!jenisKelasId,
    });

    const {
        isLoading: isLoadingJenis,
        data: dataJenis,
        refetch: getJenisKelas,
    } = useQuery({
        queryKey: ["jenis", programId],
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

    const daysOfWeek = [
        { id: 0, name: "Sunday" },
        { id: 1, name: "Monday" },
        { id: 2, name: "Tuesday" },
        { id: 3, name: "Wednesday" },
        { id: 4, name: "Thursday" },
        { id: 5, name: "Friday" },
        { id: 6, name: "Saturday" },
    ];

    useEffect(() => {
        if (programId) {
            getJenisKelas();
        }
        if (jenisKelasId) {
            getJenisAttributes();
        }
    }, [programId, jenisKelasId]);

    useEffect(() => {
        generateClassDates();
    }, [selectedDays, selectedTime, tanggalMulai]);

    const handleDayChange = (dayId) => {
        const index = selectedDays.indexOf(dayId);
        if (index > -1) {
            setSelectedDays(selectedDays.filter((id) => id !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    // Function to generate dates based on selectedDays, starting date (tanggalMulai), and selectedTime
    const generateClassDates = () => {
        if (
            programId &&
            jenisKelasId &&
            tanggalMulai &&
            selectedDays.length > 0 &&
            selectedTime
        ) {
            const startDate = new Date(tanggalMulai);
            const classDates = [];
            const numMeetings = jumlahPertemuan; // Assuming jenisKelasId contains the number of meetings
            let meetingCounter = 0;
            let currentDate = new Date(startDate);
            
            // Loop until the required number of meetings are generated
            while (classDates.length < numMeetings) {
                const dayOfWeek = currentDate.getDay();
                if (selectedDays.includes(dayOfWeek)) {
                    const dateString = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate(),
                        parseInt(selectedTime.split(":")[0]),
                        parseInt(selectedTime.split(":")[1])
                    );
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
        console.log(listJadwalKelas);
    }, [listJadwalKelas]);

    return (
        <div>
            {isLoadingProgram || isLoadingJenis || isLoadingJenisAttributes ? (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            ) : null}
            <div className="max-w-md mx-auto mt-8">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await addKelasMutation();
                        queryClient.invalidateQueries("kelas");
                    }}
                    className="space-y-6"
                >
                    <div className="form-control">
                        <label className="label">
                            Program
                            <select
                                value={programId}
                                onChange={(e) => {
                                    setProgramId(e.target.value);
                                    setJumlahPertemuan(
                                        listProgram.find(
                                            (program) =>
                                                program.id ===
                                                e.target.value
                                        ).jumlahPertemuan
                                    )
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
                    </div>

                    <div className="form-control">
                        <label className="label">
                            Jenis
                            <select
                                value={jenisKelasId}
                                onChange={(e) => {
                                    setJenisKelasId(e.target.value);
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
                                        // Handle radio button change
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
                        <input />
                    </div>
                    <div className="form-control">
                        <label className="label">List Murid</label>
                        <input />
                    </div>
                    <div className="form-control">
                        <label className="label">Level</label>
                        <input />
                    </div>
                    <div className="form-control">
                        <label className="label">Platform</label>
                        <input />
                    </div>
                    <button type="submit" className="btn">
                        Add Lawyer
                    </button>
                </form>
            </div>
        </div>
    );
};
