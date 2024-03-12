"use client";

import { usePathname } from "next/navigation";
import Provider from "../common/hooks/provider";
import { Inter } from "next/font/google";
import "../common/styles/globals.css";
import Navbar from "../common/components/Navbar";
import { Footer } from "../common/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const path = usePathname();
  return (
    <html lang="en">
      <head />
      <title>SIMPEN</title>
      <body className={inter.className}>
        {/* start excluded navbar */}
        {path != "/login" && <Navbar />}
        {/* end excluded navbar */}

        <Provider>{children}</Provider>
        <Footer />
      </body>
    </html>
  );
}
