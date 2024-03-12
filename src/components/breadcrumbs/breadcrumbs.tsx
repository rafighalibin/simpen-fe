import React from "react";
import Link from "next/link";

export const Breadcrumbs = ({ crumbs }) => {
  return (
    <div>
      <nav aria-label="Breadcrumb">
        <ol className="breadcrumb">
          {crumbs.map((crumb, index) => (
            <li key={index} className="breadcrumb-item">
              {crumb.link ? (
                <Link href={crumb.link}>
                  <a>{crumb.label}</a>
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};
