import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useState } from "react";
import useFetchWithToken from "../../common/hooks/fetchWithToken";
import { Lawyer } from "../../common/types/lawyer";

// example
export const LawyerForm = () => {
  const [showForm, setShowForm] = useState(false);
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
    <div>
      {showForm && (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await addLawyerMutation();
              queryClient.invalidateQueries("lawyers");
            }}
            className="space-y-6"
          >
            <div className="form-group">
              <label htmlFor="alamat_ktp" className="text-gray-700">
                Alamat KTP
              </label>
              <input
                id="alamat_ktp"
                type="text"
                value={alamat_ktp}
                onChange={(e) => setAlamatKtp(e.target.value)}
                placeholder="Alamat KTP"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-group">
              <label htmlFor="domisili_kota" className="text-gray-700">
                Domisili Kota
              </label>
              <input
                id="domisili_kota"
                type="text"
                value={domisili_kota}
                onChange={(e) => setDomisiliKota(e.target.value)}
                placeholder="Domisili Kota"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email_pribadi" className="text-gray-700">
                Email Pribadi
              </label>
              <input
                id="email_pribadi"
                type="text"
                value={email_pribadi}
                onChange={(e) => setEmailPribadi(e.target.value)}
                placeholder="Email Pribadi"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email_kalananti" className="text-gray-700">
                Email Kalananti
              </label>
              <input
                id="email_kalananti"
                type="text"
                value={email_kalananti}
                onChange={(e) => setEmailKalananti(e.target.value)}
                placeholder="Email Kalananti"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-group">
              <label htmlFor="backup_phone_num" className="text-gray-700">
                Backup Phone Number
              </label>
              <input
                id="backup_phone_num"
                type="text"
                value={backup_phone_num}
                onChange={(e) => setBackupPhoneNum(e.target.value)}
                placeholder="Backup Phone Number"
                className="input input-bordered w-full"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Add Lawyer
            </button>
          </form>
        </div>
      )}
      <div className="flex justify-end p-10">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? "Hide Form" : "Show Form"}
        </button>
      </div>
    </div>
  );
};
