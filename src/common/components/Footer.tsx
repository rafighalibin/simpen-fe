import React from "react";
import Image from "next/image";

// import component
import nakahamaLogo from "../../../public/LogoNakahama.png";
import kalanantiLogo from "../../../public/Logo.png";
export const Footer = () => {
  return (
    <div className="bg-primaryForeground flex items-center justify-center">
      <div className="flex items-center justify-center py-10">
        <div className="mr-4">
          <Image src={nakahamaLogo} alt={"asset attr 1"} width={20} />
        </div>
        <div className="border-r border-primary h-8"></div>{" "}
        <div className="ml-4">
          <Image src={kalanantiLogo} alt={"asset attr 2"} width={100} />
        </div>
      </div>
      <h2 className="text-primary text-lg ml-4">
        © 2024 Nakahama Labs for Kalananti
      </h2>
    </div>
  );
};
