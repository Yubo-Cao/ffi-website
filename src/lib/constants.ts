import { Inter, Rufina } from "next/font/google";

export const NAME = "Future Financing Inc.";
export const DESCRIPTION =
  "Organization providing free, accessible financial education to all.";
export const PLACEHOLDER = () => {
  alert("This is a placeholder function.");
};
export const LOGO = "/images/logo.png";

export const RUFINA = Rufina({ weight: ["400", "700"], subsets: ["latin"] });
export const INTER = Inter({ subsets: ["latin"] });
