"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useParams, useRouter } from "next/navigation";


//import font and css
import { PoppinsBold, InterMedium, InterReguler } from "../../font/font";
import styles from "./addJenisKelasForm.module.css";

//import component
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import useFetchAllUsers from "../../common/hooks/user/useFetchAllUser";

export const EditJenisKelasForm = () => {
  const fetchWithToken = useFetchWithToken();
  const { id } = useParams(); // Correct usage based on your setup
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
  const [customModaPertemuan, setCustomModaPertemuan] = useState([]);
  const [customBahasa, setCustomBahasa] = useState([]);
  const [customTypes, setCustomTypes] = useState([]);

  useEffect(() => {
    const fetchJenisKelasDetail = async () => {
      try {
        const response = await fetchWithToken(`/kelas/jenis/${id}`); // Use dynamic endpoint based on `id`
        const data = await response.json();
        if (response.ok) {
          setFormState({
            nama: data.content.nama,
            modaPertemuan: data.content.pertemuan || [],
            tipe: data.content.tipe || [],
            bahasa: data.content.bahasa || [],
            picAkademikId: data.content.picAkademikId || ""
          })
        } else {
          throw new Error(data.message || "Failed to fetch data");
        }
      } catch (error) {
        setError("Failed to fetch jenis kelas detail: " + error.message);
      }
    };

    fetchJenisKelasDetail();
  }, []);

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
  

  const { mutateAsync: updateJenisKelasMutation } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/kelas/jenis/`, "PUT", JSON.stringify(formState), {
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (data.code === 200) {
        setSuccess("Sukses mengubah jenis kelas.");
        setTimeout(() => {
          router.push("/kelas/jenis");
        }, 1000);
      } else {
        setError("Gagal mengubah jenis kelas: " + (data.message || ""));
      }
    }
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
  
  // Custom Moda Checkbox onChange
  const toggleCustomModaPertemuan = (index, isEnabled) => {
    setCustomModaPertemuan(prev => {
      let newCustomModaPertemuan = [...prev];
      if (isEnabled) {
        // Add a new custom moda slot with default values
        newCustomModaPertemuan.push({ enabled: true, value: '' });
      } else {
        // Remove the custom moda and its value from the form state
        newCustomModaPertemuan.splice(index, 1);
        setFormState(prevState => ({
          ...prevState,
          modaPertemuan: prevState.modaPertemuan.filter(t => t !== prev[index].value)
        }));
      }
      return newCustomModaPertemuan;
    });
  };

  // Handler for custom moda value changes
  const handleCustomModaPertemuanChange = (index, value) => {
    setCustomModaPertemuan(prev => {
      let newCustomModaPertemuan = [...prev];
      newCustomModaPertemuan[index] = { ...newCustomModaPertemuan[index], value };
      return newCustomModaPertemuan;
    });
  };

  const handleCustomModaPertemuanBlur = (index) => {
    const value = customModaPertemuan[index].value.trim();
    setFormState(prevState => {
      let newModaPertemuan = [...prevState.modaPertemuan];
      if (!prevState.modaPertemuan.includes(value)) {
        newModaPertemuan.push(value);
      }
      return { ...prevState, modaPertemuan: newModaPertemuan };
    });
  };

  const handleBahasaChange = (e) => {
    const { value, checked } = e.target;
    setFormState(prevState => {
      const existingBahasa = new Set(prevState.bahasa); // Use a Set for unique values
      if (checked) {
        existingBahasa.add(value); // Properly add the whole string
      } else {
        existingBahasa.delete(value); // Properly remove the string
      }
      return {
        ...prevState,
        bahasa: Array.from(existingBahasa) // Convert back to an array
      };
    });
  };  

  // Custom bahasa Checkbox onChange
  const toggleCustomBahasa = (index, isEnabled) => {
    setCustomBahasa(prev => {
      let newCustomBahasa = [...prev];
      if (isEnabled) {
        // Add a new custom bahasa slot with default values
        newCustomBahasa.push({ enabled: true, value: '' });
      } else {
        // Remove the custom bahasa and its value from the form state
        newCustomBahasa.splice(index, 1);
        setFormState(prevState => ({
          ...prevState,
          bahasa: prevState.bahasa.filter(t => t !== prev[index].value)
        }));
      }
      return newCustomBahasa;
    });
  };

  // Handler for custom bahasa value changes
  const handleCustomBahasaChange = (index, value) => {
    setCustomBahasa(prev => {
      let newCustomBahasa = [...prev];
      newCustomBahasa[index] = { ...newCustomBahasa[index], value };
      return newCustomBahasa;
    });
  };

  const handleCustomBahasaBlur = (index) => {
    const value = customBahasa[index].value.trim();
    setFormState(prevState => {
      let newBahasa = [...prevState.bahasa];
      if (!prevState.bahasa.includes(value)) {
        newBahasa.push(value);
      }
      return { ...prevState, bahasa: newBahasa };
    });
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
  const toggleCustomType = (index, isEnabled) => {
    setCustomTypes(prev => {
      let newCustomTypes = [...prev];
      if (isEnabled) {
        // Add a new custom type slot with default values
        newCustomTypes.push({ enabled: true, value: '' });
      } else {
        // Remove the custom type and its value from the form state
        newCustomTypes.splice(index, 1);
        setFormState(prevState => ({
          ...prevState,
          tipe: prevState.tipe.filter(t => t !== prev[index].value)
        }));
      }
      return newCustomTypes;
    });
  };

  // Handler for custom type value changes
  const handleCustomTypeChange = (index, value) => {
    setCustomTypes(prev => {
      let newCustomTypes = [...prev];
      newCustomTypes[index] = { ...newCustomTypes[index], value };
      return newCustomTypes;
    });
  };

  const handleCustomTypeBlur = (index) => {
    const value = customTypes[index].value.trim();
    setFormState(prevState => {
      let newTipe = [...prevState.tipe];
      if (!prevState.tipe.includes(value)) {
        newTipe.push(value);
      }
      return { ...prevState, tipe: newTipe };
    });
  };

  const handleSubmit = async (e) => {
    if (window.confirm("Are you sure you want to update this jenis kelas?")) {
      e.preventDefault();
      await updateJenisKelasMutation();
    }
  };

return (
    <div className="">
        <div
            className={`${styles.heading} text-center my-10`}
            style={PoppinsBold.style}
        >
            Edit Jenis Kelas
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
                        disabled
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
                                    checked={formState.modaPertemuan.includes(moda)}
                                    disabled={formState.modaPertemuan.includes(moda)}
                                />
                                <label htmlFor={moda}>{moda}</label>
                            </div>
                        ))}
                    </div>
                    <div>
                {customModaPertemuan.map((customModaPertemuan, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={customModaPertemuan.enabled}
                      onChange={(e) => toggleCustomModaPertemuan(index, e.target.checked)}
                      className="mr-2"
                    />
                    {customModaPertemuan.enabled && (
                      <input
                        type="text"
                        placeholder="Enter custom moda"
                        value={customModaPertemuan.value}
                        onChange={(e) => handleCustomModaPertemuanChange(index, e.target.value.toUpperCase())}
                        onBlur={() => handleCustomModaPertemuanBlur(index)}
                        className="mr-2"
                      />
                    )}
                  </div>
                ))}
                <button onClick={() => toggleCustomModaPertemuan(customModaPertemuan.length, true)} className="mr-2" type="button">
                  Add Custom Moda
                </button>
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
                    checked={formState.tipe.includes(tipe)}
                    disabled={formState.tipe.includes(tipe)}
                  />
                  <label htmlFor={tipe}>{tipe}</label>
                </div>
              ))}
            </div>
            <div>
                {customTypes.map((customType, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={customType.enabled}
                      onChange={(e) => toggleCustomType(index, e.target.checked)}
                      className="mr-2"
                    />
                    {customType.enabled && (
                      <input
                        type="text"
                        placeholder="Enter custom tipe"
                        value={customType.value}
                        onChange={(e) => handleCustomTypeChange(index, e.target.value.toUpperCase())}
                        onBlur={() => handleCustomTypeBlur(index)}
                        className="mr-2"
                      />
                    )}
                  </div>
                ))}
                <button onClick={() => toggleCustomType(customTypes.length, true)} className="mr-2" type="button">
                  Add Custom Tipe
                </button>
              </div>
              <div
                style={InterReguler.style}
                className={`${styles.form_paragraph} mt-2`}
              >
                Tipe adalah identifier banyaknya peserta kelas (cth: reguler atau private).
              </div>
            </div>
            <div className="mt-8">
  <div style={InterMedium.style} className={`${styles.form_title} mb-3`}>
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
          checked={formState.bahasa.includes(bahasa)}
          disabled={formState.bahasa.includes(bahasa)} // Disable if it's included in formState.bahasa
          className="mr-2"
        />
        <label htmlFor={bahasa}>{bahasa}</label>
      </div>
    ))}
  </div>
  <div>
    {customBahasa.map((customBahasa, index) => (
      <div key={index} className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={customBahasa.enabled}
          onChange={(e) => toggleCustomBahasa(index, e.target.checked)}
          className="mr-2"
        />
        {customBahasa.enabled && (
          <input
            type="text"
            placeholder="Enter custom bahasa"
            value={customBahasa.value}
            onChange={(e) => handleCustomBahasaChange(index, e.target.value.toUpperCase())}
            onBlur={() => handleCustomBahasaBlur(index)}
            className="mr-2"
          />
        )}
      </div>
    ))}
    <button onClick={() => toggleCustomBahasa(customBahasa.length, true)} className="mr-2" type="button">
      Add Custom Bahasa
    </button>
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
                        disabled
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
                        {listAllUser
                            .filter((user) => user.role === "akademik")
                            .map((user) => (
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
                            Edit Jenis Kelas
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
);
};
