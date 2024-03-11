"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useFetchWithToken from "../../../../common/hooks/fetchWithToken";

const EditPage = () => {
  const fetchWithToken = useFetchWithToken();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { isLoading, error, data } = useQuery(["kelasDetail", id], () =>
    fetchWithToken(`/kelas/${id}`).then((res) => res.json())
  );

  // Initialize form state with fetched data
  const [formState, setFormState] = useState({
    tanggalMulai: "",
    tanggalSelesai: "",
    pengajarId: "",
    linkGroup: "",
    listMurid: [],
    level: 0,
    platform: "",
  });

  // Populate form state when data is fetched successfully
  useEffect(() => {
    if (data && data.content) {
      const {
        tanggalMulai,
        tanggalSelesai,
        pengajarId,
        linkGroup,
        listMurid,
        level,
        platform,
      } = data.content;
      setFormState({
        tanggalMulai: tanggalMulai
          ? new Date(tanggalMulai).toISOString().split("T")[0]
          : "",
        tanggalSelesai: tanggalSelesai
          ? new Date(tanggalSelesai).toISOString().split("T")[0]
          : "",
        pengajarId,
        linkGroup,
        listMurid: listMurid.join(", "), // Convert array to comma-separated string
        level,
        platform,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Define the mutation for updating class details
  const updateMutation = useMutation(
    (newDetails) =>
      fetchWithToken(`/kelas/${id}`, "PUT", JSON.stringify(newDetails)).then(
        (res) => res.json()
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["kelasDetail", id]);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Transform listMurid back into an array
    const submitData = {
      ...formState,
    };
    updateMutation.mutate();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: </div>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Class ID: {id}</h1>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          name="tanggalMulai"
          value={formState.tanggalMulai}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          name="tanggalSelesai"
          value={formState.tanggalSelesai}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Teacher ID:</label>
        <input
          type="text"
          name="pengajarId"
          value={formState.pengajarId}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Group Link:</label>
        <input
          type="text"
          name="linkGroup"
          value={formState.linkGroup}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Students (comma-separated):</label>
        <input
          type="text"
          name="listMurid"
          value={formState.listMurid}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Level:</label>
        <input
          type="number"
          name="level"
          value={formState.level}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Platform:</label>
        <input
          type="text"
          name="platform"
          value={formState.platform}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditPage;
