"use client";

import { QueryClient } from "react-query";
import { LoginForm } from "../../components/loginPage/loginForm";
import { Background } from "../../components/loginPage/background";

// Import images

// Import images

export default function App() {
  return (
    <div>
      <div style={{ position: "relative", height: "100vh" }}>
        <Background />
        <div
          className="z-10 flex items-center justify-center h-full"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="max-w-xl w-full space-y-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ position: "relative", height: "100vh" }}>
        <Background />
        <div
          className="z-10 flex items-center justify-center h-full"
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="max-w-xl w-full space-y-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
