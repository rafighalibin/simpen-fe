"use client";
import React from "react";
import { Background } from "../components/loginPage/background";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
