import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { getSiteSettings } from "@/lib/site-settings";

type MetadataPageType = "website" | "article" | "profile";

type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  canonicalUrl?: string;
  type?: MetadataPageType;
  imagePath?: string;
  twitterImagePath?: string;
  imageAlt?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  baseUrl?: string;
  siteName?: string;
  locale?: string;
  defaultImagePath?: string;
  defaultTwitterImagePath?: string;
};

export function buildMetadata({
  title,
  description,
  path,
  canonicalUrl,
  type = "website",
  imagePath = "/opengraph-image",
  twitterImagePath = "/twitter-image",
  imageAlt,
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
  section,
  baseUrl = siteConfig.url,
  siteName = siteConfig.name,
  locale = siteConfig.locale,
  defaultImagePath,
  defaultTwitterImagePath,
}: BuildMetadataOptions): Metadata {
  const canonical = canonicalUrl || absoluteUrl(path, baseUrl);
  const resolvedImagePath = imagePath ?? defaultImagePath ?? "/opengraph-image";
  const resolvedTwitterImagePath =
    twitterImagePath ?? defaultTwitterImagePath ?? resolvedImagePath;

  return {
    title,
    description,
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
      title,
      description,
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
      description,
      images: [absoluteUrl(resolvedTwitterImagePath, baseUrl)],
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
