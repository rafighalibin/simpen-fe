"use client";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "react-query";
import { useState } from "react";
import { LawyerForm } from "../../../components/LawyerPage/lawyerForm";

export default function Page() {
  return <LawyerForm />;
}
