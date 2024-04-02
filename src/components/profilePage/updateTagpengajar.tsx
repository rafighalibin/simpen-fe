"use client";
import { redirect, useParams } from "next/navigation";
import { useMutation, useQuery } from "react-query";
import { useState, useRef, useEffect } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { useQueryClient } from "react-query";
import { useAuthContext } from "../../common/utils/authContext";
import Loading from "../../common/components/Loading";
import { TagDetail, TagSelect } from "../../common/types/tag";
import { PoppinsBold, InterMedium } from "../../font/font";
import Select from "react-select";
import styles from "./DetailUser.module.css";
import { PengajarDetail } from "../../common/types/pengajar";


export const UpdateTagPengajar = () => {
  const { id } = useParams();
  const fetchWithToken = useFetchWithToken();
  const queryClient = useQueryClient();
  const { pengguna, isAuthenticated } = useAuthContext();
  const [listTagExisting, setListTagExisting] = useState<TagSelect[]>([]);
  const [TagSelected, setTagSelected] = useState<TagSelect[]>([]);
  const [TagRendered, setTagRendered] = useState(false);
  const [listPengajarExisting, setListPengajarExisting] = useState<
    PengajarDetail[]
  >([]);

  const [formState, setFormState] = useState({
    id: id,
    listIdTag: [],
  });

  const { isLoading: detailPengajarLoading, refetch } = useQuery({
    queryKey: ["listUser"],
    queryFn: () => fetchWithToken(`/user`).then((res) => res.json()),
    onSuccess(data) {
      if (data) {
        for (let i = 0; i < data.content.length; i++) {
          if (data.content[i].role === "pengajar") {
            data.content[i].user.forEach((element: PengajarDetail) => {
              listPengajarExisting.push(element);
            });
          }
        }
        for(let i = 0; i < listPengajarExisting.length; i++){
          if(listPengajarExisting[i].id === id){
            setFormState((prev) => ({
              ...prev,
              listIdTag: listPengajarExisting[i].listTag.map((tag: TagDetail) => tag.id),
            }));
            listPengajarExisting[i].listTag.forEach((tag: TagDetail) => {
              TagSelected.push({ value: tag.id, label: tag.nama });
            });
          }
          console.log("listPengajarExisting[i].listTag:", listPengajarExisting[i].listTag);
        }
        }
      }
    });

  const { isLoading, error, data } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchWithToken(`/tag`).then((res) => res.json()),
    onSuccess(data) {
      if (data) {
        let tags = data.content.map((element: TagDetail) => ({
          value: element.id,
          label: element.nama,
        }));
        setListTagExisting(tags);
      }
    },
  });

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
      // queryClient.invalidateQueries("listUser");
      console.log(formState);
    },
  });

  const handleChangeTag = (selectedTags) => {
    const newTagIds = selectedTags.map(tag => tag.value);
    setFormState(prevState => ({
        ...prevState,
        listIdTag: newTagIds
    })); // Perbarui TagSelected dengan nilai tag yang dipilih
};

  useEffect(() => {
    if (TagSelected.length > 0) {
      setTagRendered(true);
    }
  }, [TagSelected]);

  if (detailPengajarLoading) return <Loading />;

  const cariIdSama = (data: any[], idYangDicari) => {
    const hasilPencarian = [];

    // Loop melalui setiap objek dalam data
    for (let i = 0; i < data.length; i++) {
      // Mengecek jika objek memiliki properti id dan nilai id yang sama dengan id yang dicari
      if (data[i].id === idYangDicari) {
        // Menyimpan objek yang cocok ke dalam array hasilPencarian
        hasilPencarian.push(data[i]);
      }
    }
    return hasilPencarian;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTagPengajarMutation();
  }

  const specificUser = cariIdSama(listPengajarExisting, id);
  if (isSuccess) {
    localStorage.setItem("addTagSuccess", "true");
    redirect(`/pengajar/${id}`);
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

                  {!TagRendered && (
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
                  )}
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
