"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { LoginForm } from "../../components/loginPage/loginForm";

const queryClient = new QueryClient();

export default function App() {
  return <LoginForm />;
}
