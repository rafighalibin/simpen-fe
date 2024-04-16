"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";


//import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./addJenisKelasForm.module.css";

//import component
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import useFetchAllUsers from "../../common/hooks/user/useFetchAllUser";
import { JenisKelas } from "../../common/types/jeniskelas";

export const AddJenisKelasForm = () => {
  const fetchWithToken = useFetchWithToken();
  const { listAllUser } = useFetchAllUsers();
  listAllUser.filter(user => user.role === 'akademik');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [formState, setFormState] = useState({
    nama: "",
    modaPertemuan: [],
    tipe: [],
    bahasa: [],
    picAkademikId: ""
  });
  const [formStateFetched, setFormStateFetched] = useState({
    modaPertemuanFetched: [],
    tipeFetched: [],
    bahasaFetched: []
  });
  const [customModaPertemuan, setCustomModaPertemuan] = useState({
    enabled: false,
    value: '',
  });
  const [customBahasa, setCustomBahasa] = useState({
    enabled: false, // Whether the custom bahasa option is selected
    value: '', // The value of the custom bahasa
  });
  const [customTipe, setCustomTipe] = useState({
    enabled: false,
    value: '',
  });

  useEffect(() => {
    const fetchExistingAttributes = async () => {
      try {
        const response = await fetchWithToken('/kelas/jenis/existing-attributes');
        const data = await response.json();
        // Update the form state with the existing attributes
        setFormStateFetched((prevState) => ({
          ...prevState,
          modaPertemuanFetched: data.content.modaPertemuan || [],
          tipeFetched: data.content.tipe || [],
          bahasaFetched: data.content.bahasa || [],
        }));
      } catch (error) {
        setError("Failed to fetch existing attributes");
      }
    };
  
    fetchExistingAttributes();
  }, []);
  

  const { mutateAsync: addJenisKelasMutation, data: response } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/jenis`, "POST", formState).then((res) => res.json()),
    onSuccess: (data) => {
      if (data.code == 200) {
        console.log(data.content as JenisKelas);
        setSuccess("Sukses menambahkan.");
        setTimeout(() => {
          router.push("/kelas/jenis");
        }, 1000);
      } else if (data.code == 400) {
        setError("Jenis Kelas sudah pernah ada atau terjadi kesalahan.");
        console.error("Error:", error);
      }
    },
  });

  const handleModaPertemuanChange = (e) => {
    if (e.target.checked) {
      if (!formState.modaPertemuan.includes(e.target.value)) {
        setFormState({
          ...formState,
          modaPertemuan: [...formState.modaPertemuan, e.target.value],
        });
      }
    } else {
      setFormState({
        ...formState,
        modaPertemuan: formState.modaPertemuan.filter((m) => m !== e.target.value),
      });
    }
  };
  
  // Custom ModaPertemuan Checkbox onChange
  const handleCustomModaPertemuanCheckboxChange = (e) => {
    const isEnabled = e.target.checked;
    setCustomModaPertemuan(prev => ({ ...prev, enabled: isEnabled }));

    setFormState(prevState => {
      let newModaPertemuan = [...prevState.modaPertemuan];
      // Remove previous custom ModaPertemuan if unchecking
      if (!isEnabled) {
        newModaPertemuan = prevState.modaPertemuan.filter(b => b !== customModaPertemuan.value);
      }
      // Add custom ModaPertemuan if checking and it's not empty (avoiding duplicates)
      else if (isEnabled && customModaPertemuan.value && !prevState.modaPertemuan.includes(customModaPertemuan.value)) {
        newModaPertemuan = [...prevState.modaPertemuan, customModaPertemuan.value.trim()];
      }
      return { ...prevState, modaPertemuan: newModaPertemuan };
    });
  };

  // Custom ModaPertemuan Text Input onChange
  const handleCustomModaPertemuanInputChange = (e) => {
    const newValue = e.target.value.toUpperCase();
    // Update customModaPertemuan state
    setCustomModaPertemuan(prev => ({ ...prev, value: newValue }));

    // Update formState if the custom ModaPertemuan checkbox is enabled
    if (customModaPertemuan.enabled) {
      setFormState(prevState => {
        // Remove old custom ModaPertemuan value and add the new one
        const newModaPertemuan = prevState.modaPertemuan.filter(b => b !== customModaPertemuan.value).concat(newValue.trim());
        return { ...prevState, modaPertemuan: newModaPertemuan };
      });
    }
  };

  const handleBahasaChange = (e) => {
    if (e.target.checked) {
      if (!formState.bahasa.includes(e.target.value)) {
        setFormState({
          ...formState,
          bahasa: [...formState.bahasa, e.target.value],
        });
      }
    } else {
      setFormState({
        ...formState,
        bahasa: formState.bahasa.filter((m) => m !== e.target.value),
      });
    }
  };

  // Custom Bahasa Checkbox onChange
  const handleCustomBahasaCheckboxChange = (e) => {
    const isEnabled = e.target.checked;
    setCustomBahasa(prev => ({ ...prev, enabled: isEnabled }));

    setFormState(prevState => {
      let newBahasa = [...prevState.bahasa];
      // Remove previous custom Bahasa if unchecking
      if (!isEnabled) {
        newBahasa = prevState.bahasa.filter(b => b !== customBahasa.value);
      }
      // Add custom Bahasa if checking and it's not empty (avoiding duplicates)
      else if (isEnabled && customBahasa.value && !prevState.bahasa.includes(customBahasa.value)) {
        newBahasa = [...prevState.bahasa, customBahasa.value.trim()];
      }
      return { ...prevState, bahasa: newBahasa };
    });
  };

  // Custom Bahasa Text Input onChange
  const handleCustomBahasaInputChange = (e) => {
    const newValue = e.target.value.toUpperCase();
    // Update customBahasa state
    setCustomBahasa(prev => ({ ...prev, value: newValue }));

    // Update formState if the custom Bahasa checkbox is enabled
    if (customBahasa.enabled) {
      setFormState(prevState => {
        // Remove old custom Bahasa value and add the new one
        const newBahasa = prevState.bahasa.filter(b => b !== customBahasa.value).concat(newValue.trim());
        return { ...prevState, bahasa: newBahasa };
      });
    }
  };

  const handleTipeChange = (e) => {
    if (e.target.checked) {
      if (!formState.tipe.includes(e.target.value)) {
        setFormState({
          ...formState,
          tipe: [...formState.tipe, e.target.value],
        });
      }
    } else {
      setFormState({
        ...formState,
        tipe: formState.tipe.filter((m) => m !== e.target.value),
      });
    }
  };
  
  // Custom Tipe Checkbox onChange
  const handleCustomTipeCheckboxChange = (e) => {
    const isEnabled = e.target.checked;
    setCustomTipe(prev => ({ ...prev, enabled: isEnabled }));

    setFormState(prevState => {
      let newTipe = [...prevState.tipe];
      // Remove previous custom Tipe if unchecking
      if (!isEnabled) {
        newTipe = prevState.tipe.filter(b => b !== customTipe.value);
      }
      // Add custom Tipe if checking and it's not empty (avoiding duplicates)
      else if (isEnabled && customTipe.value && !prevState.tipe.includes(customTipe.value)) {
        newTipe = [...prevState.tipe, customTipe.value.trim()];
      }
      return { ...prevState, tipe: newTipe };
    });
  };

  // Custom Tipe Text Input onChange
  const handleCustomTipeInputChange = (e) => {
    const newValue = e.target.value.toUpperCase();
    // Update customTipe state
    setCustomTipe(prev => ({ ...prev, value: newValue }));

    // Update formState if the custom Tipe checkbox is enabled
    if (customTipe.enabled) {
      setFormState(prevState => {
        // Remove old custom Tipe value and add the new one
        const newTipe = prevState.tipe.filter(b => b !== customTipe.value).concat(newValue.trim());
        return { ...prevState, tipe: newTipe };
      });
    }
  };

  const handleSubmit = async (e) => {
    if (window.confirm("Are you sure you want to add this jenis kelas?")) {
      e.preventDefault();
      await addJenisKelasMutation();
    }
  };

  return (
    <div className="">
      <div
        className={`${styles.heading} text-center my-10`}
        style={PoppinsBold.style}
      >
        Tambah Jenis Kelas
      </div>
      <div
        className={`${styles.card_form} sm:px-7 sm:py-8 sm:mb-12 px-5 py-4 mb-8`}
      >
        <form onSubmit={handleSubmit}>
          <div>
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Nama Jenis Kelas
            </div>
            <input
              id="nama-jenis-kelas"
              name="jenis-kelas"
              type="jenis-kelas"
              autoComplete="jenis-kelas"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Nama Jenis Kelas"
              value={formState.nama}
              onChange={(e) =>
                setFormState({ ...formState, nama: e.target.value })
              }
              style={InterReguler.style}
            />
          </div>
          <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Moda
            </div>
            <div>
              {formStateFetched.modaPertemuanFetched.map((moda, index) => (
                <div key={index} className="flex items-center">
                  <input
                    id={moda}
                    name="modaPertemuan"
                    type="checkbox"
                    value={moda}
                    onChange={handleModaPertemuanChange}
                    className="mr-2"
                  />
                  <label htmlFor={moda}>{moda}</label>
                </div>
              ))}
            </div>
            <div className="flex items-center">
                <input
                  id="customModaPertemuan"
                  name="customModaPertemuan"
                  type="checkbox"
                  checked={customModaPertemuan.enabled}
                  onChange={handleCustomModaPertemuanCheckboxChange} // Updated to use the new handler
                  className="mr-2"
                />
                <label htmlFor="customModaPertemuan">OTHER: </label>
                {customModaPertemuan.enabled && (
                  <input
                    type="text"
                    placeholder="Enter custom moda"
                    value={customModaPertemuan.value}
                    onChange={handleCustomModaPertemuanInputChange} // Ensure this handler is used
                    className="ml-2"
                  />
                )}
              </div>
              <div
                style={InterReguler.style}
                className={`${styles.form_paragraph} mt-2`}
              >
                Moda adalah identifier platform daring atau luring (cth: online atau offline).
              </div>
            </div>
            <div className="mt-8">
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-3`}
            >
              Tipe
            </div>
            <div>
              {formStateFetched.tipeFetched.map((tipe, index) => (
                <div key={index} className="flex items-center">
                  <input
                    id={tipe}
                    name="tipe"
                    type="checkbox"
                    value={tipe}
                    onChange={handleTipeChange}
                    className="mr-2"
                  />
                  <label htmlFor={tipe}>{tipe}</label>
                </div>
              ))}
            </div>
            <div className="flex items-center">
                <input
                  id="customTipe"
                  name="customTipe"
                  type="checkbox"
                  checked={customTipe.enabled}
                  onChange={handleCustomTipeCheckboxChange} // Updated to use the new handler
                  className="mr-2"
                />
                <label htmlFor="customTipe">OTHER: </label>
                {customTipe.enabled && (
                  <input
                    type="text"
                    placeholder="Enter custom tipe"
                    value={customTipe.value}
                    onChange={handleCustomTipeInputChange} // Ensure this handler is used
                    className="ml-2"
                  />
                )}
              </div>
              <div
                style={InterReguler.style}
                className={`${styles.form_paragraph} mt-2`}
              >
                Tipe adalah identifier banyaknya peserta kelas (cth: reguler atau private).
              </div>
            </div>
            <div className="mt-8">
              <div
                style={InterMedium.style}
                className={`${styles.form_title} mb-3`}
              >
                Bahasa
              </div>
              <div>
              {formStateFetched.bahasaFetched.map((bahasa, index) => (
                <div key={index} className="flex items-center">
                  <input
                    id={bahasa}
                    name="bahasa"
                    type="checkbox"
                    value={bahasa}
                    onChange={handleBahasaChange}
                    className="mr-2"
                  />
                  <label htmlFor={bahasa}>{bahasa}</label>
                </div>
              ))}
              <div className="flex items-center">
                <input
                  id="customBahasa"
                  name="customBahasa"
                  type="checkbox"
                  checked={customBahasa.enabled}
                  onChange={handleCustomBahasaCheckboxChange} // Updated to use the new handler
                  className="mr-2"
                />
                <label htmlFor="customBahasa">OTHER: </label>
                {customBahasa.enabled && (
                  <input
                    type="text"
                    placeholder="Enter custom bahasa"
                    value={customBahasa.value}
                    onChange={handleCustomBahasaInputChange} // Ensure this handler is used
                    className="ml-2"
                  />
                )}
              </div>
              <div
                style={InterReguler.style}
                className={`${styles.form_paragraph} mt-2`}
              >
                Bahasa yang digunakan ketika kelas berlangsung.
              </div>
            </div>
            <div className="mt-8">
              <div
                style={InterMedium.style}
                className={`${styles.form_title} mb-3`}
              >
                PIC Akademik
              </div>
              <select
                id="pic-akademik"
                name="pic-akademik"
                className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                value={formState.picAkademikId}
                onChange={(e) =>
                  setFormState({ ...formState, picAkademikId: e.target.value })
                }
                style={InterReguler.style}
              >
                <option value="">Pilih PIC Akademik</option>
                {listAllUser.filter((user) => user.role === "akademik").map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5">
              {success && (
              <div
                className="bg-[#DAF8E6] text-[#004434] text-sm px-4 py-2"
                style={InterReguler.style}
              >
                {success}
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
              <div className="flex justify-center mt-9">
                <button
                  type="submit"
                  className={`${styles.button_tx} ${styles.btn} hover:bg-[#215E9B] focus:bg-[#215E9B]`}
                  style={InterMedium.style}
                >
                  Tambah Jenis Kelas
                </button>
              </div>
            </div>
            </div>
            </form>
          </div>
          </div>
        );
};
