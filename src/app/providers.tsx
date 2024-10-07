"use client";

import { ThemeProvider } from "next-themes";
import { UserProvider } from "@/components/Common/UserProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="ligt">
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
}
