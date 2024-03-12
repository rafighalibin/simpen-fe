"use client";
import React from "react";
import Image from "next/image";

import { useMutation } from "react-query";
import { useState } from "react";
import { PoppinsBold, QuicksandReguler } from "../../font/font";
import { useToken } from "../../common/hooks/useToken";
import { useRouter } from "next/navigation";

// font and css
import { InterMedium, InterReguler } from "../../font/font";
import styles from "./loginForm.module.css";

// import images
import logo from "../../../public/Logo.png";
import { get } from "http";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setPenggunaToken, getPenggunaToken } = useToken();
  const router = useRouter();

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
      if (data.code == 200) {
        console.log(data.content);
        document.cookie = `Authorization=${data.content}`;
        router.push("/dashboard");
      } else if (data.code == 401) {
        setError("Incorrect email or password.");
      } else {
        setError("Could not sign in.");
      }
    },
  });

  return (
    <div className="container">
      <div className={`${styles.logoContainer} mb-[20px]`}>
        <Image src={logo} className={`${styles.logo}`} alt="Logo" />
      </div>
      <div className={`${styles.card} shadow-lg p-[5%]`}>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            await loginMutation();
          }}
        >
          <input type="hidden" name="remember" value="true" />
          <div>
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-[10px]`}
            >
              Email Kalananti
            </div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10`}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={InterReguler.style}
            />
          </div>

          <div>
            <div
              style={InterMedium.style}
              className={`${styles.form_title} mb-[10px] mt-[30px]`}
            >
              Password
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={`${styles.form_placeholder} appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  rounded-md focus:outline-none focus:ring-[#66A2DC] focus:border-[#66A2DC] focus:z-10 sm:text-sm`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={InterReguler.style}
            />
          </div>
          {/* </div> */}

          {/* <div className="flex items-center justify-between">
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
          </div> */}

          <div>
            {error && (
              <div
                className="bg-[#ffcfcf] text-red-500 text-sm px-4 py-2"
                style={InterReguler.style}
              >
                {error}
              </div>
            )}
            <button
              type="submit"
              className={`${styles.button_tx} ${styles.btn} mt-[25px]`}
              style={InterMedium.style}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
