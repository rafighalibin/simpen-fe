"use client";

import React, { useEffect, useState } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import useFetchAllUser from "../../common/hooks/user/useFetchAllUser";
import { useRouter } from "next/navigation";

// import font and css
import styles from "./UserListTable.module.css";
import { InterMedium, PoppinsBold } from "../../font/font";
import { Filtering } from "./Filtering";
import Loading from "../../common/components/Loading";

export const UserListTable = () => {
  const {
    isLoading: listAllUserLoading,
    error,
    listAllUser,
    refetch,
  } = useFetchAllUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [userAlert, setUserAlert] = useState("");
  const [alertType, setAlertType] = useState("");
  const router = useRouter();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const addAlert = localStorage.getItem("addUserSuccess");
      const editAlert = localStorage.getItem("editUserSuccess");
      const removeAlert = localStorage.getItem("removeUserSuccess");

      if (addAlert) {
        setShowAlert(true);
        setUserAlert(addAlert);
        setAlertType("add");
        console.log(addAlert);
      } else if (editAlert) {
        setShowAlert(true);
        setUserAlert(editAlert);
        setAlertType("edit");
      } else if (removeAlert) {
        setShowAlert(true);
        setUserAlert(removeAlert);
        setAlertType("delete");
      }
    }
  }, []);
  useEffect(() => {
    if (setShowAlert) {
      if (typeof localStorage !== "undefined") {
        const addAlert = localStorage.getItem("addUserSuccess");
        const editAlert = localStorage.getItem("editUserSuccess");
        const removeAlert = localStorage.getItem("removeUserSuccess");

        if (addAlert) {
          localStorage.removeItem("addUserSuccess");
        } else if (editAlert) {
          localStorage.removeItem("editUserSuccess");
        } else if (removeAlert) {
          localStorage.removeItem("removeUserSuccess");
        }
      }
    }
  }, [setShowAlert]);

  useEffect(() => {
    function sortUsers(users, filterBy) {
      return [...users].sort((a, b) => {
        if (filterBy === "nama-asc") {
          return a.nama.localeCompare(b.nama);
        } else if (filterBy === "nama-desc") {
          return b.nama.localeCompare(a.nama);
        } else if (filterBy === "email-asc") {
          return a.email.localeCompare(b.email);
        } else if (filterBy === "email-desc") {
          return b.email.localeCompare(a.email);
        }
        return 0;
      });
    }

    if (listAllUser) {
      let filtered = listAllUser;

      if (sortBy) {
        filtered = filtered.filter(
          (user) => user.role.toLowerCase() === sortBy.toLowerCase()
        );
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.nama.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
      }

      if (filterBy) {
        filtered = sortUsers(filtered, filterBy);
      }

      setFilteredUsers(filtered);
    }
  }, [listAllUser, sortBy, filterBy, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`${styles.pagination_tx} px-3  py-2 mx-1 ${
            currentPage === i
              ? "bg-[#215E9B] text-white"
              : "bg-[#FFFFFF] border border-[#DFE4EA] text-[#637381] hover:bg-[#A8D4FF] hover:text-white"
          } rounded`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handleDetailClick = (user) => {
    const userId = user.id;
    router.push(`/user/detail/${userId}`);
  };

  if (error || !listAllUser) {
    return <div>Error fetching all users.</div>;
  }

  //To-Do: Filtering

  return (
    <div>
      <div
        className={` ${styles.heading} md:my-10 my-6`}
        style={PoppinsBold.style}
      >
        Daftar Akun
      </div>
      <div>
        {showAlert && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-3 mb-5"
            role="alert"
          >
            <span className="block sm:inline">Akun </span>
            <strong className="font-bold">{userAlert} </strong>
            <span className="block sm:inline">
              {alertType === "add"
                ? `berhasil ditambahkan sebagai pengguna!`
                : alertType === "edit"
                ? "berhasil diperbarui!"
                : alertType === "delete"
                ? " telah dinonaktifkan!"
                : ""}
            </span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setShowAlert(false)}
            >
              <svg
                className="fill-current h-6 w-6 text-green-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path
                  fillRule="evenodd"
                  d="M14.348 5.652a.5.5 0 0 1 0 .707l-8 8a.5.5 0 1 1-.707-.707l8-8a.5.5 0 0 1 .707 0z"
                />
                <path
                  fillRule="evenodd"
                  d="M5.652 5.652a.5.5 0 0 0-.707 0l-8 8a.5.5 0 0 0 .707.707l8-8a.5.5 0 0 0 0-.707z"
                />
              </svg>
            </span>
          </div>
        )}
      </div>
      <div>
        <Filtering
          sQ={searchQuery}
          ssQ={setSearchQuery}
          sB={sortBy}
          ssB={setSortBy}
          fB={filterBy}
          sfB={setFilterBy}
        />
      </div>
      {listAllUserLoading ? (
        <Loading />
      ) : (
        <div className={` ${styles.card_form} `}>
          {filteredUsers.length === 0 ? (
            <div
              className={`p-6 ${styles.table_items_text}`}
              style={InterMedium.style}
            >
              Pengguna tidak ditemukan.
            </div>
          ) : (
            <table className={`table-auto w-full`}>
              <thead
                className={`${styles.table_heading} ${styles.table_heading_text}`}
              >
                <tr>
                  <th
                    className="px-4 py-4 text-center md:block hidden"
                    style={InterMedium.style}
                  >
                    NO
                  </th>
                  <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    NAMA
                  </th>
                  <th className="px-4 py-4 text-left" style={InterMedium.style}>
                    ROLE
                  </th>
                  <th
                    className="px-4 py-4 text-left hidden md:table-cell"
                    style={InterMedium.style}
                  >
                    EMAIL
                  </th>
                  <th
                    className="px-4 py-4 text-left hidden md:table-cell"
                    style={InterMedium.style}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((user, index) => (
                    <tr
                      className={`${styles.table_items_text} hover:bg-[#eaf5ff]`}
                      style={InterMedium.style}
                      key={user.id}
                      onClick={() => handleDetailClick(user)}
                    >
                      <td className="border-b px-4 py-2 hidden md:table-cell text-center ">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="border-b px-4 py-5">{user.nama}</td>
                      <td className="border-b px-4 py-5">{user.role}</td>
                      <td className="border-b px-4 py-5 hidden md:table-cell">
                        {user.email}
                      </td>
                      <td className="border-b px-4 py-5 md:table-cell hidden">
                        <button
                          onClick={() => handleDetailClick(user)}
                          className={`bg-transparent hover:bg-[#215E9B] text-[#215E9B] focus:bg-[#215E9B] focus:text-white hover:text-white py-2 px-4 border border-[#215E9B] hover:border-transparent rounded-full`}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          <div className={`flex justify-center my-4`}>
            <div className={`${styles.pagination_container} p-2`}>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 mx-1 bg-white border border-[#DFE4EA] text-[#637381] rounded hover:bg-[#A8D4FF] hover:text-white`}
              >
                {"<"}
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-white border border-[#DFE4EA] text-[#637381] rounded hover:bg-[#A8D4FF] hover:text-white"
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
