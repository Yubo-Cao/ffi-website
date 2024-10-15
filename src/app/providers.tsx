"use client";

import SWRProvider from "@/components/Common/SWRProvider";
import { UserProvider } from "@/components/Common/UserProvider";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <SWRProvider>
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="light"
      >
        <UserProvider>{children}</UserProvider>
      </ThemeProvider>
    </SWRProvider>
  );
}
