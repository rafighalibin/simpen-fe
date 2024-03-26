"use client";
import { redirect, useParams } from "next/navigation";
import { useMutation, useQuery } from "react-query";
import { useState, useRef, useEffect } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useQueryClient } from "react-query";
import { useAuthContext } from "../../common/utils/authContext";
import useFetchPengajarDetail from "../../common/hooks/user/useFetchPengajarDetail";
import Loading from "../../common/components/Loading";
import { TagDetail, TagSelect } from "../../common/types/tag";
import { PoppinsBold, InterMedium } from "../../font/font";
import Select from "react-select";
import styles from "./DetailUser.module.css";

export const UpdateTagPengajar = () => {
  const { id } = useParams();
  const fetchWithToken = useFetchWithToken();
  const queryClient = useQueryClient();
  const { pengguna, isAuthenticated } = useAuthContext();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [formState, setFormState] = useState({
    id: id,
    listIdTag: [],
  });
  const [listTagExisting, setListTagExisting] = useState<TagSelect[]>([]);
  const [TagSelected, setTagSelected] = useState<TagSelect[]>([]);
  const [TagValues, setTagValues] = useState([]);
  const { isLoading: PengajarLoading, listPengajarExisting: pengajar } =
    useFetchPengajarDetail();

  const {
    mutateAsync: addTagPengajarMutation,
    data: editResponse,
    isSuccess,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/tag/assign`, "POST", formState).then((res) =>
        res.json()
      ),
    onSuccess: () => {
      console.log(formState);
    },
  });

  const {
    mutateAsync: deleteTagPengajarMutation,
    data: deleteResponse,
    isSuccess : deleteSuccess,
  } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/tag/assign`, "DELETE", formState).then((res) =>
        res.json()
      ),
    onSuccess: () => {
      console.log(formState);
    },
  });

  const { isLoading, error, data } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchWithToken(`/tag`).then((res) => res.json()),
    onSuccess(data) {
      if (data) {
        const tags = data.content.map((element: TagDetail) => ({
            value: element.id,
            label: element.nama,
          }));
          setListTagExisting(tags);
  
          // Inisialisasi TagSelected dengan tag yang sudah ada dalam formState.listTag
          const selectedTagsFromStorage = JSON.parse(localStorage.getItem("selectedTags"));
          if (selectedTagsFromStorage && selectedTagsFromStorage.length > 0) {
            setTagSelected(selectedTagsFromStorage);
          } else {
            // Otherwise, set TagSelected with tags from formState.listIdTag
            const initialSelectedTags = tags.filter((tag) => formState.listIdTag.includes(tag.value));
            setTagSelected(initialSelectedTags);
          }
      }
    },
  });

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      listIdTag: TagSelected.map((tag) => tag.value),
    }));
  }, [TagSelected]);

  const handleChangeTag = (selectedTags) => {
    setTagSelected(selectedTags);
  };

  //   const handleChangeTag = (e) => {
  //     const Tag = e.map((e) => e.value);
  //     setTagSelected(e);
  //     setTagSelected(Tag);
  //   };

  if (PengajarLoading) return <Loading />;

  const cariIdSama = (data: any[], idYangDicari) => {
    const hasilPencarian = [];

    // Loop melalui setiap objek dalam data
    for (let i = 0; i < data.length; i++) {
      // Mengecek jika objek memiliki properti id dan nilai id yang sama dengan id yang dicari
      if (data[i].id === idYangDicari) {
        // Menyimpan objek yang cocok ke dalam array hasilPencarian
        hasilPencarian.push(data[i]);
        console.log(data);
      }
    }
    return hasilPencarian;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    addTagPengajarMutation();
  };

  const specificUser = cariIdSama(pengajar, id);
  if (isSuccess) {
    localStorage.setItem("addTagSuccess", "true");
    redirect(`/user/profile/${id}`);
  }

  return (
    <div>
      <div className=" px-48 py-20 space-y-10 flex-grow flex flex-col justify-center">
        <h1 className=" flex justify-center text-6xl font-bold text-neutral/100 ">
          Assign Tag
        </h1>
        {
          <form onSubmit={handleSubmit}>
            <div className="bg-base flex flex-col space-y-4 px-8 py-8 shadow-md rounded-lg ">
              <div className="flex flex-col items-center pb-16">
                <label className="block font-medium text-neutral/70">
                  Foto Diri
                </label>
                <div className="mt-1 relative w-48 h-48 flex items-center justify-center rounded-full overflow-hidden">
                  <input
                    disabled
                    type="file"
                    value={""}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  {specificUser[0].fotoDiri && (
                    <img
                      src={specificUser[0].fotoDiri}
                      alt="Foto Diri"
                      className="object-cover w-full h-full"
                      style={{ borderRadius: "50%" }}
                    />
                  )}
                  {!specificUser[0].fotoDiri && (
                    <div className="bg-neutral/5 rounded-full flex items-center justify-center w-full h-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="form-control pt-6">
                  <label className="block font-medium text-neutral/70">
                    Assign Tag
                  </label>

                  <Select
                    defaultValue={TagSelected}
                    isMulti
                    name="colors"
                    onChange={handleChangeTag}
                    options={listTagExisting}
                    className="bg-base mt-1 p-2 w-full border rounded-md"
                    classNamePrefix="select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: "none", // Remove border
                        boxShadow: "none", // Remove box shadow
                        backgroundColor: "none", // Match platform input background color
                        minHeight: "44px", // Set minimum height
                        width: "100%", // Set width to 100%
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: "#EDF6FF", // Match platform input background color
                      }),
                      input: (provided) => ({
                        ...provided,
                        minHeight: "44px", // Set minimum height for input
                      }),
                    }}
                  />
                </div>
                
              </div>
              <h1 className=" flex text-3xl font-bold text-neutral/100 ">
                Data Diri
              </h1>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div
                    style={InterMedium.style}
                    className={`${styles.title} mb-3`}
                  >
                    Nama
                  </div>
                  <input
                    disabled
                    placeholder={
                      specificUser[0].nama == null ? "" : specificUser[0].nama
                    }
                    className={`${styles.placeholder} appearance-none relative block w-full px-3 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                  />
                </div>
                <div>
                  <div
                    style={InterMedium.style}
                    className={`${styles.title}  mb-3`}
                  >
                    Email
                  </div>
                  <input
                    disabled
                    placeholder={
                      specificUser[0].email == null ? "" : specificUser[0].email
                    }
                    className={`${styles.placeholder} appearance-none relative block w-full px-3 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                  />
                </div>
                <div>
                  <div
                    style={InterMedium.style}
                    className={`${styles.title}  mb-3`}
                  >
                    Email Pribadi
                  </div>
                  <input
                    disabled
                    placeholder={
                      specificUser[0].emailPribadi == null
                        ? ""
                        : specificUser[0].emailPribadi
                    }
                    className={`${styles.placeholder} appearance-none relative block w-full px-3 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                  />
                </div>
                <div>
                  <div
                    style={InterMedium.style}
                    className={`${styles.title} mb-3`}
                  >
                    Jenis Kelamin
                  </div>
                  <div className="flex items-center text-[#9CA3AF] pr-3 py-3">
                    <input
                      disabled
                      type="radio"
                      id="laki-laki"
                      name="jenisKelamin"
                      value="laki-laki"
                      checked={specificUser[0].jenisKelamin === "laki-laki"}
                      className="mr-2"
                    />
                    <label htmlFor="laki-laki" className="mr-4">
                      Laki-laki
                    </label>
                    <input
                      disabled
                      type="radio"
                      id="perempuan"
                      name="jenisKelamin"
                      value="perempuan"
                      checked={specificUser[0].jenisKelamin === "perempuan"}
                      className="mr-2"
                    />
                    <label htmlFor="perempuan">Perempuan</label>
                  </div>
                </div>
                <div>
                  <div
                    style={InterMedium.style}
                    className={`${styles.title}  mb-3`}
                  >
                    No. Telpon
                  </div>
                  <input
                    disabled
                    placeholder={
                      specificUser[0].noTelp == null
                        ? ""
                        : specificUser[0].noTelp
                    }
                    className={`${styles.placeholder} appearance-none relative block w-full px-3 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
                  />
                </div>
              </div>
              <div className="flex justify-center py-4 gap-4">
                <button
                  type="submit"
                  className="bg-info text-white px-4 py-2 rounded-md hover:bg-infoHover"
                >
                  Tambah Tag
                </button>
                <button className="bg-error text-white px-4 py-2 rounded-md hover:bg-errorHover">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        }
      </div>
    </div>
  );
};
