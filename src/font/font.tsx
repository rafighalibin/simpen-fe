import { Poppins, Quicksand } from "next/font/google";

export const QuicksandReguler = Quicksand({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const QuicksandBold = Quicksand({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

export const PoppinsReguler = Poppins({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const PoppinsMedium = Poppins({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

export const PoppinsSemiBold = Poppins({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

export const PoppinsBold = Poppins({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

export const PoppinsLightItalic = Poppins({
  subsets: ["latin"],
  weight: "300",
  display: "swap",
  style: "italic",
});
