"use client";
import { redirect, usePathname } from "next/navigation";
import Provider from "../common/hooks/provider";
import { Inter } from "next/font/google";
import "../common/styles/globals.css";
import Navbar from "../common/components/Navbar";
import Footer from "../common/components/Footer";
import { AuthContextProvider } from "../common/utils/authContext";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const path = usePathname();
  return (
    <html lang="en">
      <head />
      <title>Simpen</title>
      <Provider>
        <AuthContextProvider>
          <body className={inter.className}>
          <div className="flex flex-col h-screen justify-between">
            {/* start excluded navbar */}
            {path != "/login" && <Navbar />}
            {/* end excluded navbar */}
            <main className="mb-auto h-10">
              <div className="mb-4">{children}</div>
              <Footer />
            </main>
          </div>
          </body>
        </AuthContextProvider>
      </Provider>
    </html>
  );
}
