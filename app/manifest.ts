import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zenfy",
    short_name: "Zenfy",
    description: "Gestão de tráfego, sites, sistemas e portal do cliente.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#06114f",
    icons: [
      {
        src: "/brand/zenfy/icone-zenfy.png",
        sizes: "any",
        type: "image/png"
      }
    ]
  };
}
