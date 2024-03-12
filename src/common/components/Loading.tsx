import React from "react";
import Image from "next/image";

// import component
import nakahamaLogo from "../../../public/LogoNakahama.png";
import kalanantiLogo from "../../../public/Logo.png";

const Loading = () => {
  return (
    <div className="animate-pulse flex space-x-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="ml-4 pt-7">
          <Image src={kalanantiLogo} alt={"asset attr 2"} width={500} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
