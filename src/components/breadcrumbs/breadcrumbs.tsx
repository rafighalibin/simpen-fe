import React from "react";

// Import font and css
import styles from "./breadcurmbs.module.css";
import { usePathname } from "next/navigation";

const getPath = (path: String) => {
  const pathArr = path.split("/").filter((item) => item !== "");
  return pathArr;
};
const toPascalCase = (text: String) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
export const Breadcrumbs = () => {
  const path = usePathname();
  const pathArr = getPath(path);
  console.log(pathArr);
  return (
    <div className={`${styles.card_breadcrumbs} px-7 py-6`}>
      <a className="text-xl" href={`/dashboard`}>
        Home →{" "}
      </a>
      {pathArr.map((item, index) => {
        return (
          <a
            key={index}
            className="text-xl"
            href={`/${pathArr.slice(0, index + 1).join("/")}`}
          >
            {" "}
            {toPascalCase(item)}
            {index !== pathArr.length - 1 ? " → " : ""}
          </a>
        );
      })}
    </div>
  );
};
