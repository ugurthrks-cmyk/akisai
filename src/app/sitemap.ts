import type { MetadataRoute } from "next";
import {
  getAllAuthors,
  getAllCategories,
  getAllComparisons,
  getAllGuides,
  getAllPages,
  getAllTools,
} from "@/lib/content-source";
import { getManagedPagePath } from "@/lib/managed-pages";
import { getSiteSettings } from "@/lib/site-settings";

function toDate(value?: string | Date | null) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getLatestDate(values: Array<string | Date | null | undefined>) {
  return values.reduce<Date | null>((latest, value) => {
    const candidate = toDate(value);

    if (!candidate) {
      return latest;
    }

    if (!latest || candidate.getTime() > latest.getTime()) {
      return candidate;
    }

    return latest;
  }, null);
}

function toSitemapImages(...values: Array<string | null | undefined>) {
  const images = values.filter((value): value is string => typeof value === "string" && value.trim().length > 0);
  return images.length > 0 ? images : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, authors, tools, categories, comparisons, guides, pages] = await Promise.all([
    getSiteSettings(),
    getAllAuthors(),
    getAllTools(),
    getAllCategories(),
    getAllComparisons(),
    getAllGuides(),
    getAllPages(),
  ]);

  const baseUrl = settings.url;
  const toolHubLastModified = getLatestDate(
    tools.map((tool) => tool.dateModified || tool.updatedAt || tool.datePublished || tool.date),
  );
  const comparisonHubLastModified = getLatestDate(
    comparisons.map(
      (comparison) => comparison.dateModified || comparison.updatedAt || comparison.datePublished || comparison.date,
    ),
  );
  const guideHubLastModified = getLatestDate(
    guides.map((guide) => guide.dateModified || guide.updatedAt || guide.datePublished || guide.date),
  );
  const categoryHubLastModified = getLatestDate(categories.map((category) => category.updatedAt));
  const authorHubLastModified = getLatestDate(authors.map((author) => author.profileUpdatedAt || author.profileCreatedAt));
  const pageHubLastModified = getLatestDate(pages.map((page) => page.updatedAt));
  const siteLastModified =
    getLatestDate([
      toolHubLastModified,
      comparisonHubLastModified,
      guideHubLastModified,
      categoryHubLastModified,
      authorHubLastModified,
      pageHubLastModified,
    ]) ?? new Date();

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: siteLastModified,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/incelemeler`,
      lastModified: toolHubLastModified ?? siteLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/karsilastirma`,
      lastModified: comparisonHubLastModified ?? siteLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/rehber`,
      lastModified: guideHubLastModified ?? siteLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/kategori`,
      lastModified: categoryHubLastModified ?? siteLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/yazar`,
      lastModified: authorHubLastModified ?? siteLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    },
  ];

  const authorRoutes = authors.map((author) => ({
    url: `${baseUrl}/yazar/${author.slug}`,
    lastModified: toDate(author.profileUpdatedAt || author.profileCreatedAt) ?? siteLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/incelemeler/${tool.slug}`,
    lastModified: toDate(tool.dateModified || tool.updatedAt || tool.datePublished || tool.date) ?? siteLastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
    images: toSitemapImages(tool.featuredImageUrl, tool.logoUrl),
  }));

  const comparisonRoutes = comparisons.map((comparison) => ({
    url: `${baseUrl}/karsilastirma/${comparison.slug}`,
    lastModified:
      toDate(comparison.dateModified || comparison.updatedAt || comparison.datePublished || comparison.date) ??
      siteLastModified,
    changeFrequency: "weekly" as const,
    priority: 0.88,
    images: toSitemapImages(comparison.featuredImageUrl),
  }));

  const toolCountsByCategorySlug = new Map<string, number>();
  for (const tool of tools) {
    if (!tool.categorySlug) {
      continue;
    }

    toolCountsByCategorySlug.set(tool.categorySlug, (toolCountsByCategorySlug.get(tool.categorySlug) ?? 0) + 1);
  }

  const categoryRoutes = categories
    .filter((category) => !category.noIndex && (toolCountsByCategorySlug.get(category.slug) ?? 0) > 0)
    .map((category) => ({
      url: `${baseUrl}/kategori/${category.slug}`,
      lastModified: toDate(category.updatedAt) ?? siteLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  const guideRoutes = guides.map((guide) => ({
    url: `${baseUrl}/rehber/${guide.slug}`,
    lastModified: toDate(guide.dateModified || guide.updatedAt || guide.datePublished || guide.date) ?? siteLastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
    images: toSitemapImages(guide.featuredImageUrl),
  }));

  const pageRoutes = pages
    .filter((page) => !page.noIndex)
    .map((page) => ({
      url: `${baseUrl}${getManagedPagePath(page.slug)}`,
      lastModified: toDate(page.updatedAt) ?? siteLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));

  const routeMap = new Map<string, MetadataRoute.Sitemap[number]>();

  [
    ...staticRoutes,
    ...authorRoutes,
    ...toolRoutes,
    ...comparisonRoutes,
    ...categoryRoutes,
    ...guideRoutes,
    ...pageRoutes,
  ].forEach((entry) => {
    routeMap.set(entry.url, entry);
  });

  return Array.from(routeMap.values());
}
