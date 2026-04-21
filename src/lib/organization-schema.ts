import { absoluteUrl } from "@/lib/content";
import type { ResolvedSiteSettings } from "@/lib/site-settings";

function getPreferredOrganizationLanguage(settings: ResolvedSiteSettings) {
  return settings.organizationLanguages.at(-1) || settings.locale.replace("_", "-");
}

export function buildOrganizationEntity(settings: ResolvedSiteSettings) {
  const areaServed =
    settings.organizationAreasServed.length > 0
      ? settings.organizationAreasServed.map((name) => ({
          "@type": "Country" as const,
          name,
        }))
      : undefined;

  return {
    "@type": "Organization" as const,
    name: settings.name,
    url: settings.url,
    ...(settings.socialProfiles.length > 0 ? { sameAs: settings.socialProfiles } : {}),
    logo: {
      "@type": "ImageObject" as const,
      url: absoluteUrl(settings.logoPath, settings.url),
    },
    description: settings.organizationDescription,
    ...(settings.organizationKnowsAbout.length > 0
      ? { knowsAbout: settings.organizationKnowsAbout }
      : {}),
    ...(settings.organizationLanguages.length > 0
      ? { knowsLanguage: settings.organizationLanguages }
      : {}),
    ...(areaServed
      ? { areaServed: areaServed.length === 1 ? areaServed[0] : areaServed }
      : {}),
  };
}

export function buildOrganizationSchema(settings: ResolvedSiteSettings) {
  return {
    "@context": "https://schema.org",
    ...buildOrganizationEntity(settings),
    inLanguage: getPreferredOrganizationLanguage(settings),
  };
}
