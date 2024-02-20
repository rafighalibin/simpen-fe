'use client'

import React, { useState, useEffect } from 'react';

function PengajarPage() {
  const [pengajarData, setPengajarData] = useState(null);

  var api = 'api.simpen.org'
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://'+api+'/pengajar');
        const data = await res.json();
        setPengajarData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Informasi Pengajar</h1>
      {pengajarData ? (
        <div className="bg-slate-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <p className="mb-4"><span className="font-bold">User ID:</span> {pengajarData.user_id}</p>
          <p className="mb-4"><span className="font-bold">Alamat KTP:</span> {pengajarData.alamat_ktp}</p>
          <p className="mb-4"><span className="font-bold">Domisili Kota:</span> {pengajarData.domisili_kota}</p>
          <p className="mb-4"><span className="font-bold">Email Pribadi:</span> {pengajarData.email_pribadi}</p>
          <p className="mb-4"><span className="font-bold">Email Kalananti:</span> {pengajarData.email_kalananti}</p>
          <p className="mb-4"><span className="font-bold">Backup Phone Number:</span> {pengajarData.backup_phone_num}</p>
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
}


export default PengajarPage;
