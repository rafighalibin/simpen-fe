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
        primaryForeground: "#EDF6FF",
        secondary: "#F2AE00",
        accent: "#F87E0D",
        neutral: "#1E1E1E",
        base: "#FFFFFF",
        info: "#66A2DC",
        infoHover: "#4C8CB8", 
        success: "#22AD5C",
        successHover: "#1E944F", 
        warning: "#F87E0D",
        warningHover: "#D76E0B",
        error: "#CB4C4B",
        errorHover: "#A93E3D" 
      },
    },
  },
  plugins: [],
};
