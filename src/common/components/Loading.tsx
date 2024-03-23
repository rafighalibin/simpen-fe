import React from "react";
import Image from "next/image";

// import component
import nakahamaLogo from "../../../public/LogoNakahama.png";
import kalanantiLogo from "../../../public/Logo.png";

// import css
import styles from "./Loading.module.css";

const LoadingPage = () => {
  return (
    <div className="animate-pulse flex justify-center space-x-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex justify-center">
          <Image
            src={kalanantiLogo}
            alt={"asset attr 2"}
            width={500}
            className={`${styles.logo}`}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
