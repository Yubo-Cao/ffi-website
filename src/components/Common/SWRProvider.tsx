import { SWRConfig } from "swr";

function localStorageProvider() {
  if (typeof window === "undefined") return new Map(); // SSR
  const map = new Map<string, unknown>(
    JSON.parse(localStorage.getItem("app-cache") || "[]"),
  );
  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("app-cache", appCache);
  });
  return map;
}

export default function SWRProvider({ children }) {
  return (
    <SWRConfig value={{ provider: localStorageProvider }}>{children}</SWRConfig>
  );
}
