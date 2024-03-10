import React, { ReactNode } from "react";

interface BackgroundProps {
  children: ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: `url('/loginBG.png')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      {children}
    </div>
  );
};

export default Background;
