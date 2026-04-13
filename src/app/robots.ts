import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site-settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const disallowRules = [
    "/admin",
    "/admin/",
    "/admin/*",
    "/arama",
    "/arama/",
    "/arama/*",
    "/search",
    "/search/",
    "/search/*",
    "/api",
    "/api/",
    "/api/*",
  ];

  return {
    rules: [
      {
        userAgent: ["OAI-SearchBot", "GPTBot", "Google-Extended", "ClaudeBot"],
        allow: "/",
        disallow: disallowRules,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowRules,
      },
    ],
    sitemap: `${settings.url}/sitemap.xml`,
    host: settings.url,
  };
}
