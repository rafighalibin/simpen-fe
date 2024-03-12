import React from "react";
import { Background } from "../loginPage/background";

const Unauthorized = () => {
  return (
    <div>
      <Background />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center bg-transparent p-8 rounded-lg">
          <h2 className="text-white text-3xl font-bold mb-4">
            Anda tidak memiliki wewenang untuk membuka halaman ini
          </h2>
          <button className="bg-base text-white px-4 py-2 rounded-md hover:bg-base/80">
            <a href="/" className="text-primary underline">
              Kembali Ke Beranda
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
