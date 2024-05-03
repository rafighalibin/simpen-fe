import React, { use, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useState } from "react";
import { useAuthContext } from "../../common/utils/authContext";
import { useRouter } from "next/navigation";
import { ReadFee } from "../../common/types/fee";
import { Program } from "../../common/types/program";
import { JenisKelas } from "../../common/types/jeniskelas";
import Select from "react-select";
import { InterReguler } from "../../font/font";


export const AddPayroll = () => {
    const queryClient = useQueryClient();
    const fetchWithToken = useFetchWithToken();
    const { pengguna } = useAuthContext();

    const router = useRouter();

    const [jenisKelas, setJenisKelas] = useState("");
    const [program, setProgram] = useState("");
    const [baseFee, setBaseFee] = useState(null);
    const [studentMultiplier, setStudentMultiplier] = useState(null);
    const [maxStudents, setMaxStudents] = useState(null);

    const [listProgram, setListProgram] = useState([]);
    const [listJenisKelas, setListJenisKelas] = useState([]);

    const [jenisKelasNama, setJenisKelasNama] = useState("");

    const [listBahasa, setListBahasa] = useState([]);
    const [listModePertemuan, setListModePertemuan] = useState([]);
    const [listTipe, setListTipe] = useState([]);

    const [bahasa, setBahasa] = useState("");
    const [modaPertemuan, setModaPertemuan] = useState("");
    const [tipe, setTipe] = useState("");

    const payload = {
        jenisKelas,
        program,
        baseFee,
        studentMultiplier,
        maxStudents,
    };

    const { mutateAsync: addPayrollMutation, data, error } = useMutation({
        mutationFn: () => 
            fetchWithToken("/payroll/fee","POST", payload).then((res) => res.json()),
        onSuccess: (data) => {
            console.log("Success")
            console.log(data);
            if(data.content===null){
                alert("Payroll fee addition failed");
            }
            else{
                router.push("/payroll");
                queryClient.invalidateQueries("fee");
            }
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

      const {isLoading: isLoadingJenis, data: dataListJenisKelas, refetch: getListJenisKelas,} = useQuery({
        queryKey: ["listJenis", program],
        queryFn: () =>
          fetchWithToken(`/kelas/program/${program}/jenis-kelas`, "GET").then(
            (res) => res.json()
          ),
        onSuccess: (data) => {
          const listJenisKelasTemp = data.content.map((jenis: JenisKelas) => ({
            value: jenis.id,
            label: jenis.nama,
          }));
          setListJenisKelas(listJenisKelasTemp);
        },
        enabled: !!program,
      });

      const payloadExistingAttributes = {
        namaJenisKelas: jenisKelasNama,
        programId: program,
      };
    
      const {isLoading: isLoadingJenisKelas, data: dataJenisKelas, refetch: getJenisAttributes,} = useQuery({
        queryKey: ["jenis", jenisKelasNama],
        queryFn: () =>
          fetchWithToken(
            `/kelas/jenis/existing-attributes-detail`,
            "POST",
            payloadExistingAttributes
          ).then((res) => res.json()),
        onSuccess: (data) => {
          setListBahasa(data.content.bahasa);
          setListModePertemuan(data.content.modaPertemuan);
          setListTipe(data.content.tipe);
        },
        enabled: !!jenisKelasNama,
      });

      useEffect(() => {
        if (program) {
          getListJenisKelas();
        }
        if (jenisKelasNama) {
          getJenisAttributes();
        }
      }, [program, jenisKelasNama]);

      const payloadJenis = {
        nama: jenisKelasNama,
        tipe: tipe,
        bahasa : bahasa,
        modaPertemuan: modaPertemuan,
      };
    
      const {isLoading: isLoadingJenisAttributes, data: dataJenisAttributes, refetch: getJenisKelas,} = useQuery({
        queryKey: ["jenis", jenisKelas],
        queryFn: () =>
          fetchWithToken(
            `/kelas/jenis/find`,
            "POST",
            payloadJenis
          ).then((res) => res.json()),
        onSuccess: (data) => {
          const jenisKelas = data.content as JenisKelas;
          setJenisKelas(jenisKelas.id);
        },
        enabled: !!jenisKelasNama && !!tipe && !!modaPertemuan && !!bahasa,
      });

      useEffect(() => {
        if (bahasa && tipe && modaPertemuan) {
          getJenisKelas();
        }
      }, [bahasa, tipe, modaPertemuan]);


      const handleChangeProgram = (e) => {
        const selectedProgramId = e.value;
        setProgram(selectedProgramId);
      }

      const handleChangeJenisKelas = (e) => {
        setJenisKelasNama(e.label);
        setJenisKelas(e.value);
      }

      return (
        <div>
            {isLoadingProgram ||
            isLoadingJenis ||
            isLoadingJenisAttributes ? (
                <div className="loading-overlay">
                <div className="spinner"></div>
                </div>
            ) : null}
            <div className="flex flex-col space-y-8 my-10">
                <h1 className=" flex justify-center text-6xl font-bold text-neutral/100 ">
                    Tambah Fee
                </h1>
                <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-lg rounded-lg border">
                    <form
                        onSubmit={(e) => {
                            console.log(payload);
                            e.preventDefault();
                            addPayrollMutation();
                        }}
                        className="space-y-4"
                    >
                      {/* <div className="mt-5">
                        {succces && (
                          <div
                            className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2"
                            style={InterReguler.style}
                          >
                            {succces}
                          </div>
                        )}
                        {error && (
                          <div
                            className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2"
                            style={InterReguler.style}
                          >
                            {error}
                          </div>
                        )}
                      </div> */}
                      <div>
                        <label className="block font-medium text-neutral/70">
                            Program
                        </label>
                        <Select
                            required
                            defaultValue={program}
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
                      <label className="block font-medium text-neutral/70">
                        Jenis
                      </label>
                      <Select
                        required
                        defaultValue={jenisKelasNama}
                        isDisabled={program === ""}
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
                              required
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
                              required
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
                        <label className="label mr-4 block font-medium text-neutral/70">Tipe</label>
                        {listTipe.map((tipeItem, index) => (
                          <div key={index} className="flex items-center mr-4">
                            <input
                              required
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
                      <div>
                      <label className="block font-medium text-neutral/70">
                        Fee Dasar
                      </label>
                      <input
                        required
                        type="text"
                        value={baseFee}
                        name="Base Fee"
                        onChange={(e) => setBaseFee(Number(e.target.value))}
                        className="bg-base mt-1 p-2 w-full border rounded-md"
                        min={0}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;
                          input.value = input.value.replace(/[^0-9]/g, ""); // Menghapus karakter selain angka
                        }}
                      />
                      </div>
                      <div>
                      <label className="block font-medium text-neutral/70">
                        Student Multiplier
                      </label>
                      <input
                        required
                        type="text"
                        value={studentMultiplier}
                        name="Student Multiplier"
                        onChange={(e) => setStudentMultiplier(Number(e.target.value))}
                        className="bg-base mt-1 p-2 w-full border rounded-md"
                        min={0}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;
                          input.value = input.value.replace(/[^0-9]/g, ""); // Menghapus karakter selain angka
                        }}
                      />
                      </div>
                      <div>
                      <label className="block font-medium text-neutral/70">
                        Max Student
                      </label>
                      <input
                        required
                        type="text"
                        value={maxStudents}
                        name="Base Fee"
                        onChange={(e) => setMaxStudents(Number(e.target.value))}
                        className="bg-base mt-1 p-2 w-full border rounded-md"
                        min={0}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;
                          input.value = input.value.replace(/[^0-9]/g, ""); // Menghapus karakter selain angka
                        }}
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
}