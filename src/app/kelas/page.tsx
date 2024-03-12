"use client";

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import React from "react";
import { request } from "http";
import { KelasTable} from "../../components/kelasPage/kelasTable";

export default function Page() {
    return (
    <div>
        <KelasTable/>
    </div>
    );
}