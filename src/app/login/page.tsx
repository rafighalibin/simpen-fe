"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { LoginForm } from "../../components/loginPage/loginForm";
// import { Background } from "../../components/loginPage/background";

const queryClient = new QueryClient();

export default function App() {
  return (
    <div>
      <LoginForm />
      {/* <Background /> */}
    </div>
  );
}
