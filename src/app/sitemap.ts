import type { MetadataRoute } from "next";
import { getAllAuthors, getAllCategories, getAllGuides, getAllPages, getAllTools } from "@/lib/content-source";
import { getManagedPagePath } from "@/lib/managed-pages";
import { getSiteSettings } from "@/lib/site-settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, authors, tools, categories, guides, pages] = await Promise.all([
    getSiteSettings(),
    getAllAuthors(),
    getAllTools(),
    getAllCategories(),
    getAllGuides(),
    getAllPages(),
  ]);

  const baseUrl = settings.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/ai",
    "/rehber",
    "/kategori",
    "/yazar",
    "/sayfa",
    "/hakkimizda",
    "/yayin-ilkeleri",
    "/iletisim",
    "/gizlilik",
    "/kullanim-kosullari",
    "/cerez-politikasi",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : 0.8,
  }));

  const authorRoutes = authors.map((author) => ({
    url: `${baseUrl}/yazar/${author.slug}`,
    lastModified: author.profileUpdatedAt ? new Date(author.profileUpdatedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/ai/${tool.slug}`,
    lastModified: new Date(tool.dateModified || tool.datePublished || now),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/kategori/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const guideRoutes = guides.map((guide) => ({
    url: `${baseUrl}/rehber/${guide.slug}`,
    lastModified: new Date(guide.dateModified || guide.datePublished || now),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const pageRoutes = pages
    .filter((page) => !page.noIndex)
    .map((page) => ({
      url: `${baseUrl}${getManagedPagePath(page.slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));

  const routeMap = new Map<string, MetadataRoute.Sitemap[number]>();

  [...staticRoutes, ...authorRoutes, ...toolRoutes, ...categoryRoutes, ...guideRoutes, ...pageRoutes].forEach(
    (entry) => {
      routeMap.set(entry.url, entry);
    },
  );

  return Array.from(routeMap.values());
}
