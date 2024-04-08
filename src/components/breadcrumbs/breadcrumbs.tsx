import React, { Fragment } from "react";
import styles from "./breadcrumbs.module.css";
import { usePathname } from "next/navigation";
import { InterMedium } from "../../font/font";
import { RiArrowRightSLine } from "react-icons/ri";

const getPath = (path) => {
  const pathArr = path.split("/").filter((item) => item !== "");
  return pathArr;
};

const toPascalCase = (text) => {
  text = text.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const Breadcrumbs = ({ excludeId = false }) => {
  const path = usePathname();
  const pathArr = getPath(path);
  return (
    <div
      key={`RiArrowRightSLine`}
      className={`${styles.card_breadcrumbs} md:px-7 px-5 md:py-4 py-2`}
    >
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
        if (excludeId && index === pathArr.length - 1) return null; // Exclude ID
        const currentPath = `/${pathArr.slice(0, index + 1).join("/")}`;
        return (
          <Fragment key={`breadcrumb-fragment-${index}`}>
            <RiArrowRightSLine
              key={`RiArrowRightSLine-${index}`}
              className={`${styles.arrow} inline-block md:mx-2 mx-1`}
            />
            <a
              className={`${styles.path_tx} text-xl ${
                currentPath === path ? styles.current : ""
              }`}
              href={currentPath}
              style={InterMedium.style}
            >
              {toPascalCase(item)}
            </a>
          </Fragment>
        );
      })}
    </div>
  );
};
