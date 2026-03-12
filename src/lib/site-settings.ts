import { cache } from "react";
import { groq } from "next-sanity";
import { siteConfig } from "@/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { sanityLiveClient } from "@/sanity/lib/live-client";

export type ResolvedSiteSettings = {
  name: string;
  shortName: string;
  defaultTitle: string;
  description: string;
  url: string;
  locale: string;
  category: string;
  logoPath: string;
  organizationDescription: string;
  socialProfiles: string[];
  defaultSocialImageUrl?: string;
  defaultSocialImageAlt?: string;
};

type SanitySiteSettings = {
  siteName?: string;
  shortName?: string;
  siteUrl?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  organizationDescription?: string;
  socialProfiles?: unknown;
  defaultSocialImageUrl?: string;
  defaultSocialImageAlt?: string;
};

const siteSettingsQuery = groq`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  siteName,
  shortName,
  siteUrl,
  defaultTitle,
  defaultDescription,
  organizationDescription,
  socialProfiles,
  "defaultSocialImageUrl": defaultSocialImage.asset->url,
  "defaultSocialImageAlt": defaultSocialImage.alt
}`;

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function buildFallbackSettings(): ResolvedSiteSettings {
  return {
    name: siteConfig.name,
    shortName: siteConfig.shortName,
    defaultTitle: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.locale,
    category: siteConfig.category,
    logoPath: siteConfig.logoPath,
    organizationDescription: siteConfig.description,
    socialProfiles: [],
  };
}

export const getSiteSettings = cache(async (): Promise<ResolvedSiteSettings> => {
  const fallback = buildFallbackSettings();

  if (!isSanityConfigured) {
    return fallback;
  }

  const settings = await sanityLiveClient.fetch<SanitySiteSettings | null>(
    siteSettingsQuery,
    {},
    { cache: "no-store" },
  );

  if (!settings) {
    return fallback;
  }

  return {
    ...fallback,
    name: settings.siteName || fallback.name,
    shortName: settings.shortName || settings.siteName || fallback.shortName,
    defaultTitle: settings.defaultTitle || fallback.defaultTitle,
    description: settings.defaultDescription || fallback.description,
    url: settings.siteUrl || fallback.url,
    organizationDescription:
      settings.organizationDescription || settings.defaultDescription || fallback.description,
    socialProfiles: asStringArray(settings.socialProfiles),
    defaultSocialImageUrl: settings.defaultSocialImageUrl,
    defaultSocialImageAlt: settings.defaultSocialImageAlt,
  };
});
