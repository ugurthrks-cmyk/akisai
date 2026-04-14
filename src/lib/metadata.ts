import type { Metadata } from "next";
import { absoluteUrl, normalizeAbsoluteUrl } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/site-settings";

type MetadataPageType = "website" | "article" | "profile";

type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  canonicalUrl?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  type?: MetadataPageType;
  imagePath?: string;
  twitterImagePath?: string;
  imageAlt?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  metadataAuthors?: Array<{ name: string; url?: string }>;
  creator?: string;
  publisher?: string;
  baseUrl?: string;
  siteName?: string;
  locale?: string;
  defaultImagePath?: string;
  defaultTwitterImagePath?: string;
};

function clampText(value: string, limit: number) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= limit) {
    return normalized;
  }

  const maxLengthWithoutEllipsis = Math.max(limit - 3, 0);
  const sliced = normalized.slice(0, maxLengthWithoutEllipsis + 1);
  const lastWordBoundary = sliced.lastIndexOf(" ");
  const truncated =
    lastWordBoundary >= Math.floor(maxLengthWithoutEllipsis * 0.6)
      ? sliced.slice(0, lastWordBoundary)
      : normalized.slice(0, maxLengthWithoutEllipsis);

  return `${truncated.trim()}...`;
}

export function buildMetadata({
  title,
  description,
  path,
  canonicalUrl,
  openGraphTitle,
  openGraphDescription,
  type = "website",
  imagePath = "/opengraph-image",
  twitterImagePath = "/twitter-image",
  imageAlt,
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
  section,
  metadataAuthors,
  creator,
  publisher,
  baseUrl = siteConfig.url,
  siteName = siteConfig.name,
  locale = siteConfig.locale,
  defaultImagePath,
  defaultTwitterImagePath,
}: BuildMetadataOptions): Metadata {
  const normalizedDescription = clampText(description, 155);
  const normalizedOpenGraphDescription = clampText(openGraphDescription || description, 200);
  const canonical = normalizeAbsoluteUrl(canonicalUrl || absoluteUrl(path, baseUrl));
  const resolvedImagePath = imagePath ?? defaultImagePath ?? "/opengraph-image";
  const resolvedTwitterImagePath =
    twitterImagePath ?? defaultTwitterImagePath ?? resolvedImagePath;

  return {
    title,
    description: normalizedDescription,
    ...(metadataAuthors ? { authors: metadataAuthors } : {}),
    ...(creator ? { creator } : {}),
    ...(publisher ? { publisher } : {}),
    alternates: {
      canonical,
    },
    robots: {
      index: !noIndex,
      follow: true,
      googleBot: {
        index: !noIndex,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: openGraphTitle || title,
      description: normalizedOpenGraphDescription,
      url: canonical,
      siteName,
      locale,
      type,
      images: [
        {
          url: absoluteUrl(resolvedImagePath, baseUrl),
          alt: imageAlt ?? title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
      ...(section ? { section } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: normalizedDescription,
      images: [absoluteUrl(resolvedTwitterImagePath, baseUrl)],
    },
    other: {
      "geo.region": "TR",
      "geo.placename": "Türkiye",
      ...(modifiedTime ? { "last-modified": modifiedTime } : {}),
    },
  };
}

type BuildSiteMetadataOptions = Omit<
  BuildMetadataOptions,
  "baseUrl" | "siteName" | "locale" | "defaultImagePath" | "defaultTwitterImagePath"
>;

export async function buildSiteMetadata(
  options: BuildSiteMetadataOptions,
): Promise<Metadata> {
  const settings = await getSiteSettings();

  return buildMetadata({
    ...options,
    baseUrl: settings.url,
    siteName: settings.name,
    locale: settings.locale,
    defaultImagePath: settings.defaultSocialImageUrl || "/opengraph-image",
    defaultTwitterImagePath: settings.defaultSocialImageUrl || "/twitter-image",
    imageAlt: options.imageAlt ?? settings.defaultSocialImageAlt ?? options.title,
  });
}
