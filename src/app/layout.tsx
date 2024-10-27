import "../styles/index.css";
import { Providers } from "./providers";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { FONT, INTER, NAME } from "@/lib/constants";
import { SpeedInsights } from "@vercel/speed-insights/next";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      {/* ref: https://realfavicongenerator.net */}
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-48x48.png"
          sizes="48x48"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="FFI" />
        <link rel="manifest" href="/site.webmanifest" />

        <link rel="preload" href="/images/logo.svg" as="image" />
        <title>{NAME}</title>
      </head>

      <body
        className={`bg-[#FCFCFC] dark:bg-black ${FONT.className} scroll-smooth`}
      >
        <Providers>
          <Header />
          {children}
          <Footer />
          {/*<ScrollToTop />*/}
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
