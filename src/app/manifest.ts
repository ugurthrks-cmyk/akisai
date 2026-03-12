import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site-settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();

  return {
    name: settings.name,
    short_name: settings.shortName,
    description: settings.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#081120",
    theme_color: "#081120",
    lang: "tr",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
