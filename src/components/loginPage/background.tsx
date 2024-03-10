import React from "react";
import Image from "next/image";

// font and css
import styles from "./background.module.css";

// import component
import asset1 from "../../../public/BG_asset_1.png";
import asset2 from "../../../public/BG_asset_2.png";

export const Background = () => {
  return (
    <div className={`${styles.bg}`} style={{ minHeight: "100vh" }}>
      <div>
        <Image
          src={asset1}
          alt={"asset attr 1"}
          className={`${styles.asset1}`}
        />
      </div>
      <div>
        <Image
          src={asset2}
          alt={"asset attr 2"}
          className={`${styles.asset2}`}
        />
      </div>
    </div>
  );
};
