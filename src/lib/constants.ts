import { Noto_Serif, Inter } from "next/font/google";

export const NAME = "Future Finance Inc.";
export const DESCRIPTION =
  "Organization providing free, accessible financial education to all.";
export const LOGO = "/images/logo.svg";

export const FONT = Noto_Serif({
  weight: ["400", "700"],
  subsets: ["latin"],
});
export const INTER = Inter({ subsets: ["latin"] });

export const BASE_URL = "https://futurefinanceinc.org/";
