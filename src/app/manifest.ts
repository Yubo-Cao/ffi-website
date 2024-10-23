import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Future Finance Inc",
    short_name: "FFI",
    description:
      "Future Finance Inc is a student-run nonprofit financial education organization that provides free financial education to help young adults make informed decisions about their money.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#688eff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
