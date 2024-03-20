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
    <div className="bg-primaryForeground sm:flex items-center justify-center">
      <div className={`flex items-center justify-center sm:py-10 pt-6 pb-2`}>
        <div className={`mr-4`}>
          <Image src={nakahamaLogo} alt={"asset attr 1"} width={20} />
        </div>
        <div className="border-r border-primary h-8"></div>{" "}
        <div className={` ml-4`}>
          <Image src={kalanantiLogo} alt={"asset attr 2"} width={100} />
        </div>
      </div>
      <div
        className={`${styles.tx} sm:ml-4 ml-0 sm:text-left text-center sm:mb-0 sm:pb-0 pb-3`}
        style={InterReguler.style}
      >
        © 2024 Nakahama Labs for Kalananti
      </div>
    </div>
  );
};
export default Footer;
