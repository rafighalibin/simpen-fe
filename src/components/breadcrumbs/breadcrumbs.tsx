import React from "react";
import styles from "./breadcurmbs.module.css";
import { usePathname } from "next/navigation";
import { InterMedium } from "../../font/font";
import { RiArrowRightSLine } from "react-icons/ri";

const getPath = (path) => {
  const pathArr = path.split("/").filter((item) => item !== "");
  return pathArr;
};

const toPascalCase = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const Breadcrumbs = () => {
  const path = usePathname();
  const pathArr = getPath(path);
  return (
    <div className={`${styles.card_breadcrumbs} px-7 py-4`}>
      <a
        className={`${styles.home_tx} text-xl ${
          path === "/dashboard" ? styles.current : styles.home
        }`}
        href={`/dashboard`}
        style={InterMedium.style}
      >
        Home
      </a>
      {pathArr.map((item, index) => {
        const currentPath = `/${pathArr.slice(0, index + 1).join("/")}`;
        return (
          <>
            <RiArrowRightSLine
              className={`${styles.arrow} inline-block mx-2`}
            />
            <a
              key={index}
              className={`${styles.path_tx} text-xl ${
                currentPath === path ? styles.current : ""
              }`}
              href={currentPath}
              style={InterMedium.style}
            >
              {" "}
              {toPascalCase(item)}
            </a>
          </>
        );
      })}
    </div>
  );
};
