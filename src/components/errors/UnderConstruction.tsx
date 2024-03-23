import React from "react";
import { Background } from "../loginPage/background";
import Link from "next/link";

const UnderConstruction = () => {
  return (
    <div>
      <Background />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center bg-transparent p-8 rounded-lg">
          <h2 className="text-white text-3xl font-bold mb-4">
            This page is under construction, please come back later
          </h2>
          <Link href="/">
            <button className="bg-base text-primary underline px-4 py-2 rounded-md hover:bg-base/80">
              Kembali Ke Beranda
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
