import React from "react";
import Image from "next/image";

// import component
import nakahamaLogo from "../../../public/LogoNakahama.png";
import kalanantiLogo from "../../../public/Logo.png";
import { useAuthContext } from "../utils/authContext";

// import font and css
import styles from "./Footer.module.css";
import { InterReguler } from "../../font/font";

const Footer = () => {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) {
    return null;
  }
  return (
    <footer className="bg-primaryForeground flex items-center justify-center fixed bottom-0 left-0 w-full">
      <div className="flex items-center justify-center py-4">
        <div className="mr-4">
          <Image src={nakahamaLogo} alt={"asset attr 1"} width={20} />
        </div>
        <div className="border-r border-primary h-2"></div>{" "}
        <div className="ml-4">
          <Image src={kalanantiLogo} alt={"asset attr 2"} width={100} />
        </div>
      </div>
      <h2 className="text-primary text-xs ml-4">
        © 2024 Nakahama Labs for Kalananti
      </h2>
    </footer>
  );
};
export default Footer;
