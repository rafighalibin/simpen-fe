import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useState } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { json } from "stream/consumers";
import { Lawyer } from "../../common/types/lawyer";

// example
export const AddForm = () => {
  const [alamat_ktp, setAlamatKtp] = useState("");
  const [domisili_kota, setDomisiliKota] = useState("");
  const [email_pribadi, setEmailPribadi] = useState("");
  const [email_kalananti, setEmailKalananti] = useState("");
  const [backup_phone_num, setBackupPhoneNum] = useState("");
  const queryClient = useQueryClient();
  const fetchWithToken = useFetchWithToken();
  const payload = {
    alamat_ktp,
    domisili_kota,
    email_pribadi,
    email_kalananti,
    backup_phone_num,
  };

  const { mutateAsync: addLawyerMutation, data } = useMutation({
    mutationFn: () =>
      fetchWithToken("/lawyer", "POST", payload).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data.content as Lawyer);
    },
  });

  return (
    <div className="max-w-md mx-auto mt-8">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await addLawyerMutation();
          queryClient.invalidateQueries("lawyers");
        }}
        className="space-y-6"
      >
        <div className="form-control">
          <label className="label">
            Alamat KTP
            <input
              type="text"
              value={alamat_ktp}
              onChange={(e) => setAlamatKtp(e.target.value)}
              placeholder="Alamat KTP"
              className="input input-bordered"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            Domisili Kota
            <input
              type="text"
              value={domisili_kota}
              onChange={(e) => setDomisiliKota(e.target.value)}
              placeholder="Domisili Kota"
              className="input input-bordered"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            Email Pribadi
            <input
              type="text"
              value={email_pribadi}
              onChange={(e) => setEmailPribadi(e.target.value)}
              placeholder="Email Pribadi"
              className="input input-bordered"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            Email Kalananti
            <input
              type="text"
              value={email_kalananti}
              onChange={(e) => setEmailKalananti(e.target.value)}
              placeholder="Email Kalananti"
              className="input input-bordered"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            Backup Phone Number
            <input
              type="text"
              value={backup_phone_num}
              onChange={(e) => setBackupPhoneNum(e.target.value)}
              placeholder="Backup Phone Number"
              className="input input-bordered"
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Lawyer
        </button>
      </form>
    </div>
  );
};
