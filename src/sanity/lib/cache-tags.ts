export const SANITY_BASE_TAG = "sanity";

export const sanityTags = {
  siteSettings: "sanity:site-settings",
  tools: "sanity:tools",
  guides: "sanity:guides",
  categories: "sanity:categories",
  pages: "sanity:pages",
  authors: "sanity:authors",
} as const;

export function getSanitySlugTag(prefix: string, slug?: string) {
  return slug ? `${prefix}:${slug}` : undefined;
}

export function getSanityTypeTag(type?: string) {
  switch (type) {
    case "siteSettings":
      return sanityTags.siteSettings;
    case "tool":
      return sanityTags.tools;
    case "guide":
      return sanityTags.guides;
    case "category":
      return sanityTags.categories;
    case "page":
      return sanityTags.pages;
    case "author":
      return sanityTags.authors;
    default:
      return undefined;
  }
}

export function uniqueSanityTags(...groups: Array<Array<string | undefined> | undefined>) {
  return Array.from(
    new Set(
      groups
        .flatMap((group) => group ?? [])
        .filter((tag): tag is string => typeof tag === "string" && tag.length > 0),
    ),
  );
}
