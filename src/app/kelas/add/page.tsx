"use client";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import React from "react";
import { request } from "http";
import { AddKelas } from "../../../components/kelasPage/addKelas";

export default function Page() {
    return (
    <div>
        <AddKelas/>
    </div>
    );
}