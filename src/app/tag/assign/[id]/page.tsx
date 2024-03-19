"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useFetchWithToken from "../../../../common/hooks/fetchWithToken";
import { PengajarSelect } from "../../../../common/types/pengajar";
import { UUID } from "crypto";
import { useParams } from "next/navigation";

export default function TagDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const fetchWithToken = useFetchWithToken();
  const [selectedPengajar, setSelectedPengajar] = useState([]);
  const [listPengajarExisting, setListPengajar] = useState<PengajarSelect[]>(
    []
  );

  const payload = {
    id: id,
    selectedPengajar: selectedPengajar,
  };

  const { isLoading: listUserLoading, data: listUser } = useQuery({
    queryKey: ["listUser"],
    queryFn: () => fetchWithToken(`/user`).then((res) => res.json()),
  });

  const { mutateAsync: assignPengajarMutation } = useMutation({
    mutationFn: () =>
      fetchWithToken("/tag/assign", "POST", payload).then((res) => res.json()),
    onSuccess: (data) => {
      console.log("Pengajar assigned:", data);
      setSelectedPengajar([]);
      queryClient.invalidateQueries("listUser");
    },
  });

  useEffect(() => {
    if (listUser) {
      const existingPengajarIds = listPengajarExisting.map(
        (pengajar) => pengajar.value
      );
      const newPengajarData = listUser.content[2].user
        .filter((user) => !existingPengajarIds.includes(user.id))
        .map((user) => ({
          value: user.id,
          label: user.nama,
        }));
      setListPengajar((prevList) => [...prevList, ...newPengajarData]);
    }
  }, [listUser]);

  if (listUserLoading) {
    return <p>Loading...</p>;
  }

  const handleCheckboxChange = (event, pengajarId) => {
    const isChecked = event.target.checked;

    setSelectedPengajar((prevSelected) => {
      if (isChecked) {
        console.log(selectedPengajar);
        // Jika checkbox di-check, tambahkan pengajarId ke dalam array selectedPengajar
        return [...prevSelected, pengajarId];
      } else {
        console.log(selectedPengajar);
        // Jika checkbox di-uncheck, filter pengajarId dari array selectedPengajar
        return prevSelected.filter((id) => id !== pengajarId);
      }
    });

    // Menampilkan nilai selectedPengajar setelah pembaruan dilakukan
  };

  const handleAssignButtonClick = async () => {
    try {
      await assignPengajarMutation();
    } catch (error) {
      console.error("Error assigning pengajar:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {listUserLoading && <p>Loading...</p>}
      {!listUserLoading && listPengajarExisting.length === 0 && (
        <p>No pengajar available.</p>
      )}
      {listPengajarExisting.length > 0 && (
        <table
          style={{
            margin: "auto",
            borderCollapse: "collapse",
            width: "30%",
            maxWidth: "800px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  backgroundColor: "#f2f2f2",
                  padding: "12px",
                }}
              >
                Assign Pengajar
              </th>
            </tr>
          </thead>
          <tbody>
            {listPengajarExisting.map((pengajar) => (
              <tr key={pengajar.value}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "left",
                  }}
                >
                  <span>{pengajar.label}</span>
                  <input
                    type="checkbox"
                    onChange={(event) =>
                      handleCheckboxChange(event, pengajar.value)
                    }
                    checked={selectedPengajar.includes(pengajar.value)}
                    style={{ float: "right", marginRight: "10px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        className="block mt-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm focus:outline-none focus:bg-blue-600 "
        onClick={handleAssignButtonClick}
        style={{ margin: "auto", display: "block" }}
      >
        Assign
      </button>
    </div>
  );
}
