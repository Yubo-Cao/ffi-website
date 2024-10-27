import { BASE_URL, DESCRIPTION, NAME } from "@/lib/constants";
import { Metadata } from "next";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: NAME,
    template: `%s | ${NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "financial education",
    "financial literacy",
    "money management",
    "personal finance",
    "financial planning",
    "high school",
    "nonprofit",
  ],
  authors: [{ name: NAME }],
  creator: NAME,
  publisher: NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: NAME,
    title: NAME,
    description: DESCRIPTION,
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: `${NAME} - Financial Education Platform`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
