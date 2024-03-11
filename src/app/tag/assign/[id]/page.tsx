import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useFetchWithToken from '../../../../hooks/fetchWithToken';
import { UUID } from 'crypto';

interface Tag {
  id: number;
  nama: string;
  jumlahPengajar: number;
  listPengajar: Pengajar[];
}

interface Pengajar {
  id: UUID;
  nama: string;
  isChecked: boolean;
}

export default function TagDetail({ params }: { params: { tagId: number } }) {
  const queryClient = useQueryClient();
  const fetchWithToken = useFetchWithToken();
  const [listPengajar, setListPengajar] = useState<Pengajar[]>([]);

  const { isLoading, error, data } = useQuery<Tag[], Error>({
    queryKey: ['tags'],
    queryFn: () => fetchWithToken('/tag/assign').then((res) => res.json()),
  });

  const { mutateAsync: addTagMutation } = useMutation({
    mutationFn: () =>
      fetchWithToken('/tag/assign', 'POST', {
        id_tag: params.tagId,
        pengajar: listPengajar.filter((pengajar) => pengajar.isChecked).map((pengajar) => pengajar.id),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries('tags');
    },
  });

  const handleCheck = (id: string) => {
    setListPengajar((prev) =>
      prev.map((pengajar) => (pengajar.id === id ? { ...pengajar, isChecked: !pengajar.isChecked } : pengajar))
    );
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Tag Detail {params.tagId}</h1>
      <table>
        <thead>
          <tr>
            <th>Nama Pengajar</th>
            <th>Assign</th>
          </tr>
        </thead>
        <tbody>
          {listPengajar.map((pengajar) => (
            <tr key={pengajar.id}>
              <td>{pengajar.nama}</td>
              <td>
                <input type="checkbox" checked={pengajar.isChecked} onChange={() => handleCheck(pengajar.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => addTagMutation()}>Assign Pengajar</button>
    </div>
  );
}
