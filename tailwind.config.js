/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#215E9B",
        secondary: "#F2AE00",
        accent: "#F87E0D",
        neutral: "#1E1E1E",
        base: "#FCFCFC",
        info: "#215E9B",
        success: "#22AD5C",
        warning: "#F87E0D",
        error: "#F23030",
      },
    },
  },
  plugins: [],
};
