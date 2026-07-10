import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PROJECT VICE // MAHARSHI.EXE — Maharshi Barot",
    short_name: "PROJECT VICE",
    description:
      "Interactive neon-noir portfolio of Maharshi Barot — AI Solutions Developer & Full-Stack Engineer, played like an open-world game.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0512",
    theme_color: "#0a0512",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
