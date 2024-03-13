import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";

// Import font & css
import { PoppinsBold, InterMedium } from "../../font/font";
import styles from "./DetailUser.module.css";

// Import component
import useFetchWithToken from "../../common/hooks/fetchWithToken";

export const DetailUser = ({ data }) => {
  const fetchWithToken = useFetchWithToken();
  const router = useRouter();

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: () =>
      fetchWithToken(`/user/${data.id}`, "DELETE").then((res) => res.json),
  });

  console.log(data.id);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this Account?")) {
      await deleteMutation();
      router.push("/user");
    }
  };

  const handleEdit = async () => {
    const queryString = encodeURIComponent(JSON.stringify(data));
    router.push(`/user/edit?user=${queryString}`);
  };

  return (
    <div>
      <div
        className={`${styles.heading} text-center my-10`}
        style={PoppinsBold.style}
      >
        Detail Akun Pengguna
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div style={InterMedium.style} className={`${styles.title} mb-3`}>
            Nama
          </div>
          <input
            disabled
            placeholder={data.nama}
            className={`${styles.placeholder} appearance-none relative block w-full px-3 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
          />
        </div>
        <div>
          <div style={InterMedium.style} className={`${styles.title}  mb-3`}>
            Email
          </div>
          <input
            disabled
            placeholder={data.email}
            className={`${styles.placeholder} appearance-none relative block w-full px-3 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
          />
        </div>
        <div>
          <div style={InterMedium.style} className={`${styles.title}  mb-3`}>
            Email Pribadi
          </div>
          <input
            disabled
            placeholder={data.emailPribadi}
            className={`${styles.placeholder} appearance-none relative block w-full px-3 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
          />
        </div>
        <div>
          <div style={InterMedium.style} className={`${styles.title} mb-3`}>
            Jenis Kelamin
          </div>
          <div className="flex items-center text-[#9CA3AF] pr-3 py-3">
            <input
              disabled
              type="radio"
              id="male"
              name="jenisKelamin"
              value="male"
              checked={data.jenisKelamin === "Laki-laki"}
              className="mr-2"
            />
            <label htmlFor="male" className="mr-4">
              Laki-laki
            </label>
            <input
              disabled
              type="radio"
              id="female"
              name="jenisKelamin"
              value="female"
              checked={data.jenisKelamin === "Perempuan"}
              className="mr-2"
            />
            <label htmlFor="female">Perempuan</label>
          </div>
        </div>
        <div>
          <div style={InterMedium.style} className={`${styles.title}  mb-3`}>
            No. Telpon
          </div>
          <input
            disabled
            placeholder={data.noTelp}
            className={`${styles.placeholder} appearance-none relative block w-full px-3 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
          />
        </div>
        <div>
          <div style={InterMedium.style} className={`${styles.title} mb-3`}>
            Role
          </div>
          <input
            disabled
            placeholder={
              data.role === "pengajar"
                ? "Pengajar"
                : data.role === "akademik"
                ? "Akademik"
                : data.role === "operasional"
                ? "Operasional"
                : ""
            }
            className={`${styles.placeholder} appearance-none relative block w-full px-3 py-3 bg-[#F3F4F6] placeholder-[#9CA3AF]  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
          />
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-16 mb-24">
        <button
          onClick={handleEdit}
          className={`${styles.button_tx} ${styles.put_btn}`}
          style={InterMedium.style}
        >
          Ubah Detail Akun
        </button>
        <button
          onClick={handleDelete}
          className={`${styles.button_tx} ${styles.del_btn}`}
          style={InterMedium.style}
        >
          Hapus Akun
        </button>
      </div>
    </div>
  );
};
