import React from "react";

import { useMutation } from "react-query";
import { useState } from "react";

// font and css
import { PoppinsBold, QuicksandReguler, QuicksandBold } from "../../font/font";
import styles from "./loginForm.module.css";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutateAsync: loginMutation, data } = useMutation({
    mutationFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      console.log(data.content);
      document.cookie = `Authorization=${data.content}`;
    },
  });

  return (
    <div className="bg-[#215E9B] min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-[10%]">
          <div>
            <div className={`${styles.heading1}`} style={PoppinsBold.style}>
              SIMPEN
            </div>
            <div className={`${styles.heading2}`} style={QuicksandBold.style}>
              Integrated Pest Management System
            </div>
          </div>
          <form
            className="mt-8 space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              await loginMutation();
              // TODO: Redirect to dashboard
            }}
          >
            <input type="hidden" name="remember" value="true" />
            {/* <div className="rounded-md shadow-sm -space-y-px"> */}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={QuicksandReguler.style}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={QuicksandReguler.style}
              />
            </div>
            {/* </div> */}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                  style={QuicksandReguler.style}
                >
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`${styles.button_tx} group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#66A2DC] hover:bg-[#215E9B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                style={QuicksandBold.style}
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
