import { getManagedPagePath } from "@/lib/managed-pages";
import {
  SANITY_BASE_TAG,
  getSanitySlugTag,
  getSanityTypeTag,
  sanityTags,
  uniqueSanityTags,
} from "@/sanity/lib/cache-tags";

export type SanityWebhookPayload = {
  _id?: string;
  _type?: string;
  slug?: string;
  oldSlug?: string;
  categorySlug?: string;
  previousCategorySlug?: string;
};

function normalizeSlug(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function getPagePaths(slug?: string) {
  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug) {
    return ["/"];
  }

  return [getManagedPagePath(normalizedSlug)];
}

export function getSanityRevalidationTargets(payload: SanityWebhookPayload) {
  const type = payload._type;
  const slug = normalizeSlug(payload.slug);
  const oldSlug = normalizeSlug(payload.oldSlug);
  const categorySlug = normalizeSlug(payload.categorySlug);
  const previousCategorySlug = normalizeSlug(payload.previousCategorySlug);

  const tags = uniqueSanityTags(
    [SANITY_BASE_TAG, getSanityTypeTag(type)],
    type === "tool" ? [getSanitySlugTag("sanity:tool", slug), getSanitySlugTag("sanity:tool", oldSlug)] : [],
    type === "comparison"
      ? [getSanitySlugTag("sanity:comparison", slug), getSanitySlugTag("sanity:comparison", oldSlug)]
      : [],
    type === "guide" ? [getSanitySlugTag("sanity:guide", slug), getSanitySlugTag("sanity:guide", oldSlug)] : [],
    type === "category"
      ? [getSanitySlugTag("sanity:category", slug), getSanitySlugTag("sanity:category", oldSlug)]
      : [],
    type === "page" ? [getSanitySlugTag("sanity:page", slug), getSanitySlugTag("sanity:page", oldSlug)] : [],
    type === "author"
      ? [getSanitySlugTag("sanity:author", slug), getSanitySlugTag("sanity:author", oldSlug)]
      : [],
  );

  const paths = Array.from(
    new Set(
      [
        "/",
        "/incelemeler",
        "/karsilastirma",
        "/rehber",
        "/kategori",
        "/yazar",
        type === "tool" && slug ? `/incelemeler/${slug}` : undefined,
        type === "tool" && oldSlug ? `/incelemeler/${oldSlug}` : undefined,
        type === "comparison" && slug ? `/karsilastirma/${slug}` : undefined,
        type === "comparison" && oldSlug ? `/karsilastirma/${oldSlug}` : undefined,
        type === "guide" && slug ? `/rehber/${slug}` : undefined,
        type === "guide" && oldSlug ? `/rehber/${oldSlug}` : undefined,
        type === "category" && slug ? `/kategori/${slug}` : undefined,
        type === "category" && oldSlug ? `/kategori/${oldSlug}` : undefined,
        type === "page" ? undefined : categorySlug ? `/kategori/${categorySlug}` : undefined,
        type === "page" ? undefined : previousCategorySlug ? `/kategori/${previousCategorySlug}` : undefined,
        type === "author" && slug ? `/yazar/${slug}` : undefined,
        type === "author" && oldSlug ? `/yazar/${oldSlug}` : undefined,
        ...(type === "page" ? getPagePaths(slug) : []),
      ].filter((path): path is string => typeof path === "string" && path.length > 0),
    ),
  );

  const essentialTags = uniqueSanityTags(
    [sanityTags.siteSettings],
    type === "tool" || type === "category" ? [sanityTags.tools, sanityTags.categories] : [],
    type === "comparison" ? [sanityTags.comparisons, sanityTags.tools, sanityTags.categories] : [],
    type === "guide" ? [sanityTags.guides] : [],
    type === "author" ? [sanityTags.authors] : [],
    type === "page" ? [sanityTags.pages] : [],
  );

  return {
    tags: uniqueSanityTags(tags, essentialTags),
    paths,
  };
}
