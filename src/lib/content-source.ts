import { cache } from "react";
import { groq } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";
import { authors } from "@/data/authors";
import { getAllFilesFrontMatter, getFileBySlug } from "@/lib/mdx";
import { siteConfig } from "@/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { sanityLiveClient } from "@/sanity/lib/live-client";

export type SourceItem = {
  label: string;
  url: string;
  publisher?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type GuideStep = {
  title: string;
  description: string;
};

export type MediaAsset = {
  url: string;
  alt?: string;
  caption?: string;
};

export type RichBody =
  | {
      kind: "mdx";
      source: string;
    }
  | {
      kind: "portableText";
      value: PortableTextBlock[];
    };

export interface DirectoryAuthor {
  id: string;
  name: string;
  fullName: string;
  slug: string;
  role: string;
  university: string;
  experience: string;
  bio: string;
  metaDescription?: string;
  avatarUrl: string;
  avatarAlt?: string;
  profileUrl: string;
  profileCreatedAt?: string;
  profileUpdatedAt?: string;
  methodologyFocus: string;
  expertise: string[];
  credentials: string[];
  sameAs: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface ToolSummary {
  slug: string;
  name: string;
  title?: string;
  h1?: string;
  description: string;
  metaDescription?: string;
  heroIntro?: string;
  category?: string;
  categorySlug?: string;
  author?: DirectoryAuthor | null;
  pricing?: string;
  tags: string[];
  hasFreeTier: boolean;
  isTRSupported: boolean;
  websiteUrl?: string;
  priceAmount?: string;
  priceCurrency?: string;
  logoUrl?: string;
  logoAlt?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  date?: string;
  datePublished?: string;
  dateModified?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface ToolEntry extends ToolSummary {
  body: RichBody;
  pros: string[];
  cons: string[];
  faqs: FaqItem[];
  screenshots: MediaAsset[];
}

export interface GuideSummary {
  slug: string;
  title: string;
  h1?: string;
  name?: string;
  description: string;
  metaDescription?: string;
  heroIntro?: string;
  category?: string;
  categorySlug?: string;
  author?: DirectoryAuthor | null;
  difficulty?: string;
  time?: string;
  estimatedTimeMinutes?: number;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  date?: string;
  datePublished?: string;
  dateModified?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface GuideEntry extends GuideSummary {
  body: RichBody;
  tools: string[];
  faqs: FaqItem[];
}

export interface CategorySummary {
  slug: string;
  name: string;
  description: string;
  metaDescription?: string;
  heroIntro?: string;
  iconUrl?: string;
  iconAlt?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface CategoryEntry extends CategorySummary {
  body: RichBody;
  featuredToolSlugs?: string[];
}

export interface PageEntry {
  slug: string;
  title: string;
  description: string;
  metaDescription?: string;
  pageType?: string;
  body: RichBody;
  canonicalUrl?: string;
  noIndex?: boolean;
}

type LocalRecord = Record<string, unknown> & { slug: string };

type SanityAuthorValue = {
  slug?: string;
  name?: string;
  fullName?: string;
  role?: string;
  university?: string;
  experience?: string;
  bio?: string;
  metaDescription?: string;
  avatarUrl?: string;
  avatarAlt?: string;
  methodologyFocus?: string;
  expertise?: unknown;
  credentials?: unknown;
  sameAs?: unknown;
  canonicalUrl?: string;
  noIndex?: boolean;
  _createdAt?: string;
  _updatedAt?: string;
};

type SanityToolValue = {
  slug?: string;
  name?: string;
  title?: string;
  h1?: string;
  description?: string;
  metaDescription?: string;
  heroIntro?: string;
  category?: string;
  categorySlug?: string;
  author?: SanityAuthorValue;
  pricing?: string;
  tags?: unknown;
  hasFreeTier?: boolean;
  isTRSupported?: boolean;
  websiteUrl?: string;
  priceAmount?: number | string;
  priceCurrency?: string;
  logoUrl?: string;
  logoAlt?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  bodyMarkdown?: string;
  body?: PortableTextBlock[];
  screenshots?: unknown;
  pros?: unknown;
  cons?: unknown;
  faqs?: unknown;
  datePublished?: string;
  dateModified?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

type SanityGuideValue = {
  slug?: string;
  title?: string;
  h1?: string;
  description?: string;
  metaDescription?: string;
  heroIntro?: string;
  category?: string;
  categorySlug?: string;
  author?: SanityAuthorValue;
  difficulty?: string;
  estimatedTimeMinutes?: number;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  bodyMarkdown?: string;
  body?: PortableTextBlock[];
  tools?: unknown;
  faqs?: unknown;
  datePublished?: string;
  dateModified?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

type SanityCategoryValue = {
  slug?: string;
  name?: string;
  description?: string;
  metaDescription?: string;
  heroIntro?: string;
  iconUrl?: string;
  iconAlt?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  bodyMarkdown?: string;
  body?: PortableTextBlock[];
  featuredToolSlugs?: unknown;
};

type SanityPageValue = {
  slug?: string;
  title?: string;
  description?: string;
  metaDescription?: string;
  pageType?: string;
  body?: PortableTextBlock[];
  canonicalUrl?: string;
  noIndex?: boolean;
};

const authorProjection = `
  "slug": slug.current,
  name,
  fullName,
  role,
  university,
  experience,
  bio,
  metaDescription,
  "avatarUrl": avatar.asset->url,
  "avatarAlt": avatar.alt,
  methodologyFocus,
  expertise,
  credentials,
  sameAs,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex,
  _createdAt,
  _updatedAt
`;

const toolListQuery = groq`*[_type == "tool" && defined(slug.current)] | order(coalesce(dateModified, datePublished, _updatedAt) desc) {
  "slug": slug.current,
  name,
  title,
  h1,
  description,
  metaDescription,
  heroIntro,
  pricing,
  tags,
  hasFreeTier,
  isTRSupported,
  websiteUrl,
  priceAmount,
  priceCurrency,
  datePublished,
  dateModified,
  "category": category->name,
  "categorySlug": category->slug.current,
  "logoUrl": logo.asset->url,
  "logoAlt": logo.alt,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex,
  bodyMarkdown,
  "author": author->{${authorProjection}}
}`;

const toolBySlugQuery = groq`*[_type == "tool" && slug.current == $slug][0] {
  "slug": slug.current,
  name,
  title,
  h1,
  description,
  metaDescription,
  heroIntro,
  pricing,
  hasFreeTier,
  isTRSupported,
  websiteUrl,
  priceAmount,
  priceCurrency,
  tags,
  pros,
  cons,
  faqs,
  body,
  screenshots[]{
    "url": asset->url,
    alt,
    caption
  },
  datePublished,
  dateModified,
  "category": category->name,
  "categorySlug": category->slug.current,
  "logoUrl": logo.asset->url,
  "logoAlt": logo.alt,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex,
  bodyMarkdown,
  "author": author->{${authorProjection}}
}`;

const guideListQuery = groq`*[_type == "guide" && defined(slug.current)] | order(coalesce(dateModified, datePublished, _updatedAt) desc) {
  "slug": slug.current,
  title,
  h1,
  description,
  metaDescription,
  heroIntro,
  difficulty,
  estimatedTimeMinutes,
  datePublished,
  dateModified,
  "category": category->name,
  "categorySlug": category->slug.current,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex,
  bodyMarkdown,
  "author": author->{${authorProjection}}
}`;

const guideBySlugQuery = groq`*[_type == "guide" && slug.current == $slug][0] {
  "slug": slug.current,
  title,
  h1,
  description,
  metaDescription,
  heroIntro,
  difficulty,
  estimatedTimeMinutes,
  faqs,
  body,
  datePublished,
  dateModified,
  "category": category->name,
  "categorySlug": category->slug.current,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex,
  "tools": relatedTools[]->name,
  bodyMarkdown,
  "author": author->{${authorProjection}}
}`;

const categoryListQuery = groq`*[_type == "category" && defined(slug.current)] | order(name asc) {
  "slug": slug.current,
  name,
  description,
  metaDescription,
  heroIntro,
  bodyMarkdown,
  "iconUrl": icon.asset->url,
  "iconAlt": icon.alt,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex
}`;

const categoryBySlugQuery = groq`*[_type == "category" && slug.current == $slug][0] {
  "slug": slug.current,
  name,
  description,
  metaDescription,
  heroIntro,
  bodyMarkdown,
  body,
  "iconUrl": icon.asset->url,
  "iconAlt": icon.alt,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex,
  "featuredToolSlugs": featuredTools[]->slug.current
}`;

const pageListQuery = groq`*[_type == "page" && defined(slug.current)] | order(title asc) {
  "slug": slug.current,
  title,
  description,
  metaDescription,
  pageType,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex
}`;

const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0] {
  "slug": slug.current,
  title,
  description,
  metaDescription,
  pageType,
  body,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex
}`;

const authorListQuery = groq`*[_type == "author" && defined(slug.current)] | order(fullName asc) {
  ${authorProjection}
}`;

const authorBySlugQuery = groq`*[_type == "author" && slug.current == $slug][0] {
  ${authorProjection}
}`;

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function normalizeAuthorText(value?: string) {
  if (!value) {
    return value;
  }

  return value
    .replace(/\bAI tool evaluation\b/gi, "yapay zeka araç değerlendirmesi")
    .replace(/\bLLM market analysis\b/gi, "büyük dil modeli pazar çözümlemesi")
    .replace(/\bTurkey localization\b/gi, "Türkiye yerelleştirmesi")
    .replace(/\bpricing research\b/gi, "fiyatlandırma araştırması")
    .replace(/\bcontent operations\b/gi, "içerik operasyonları")
    .replace(/\bworkflow automation\b/gi, "iş akışı otomasyonu")
    .replace(/\bno-code architecture\b/gi, "kodsuz sistem mimarisi")
    .replace(/\bAI operations\b/gi, "yapay zeka operasyonları")
    .replace(/\bprocess design\b/gi, "süreç tasarımı")
    .replace(/\bno-code\b/gi, "kodsuz")
    .replace(/\bAI\b/g, "yapay zeka");
}

function normalizeAuthorArray(values: string[]) {
  return values.map((value) => normalizeAuthorText(value) || value);
}

function normalizeDisplayAuthorText(value?: string) {
  return value
    ?.replace(/\bYapay Zeka\b/g, "Yapay Zekâ")
    .replace(/\byapay zeka\b/g, "yapay zekâ")
    .replace(/\bAI tool evaluation\b/gi, "yapay zekâ araç değerlendirmesi")
    .replace(/\bLLM market analysis\b/gi, "büyük dil modeli pazar çözümlemesi")
    .replace(/\bTurkey localization\b/gi, "Türkiye yerelleştirmesi")
    .replace(/\bpricing research\b/gi, "fiyatlandırma araştırması")
    .replace(/\bcontent operations\b/gi, "içerik operasyonları")
    .replace(/\bworkflow automation\b/gi, "iş akışı otomasyonu")
    .replace(/\bno-code architecture\b/gi, "kodsuz sistem mimarisi")
    .replace(/\bAI operations\b/gi, "yapay zekâ operasyonları")
    .replace(/\bprocess design\b/gi, "süreç tasarımı")
    .replace(/\bAI\b/g, "yapay zekâ");
}

function normalizeDisplayAuthorArray(values: string[]) {
  return values.map((value) => normalizeDisplayAuthorText(value) || value);
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function asFaqArray(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const items: FaqItem[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const question = asString(record.question);
    const answer = asString(record.answer);

    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items;
}

function asSourceArray(value: unknown): SourceItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const items: SourceItem[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const label = asString(record.label);
    const url = asString(record.url);

    if (label && url) {
      items.push({
        label,
        url,
        publisher: asString(record.publisher),
      });
    }
  }

  return items;
}

function asGuideSteps(value: unknown): GuideStep[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const items: GuideStep[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const title = asString(record.title);
    const description = asString(record.description);

    if (title && description) {
      items.push({ title, description });
    }
  }

  return items;
}

function asMediaAssets(value: unknown): MediaAsset[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const items: MediaAsset[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const record = item as Record<string, unknown>;
    const url = asString(record.url);

    if (url) {
      items.push({
        url,
        alt: asString(record.alt),
        caption: asString(record.caption),
      });
    }
  }

  return items;
}

function toMinuteLabel(minutes?: number) {
  return typeof minutes === "number" && minutes > 0 ? `${minutes} dakika` : undefined;
}

function parseMinutes(label?: string) {
  if (!label) {
    return undefined;
  }

  const match = label.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

function toDateValue(...values: Array<string | undefined>) {
  for (const value of values) {
    if (!value) {
      continue;
    }

    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.getTime();
    }
  }

  return 0;
}

function sortByFreshness<T extends { date?: string; datePublished?: string; dateModified?: string }>(
  items: T[],
) {
  return [...items].sort(
    (left, right) =>
      toDateValue(right.dateModified, right.datePublished, right.date) -
      toDateValue(left.dateModified, left.datePublished, left.date),
  );
}

function mergeBySlug<T extends { slug: string }>(preferred: T[], fallback: T[]) {
  const merged = new Map<string, T>();

  for (const item of fallback) {
    merged.set(item.slug, item);
  }

  for (const item of preferred) {
    merged.set(item.slug, item);
  }

  return Array.from(merged.values());
}

function mapLocalAuthor(id: string, author: (typeof authors)[keyof typeof authors]): DirectoryAuthor {
  return {
    id,
    name: author.name,
    fullName: author.fullName,
    slug: author.slug,
    role: normalizeDisplayAuthorText(author.role) || author.role,
    university: normalizeDisplayAuthorText(author.university) || author.university,
    experience: normalizeDisplayAuthorText(author.experience) || author.experience,
    bio: normalizeDisplayAuthorText(author.bio) || author.bio,
    metaDescription: normalizeDisplayAuthorText(author.metaDescription) || normalizeDisplayAuthorText(author.bio) || author.bio,
    avatarUrl: author.avatarUrl,
    avatarAlt: undefined,
    profileUrl: author.profileUrl,
    profileCreatedAt: author.profileCreatedAt,
    profileUpdatedAt: author.profileUpdatedAt,
    methodologyFocus: normalizeDisplayAuthorText(author.methodologyFocus) || author.methodologyFocus,
    expertise: normalizeDisplayAuthorArray(author.expertise),
    credentials: normalizeDisplayAuthorArray(author.credentials),
    sameAs: author.sameAs,
    canonicalUrl: undefined,
    noIndex: false,
  };
}

function buildLocalAuthors() {
  return Object.entries(authors).map(([id, author]) => mapLocalAuthor(id, author));
}

function mapSanityAuthor(author: SanityAuthorValue | undefined | null): DirectoryAuthor | null {
  if (!author?.slug) {
    return null;
  }

  const fullName = author.fullName || author.name || author.slug;

  return {
    id: author.slug,
    name: author.name || fullName,
    fullName,
    slug: author.slug,
    role: normalizeDisplayAuthorText(author.role) || "Yazar",
    university: normalizeDisplayAuthorText(author.university) || "",
    experience: normalizeDisplayAuthorText(author.experience) || "",
    bio: normalizeDisplayAuthorText(author.bio) || "",
    metaDescription: normalizeDisplayAuthorText(author.metaDescription) || normalizeDisplayAuthorText(author.bio) || "",
    avatarUrl: author.avatarUrl || `/authors/${author.slug}.svg`,
    avatarAlt: asString(author.avatarAlt),
    profileUrl: `${siteConfig.url}/yazar/${author.slug}`,
    profileCreatedAt: author._createdAt,
    profileUpdatedAt: author._updatedAt,
    methodologyFocus: normalizeDisplayAuthorText(author.methodologyFocus) || "",
    expertise: normalizeDisplayAuthorArray(asStringArray(author.expertise)),
    credentials: normalizeDisplayAuthorArray(asStringArray(author.credentials)),
    sameAs: asStringArray(author.sameAs),
    canonicalUrl: asString(author.canonicalUrl),
    noIndex: Boolean(author.noIndex),
  };
}

function getLocalCategorySlugMap() {
  const categories = getAllFilesFrontMatter("kategori") as LocalRecord[];

  return new Map(
    categories
      .map((item) => {
        const name = asString(item.name);
        return name ? ([name, item.slug] as const) : null;
      })
      .filter((item): item is readonly [string, string] => item !== null),
  );
}

function mapLocalToolSummary(item: LocalRecord, categorySlugMap: Map<string, string>): ToolSummary {
  const category = asString(item.category);
  const authorId = asString(item.author);
  const localAuthor =
    authorId && authorId in authors
      ? mapLocalAuthor(authorId, authors[authorId as keyof typeof authors])
      : null;

  return {
    slug: item.slug,
    name: asString(item.name) || asString(item.title) || item.slug,
    title: asString(item.title),
    h1: asString(item.h1),
    description: asString(item.description) || "",
    metaDescription: asString(item.metaDescription) || asString(item.description) || "",
    heroIntro: asString(item.heroIntro),
    category,
    categorySlug: category ? categorySlugMap.get(category) : undefined,
    author: localAuthor,
    pricing: asString(item.pricing),
    tags: asStringArray(item.tags),
    hasFreeTier: Boolean(item.hasFreeTier),
    isTRSupported: Boolean(item.isTRSupported),
    websiteUrl: asString(item.websiteUrl),
    priceAmount:
      typeof item.priceAmount === "number" || typeof item.priceAmount === "string"
        ? String(item.priceAmount)
        : undefined,
    priceCurrency: asString(item.priceCurrency),
    date: asString(item.date),
    datePublished: asString(item.datePublished),
    dateModified: asString(item.dateModified),
  };
}

function mapLocalGuideSummary(item: LocalRecord, categorySlugMap: Map<string, string>): GuideSummary {
  const category = asString(item.category);
  const authorId = asString(item.author);
  const localAuthor =
    authorId && authorId in authors
      ? mapLocalAuthor(authorId, authors[authorId as keyof typeof authors])
      : null;
  const time = asString(item.time);

  return {
    slug: item.slug,
    title: asString(item.title) || item.slug,
    h1: asString(item.h1),
    name: asString(item.name),
    description: asString(item.description) || "",
    metaDescription: asString(item.metaDescription) || asString(item.description) || "",
    heroIntro: asString(item.heroIntro),
    category,
    categorySlug: category ? categorySlugMap.get(category) : undefined,
    author: localAuthor,
    difficulty: asString(item.difficulty),
    time,
    estimatedTimeMinutes: parseMinutes(time),
    date: asString(item.date),
    datePublished: asString(item.datePublished),
    dateModified: asString(item.dateModified),
  };
}

function mapLocalCategorySummary(item: LocalRecord): CategorySummary {
  return {
    slug: item.slug,
    name: asString(item.name) || item.slug,
    description: asString(item.description) || "",
    metaDescription: asString(item.metaDescription) || asString(item.description) || "",
    heroIntro: asString(item.heroIntro),
  };
}

function mapSanityToolSummary(item: SanityToolValue): ToolSummary {
  return {
    slug: item.slug || "",
    name: item.name || item.title || item.slug || "",
    title: item.title,
    h1: item.h1,
    description: item.description || "",
    metaDescription: item.metaDescription || item.description || "",
    heroIntro: item.heroIntro,
    category: item.category,
    categorySlug: item.categorySlug,
    author: mapSanityAuthor(item.author),
    pricing: item.pricing,
    tags: asStringArray(item.tags),
    hasFreeTier: Boolean(item.hasFreeTier),
    isTRSupported: Boolean(item.isTRSupported),
    websiteUrl: item.websiteUrl,
    priceAmount:
      typeof item.priceAmount === "number" || typeof item.priceAmount === "string"
        ? String(item.priceAmount)
        : undefined,
    priceCurrency: item.priceCurrency,
    logoUrl: item.logoUrl,
    featuredImageUrl: item.featuredImageUrl,
    logoAlt: asString(item.logoAlt),
    featuredImageAlt: asString(item.featuredImageAlt),
    datePublished: item.datePublished,
    dateModified: item.dateModified,
    canonicalUrl: asString(item.canonicalUrl),
    noIndex: Boolean(item.noIndex),
  };
}

function mapSanityGuideSummary(item: SanityGuideValue): GuideSummary {
  return {
    slug: item.slug || "",
    title: item.title || item.slug || "",
    h1: item.h1,
    description: item.description || "",
    metaDescription: item.metaDescription || item.description || "",
    heroIntro: item.heroIntro,
    category: item.category,
    categorySlug: item.categorySlug,
    author: mapSanityAuthor(item.author),
    difficulty: item.difficulty,
    time: toMinuteLabel(item.estimatedTimeMinutes),
    estimatedTimeMinutes: item.estimatedTimeMinutes,
    featuredImageUrl: item.featuredImageUrl,
    featuredImageAlt: asString(item.featuredImageAlt),
    datePublished: item.datePublished,
    dateModified: item.dateModified,
    canonicalUrl: asString(item.canonicalUrl),
    noIndex: Boolean(item.noIndex),
  };
}

function mapSanityCategorySummary(item: SanityCategoryValue): CategorySummary {
  return {
    slug: item.slug || "",
    name: item.name || item.slug || "",
    description: item.description || "",
    metaDescription: item.metaDescription || item.description || "",
    heroIntro: item.heroIntro,
    iconUrl: item.iconUrl,
    iconAlt: asString(item.iconAlt),
    canonicalUrl: asString(item.canonicalUrl),
    noIndex: Boolean(item.noIndex),
  };
}

function mapSanityPage(item: SanityPageValue): PageEntry {
  return {
    slug: item.slug || "",
    title: item.title || item.slug || "",
    description: item.description || "",
    metaDescription: item.metaDescription || item.description || "",
    pageType: item.pageType,
    body: {
      kind: "portableText",
      value: Array.isArray(item.body) ? item.body : [],
    } satisfies RichBody,
    canonicalUrl: asString(item.canonicalUrl),
    noIndex: Boolean(item.noIndex),
  };
}

async function fetchSanity<T>(query: string, params?: Record<string, string>) {
  return sanityLiveClient.fetch<T>(query, params ?? {}, {
    cache: "no-store",
  });
}

const getSanityTools = cache(async () => {
  const items = await fetchSanity<SanityToolValue[]>(toolListQuery);
  return items.map(mapSanityToolSummary);
});

const getSanityTool = cache(async (slug: string) => {
  const item = await fetchSanity<SanityToolValue | null>(toolBySlugQuery, { slug });

  if (!item?.slug) {
    return null;
  }

  const bodyMarkdown = asString(item.bodyMarkdown);

  return {
    ...mapSanityToolSummary(item),
    body: bodyMarkdown
      ? ({
          kind: "mdx",
          source: bodyMarkdown,
        } satisfies RichBody)
      : ({
          kind: "portableText",
          value: Array.isArray(item.body) ? item.body : [],
        } satisfies RichBody),
    pros: asStringArray(item.pros),
    cons: asStringArray(item.cons),
    faqs: asFaqArray(item.faqs),
    screenshots: asMediaAssets(item.screenshots),
  } satisfies ToolEntry;
});

const getSanityGuides = cache(async () => {
  const items = await fetchSanity<SanityGuideValue[]>(guideListQuery);
  return items.map(mapSanityGuideSummary);
});

const getSanityGuide = cache(async (slug: string) => {
  const item = await fetchSanity<SanityGuideValue | null>(guideBySlugQuery, { slug });

  if (!item?.slug) {
    return null;
  }

  const bodyMarkdown = asString(item.bodyMarkdown);

  return {
    ...mapSanityGuideSummary(item),
    body: bodyMarkdown
      ? ({
          kind: "mdx",
          source: bodyMarkdown,
        } satisfies RichBody)
      : ({
          kind: "portableText",
          value: Array.isArray(item.body) ? item.body : [],
    } satisfies RichBody),
    tools: asStringArray(item.tools),
    faqs: asFaqArray(item.faqs),
  } satisfies GuideEntry;
});

const getSanityCategories = cache(async () => {
  const items = await fetchSanity<SanityCategoryValue[]>(categoryListQuery);
  return items.map(mapSanityCategorySummary);
});

const getSanityCategory = cache(async (slug: string) => {
  const item = await fetchSanity<SanityCategoryValue | null>(categoryBySlugQuery, { slug });

  if (!item?.slug) {
    return null;
  }

  const bodyMarkdown = asString(item.bodyMarkdown);

  return {
    ...mapSanityCategorySummary(item),
    body: bodyMarkdown
      ? ({
          kind: "mdx",
          source: bodyMarkdown,
        } satisfies RichBody)
      : ({
          kind: "portableText",
          value: Array.isArray(item.body) ? item.body : [],
        } satisfies RichBody),
    featuredToolSlugs: asStringArray(item.featuredToolSlugs),
  } satisfies CategoryEntry;
});

const getSanityPages = cache(async () => {
  const items = await fetchSanity<SanityPageValue[]>(pageListQuery);
  return items.map(mapSanityPage);
});

const getSanityPage = cache(async (slug: string) => {
  const item = await fetchSanity<SanityPageValue | null>(pageBySlugQuery, { slug });

  if (!item?.slug) {
    return null;
  }

  return mapSanityPage(item);
});

const getSanityAuthors = cache(async () => {
  const items = await fetchSanity<SanityAuthorValue[]>(authorListQuery);
  return items.map(mapSanityAuthor).filter((item): item is DirectoryAuthor => item !== null);
});

const getSanityAuthor = cache(async (slug: string) => {
  const item = await fetchSanity<SanityAuthorValue | null>(authorBySlugQuery, { slug });
  return mapSanityAuthor(item ?? undefined);
});

const getLocalTools = cache(async () => {
  const categorySlugMap = getLocalCategorySlugMap();
  const items = getAllFilesFrontMatter("ai") as LocalRecord[];
  return sortByFreshness(items.map((item) => mapLocalToolSummary(item, categorySlugMap)));
});

const getLocalTool = cache(async (slug: string) => {
  const categorySlugMap = getLocalCategorySlugMap();
  const file = getFileBySlug("ai", slug);

  if (!file) {
    return null;
  }

  const frontmatter = file.frontmatter as Record<string, unknown>;
  const summary = mapLocalToolSummary(
    {
      ...(frontmatter as LocalRecord),
      slug,
    },
    categorySlugMap,
  );

  return {
    ...summary,
    body: {
      kind: "mdx",
      source: file.content,
    } satisfies RichBody,
    pros: asStringArray(frontmatter.pros),
    cons: asStringArray(frontmatter.cons),
    faqs: asFaqArray(frontmatter.faqs),
    screenshots: [],
  } satisfies ToolEntry;
});

const getLocalGuides = cache(async () => {
  const categorySlugMap = getLocalCategorySlugMap();
  const items = getAllFilesFrontMatter("rehber") as LocalRecord[];
  return sortByFreshness(items.map((item) => mapLocalGuideSummary(item, categorySlugMap)));
});

const getLocalGuide = cache(async (slug: string) => {
  const categorySlugMap = getLocalCategorySlugMap();
  const file = getFileBySlug("rehber", slug);

  if (!file) {
    return null;
  }

  const frontmatter = file.frontmatter as Record<string, unknown>;
  const summary = mapLocalGuideSummary(
    {
      ...(frontmatter as LocalRecord),
      slug,
    },
    categorySlugMap,
  );

  return {
    ...summary,
    body: {
      kind: "mdx",
      source: file.content,
    } satisfies RichBody,
    tools: asStringArray(frontmatter.tools),
    faqs: asFaqArray(frontmatter.faqs),
  } satisfies GuideEntry;
});

const getLocalCategories = cache(async () => {
  const items = getAllFilesFrontMatter("kategori") as LocalRecord[];
  return items.map(mapLocalCategorySummary).sort((left, right) => left.name.localeCompare(right.name, "tr"));
});

const getLocalCategory = cache(async (slug: string) => {
  const file = getFileBySlug("kategori", slug);

  if (!file) {
    return null;
  }

  return {
    ...mapLocalCategorySummary({
      ...(file.frontmatter as LocalRecord),
      slug,
    }),
    body: {
      kind: "mdx",
      source: file.content,
    } satisfies RichBody,
  } satisfies CategoryEntry;
});

const getLocalAuthorsCached = cache(async () => buildLocalAuthors());

const getLocalAuthor = cache(async (slug: string) => {
  return buildLocalAuthors().find((author) => author.slug === slug) ?? null;
});

export const getAllTools = cache(async () => {
  if (!isSanityConfigured) {
    return getLocalTools();
  }

  const [sanityTools, localTools] = await Promise.all([getSanityTools(), getLocalTools()]);
  return sortByFreshness(mergeBySlug(sanityTools, localTools));
});

export const getToolBySlug = cache(async (slug: string) => {
  if (!isSanityConfigured) {
    return getLocalTool(slug);
  }

  const sanityTool = await getSanityTool(slug);
  return sanityTool ?? getLocalTool(slug);
});

export const getAllGuides = cache(async () => {
  if (!isSanityConfigured) {
    return getLocalGuides();
  }

  const [sanityGuides, localGuides] = await Promise.all([getSanityGuides(), getLocalGuides()]);
  return sortByFreshness(mergeBySlug(sanityGuides, localGuides));
});

export const getGuideBySlug = cache(async (slug: string) => {
  if (!isSanityConfigured) {
    return getLocalGuide(slug);
  }

  const sanityGuide = await getSanityGuide(slug);
  return sanityGuide ?? getLocalGuide(slug);
});

export const getAllCategories = cache(async () => {
  if (!isSanityConfigured) {
    return getLocalCategories();
  }

  const [sanityCategories, localCategories] = await Promise.all([
    getSanityCategories(),
    getLocalCategories(),
  ]);

  return mergeBySlug(sanityCategories, localCategories).sort((left, right) =>
    left.name.localeCompare(right.name, "tr"),
  );
});

export const getCategoryBySlug = cache(async (slug: string) => {
  if (!isSanityConfigured) {
    return getLocalCategory(slug);
  }

  const sanityCategory = await getSanityCategory(slug);
  return sanityCategory ?? getLocalCategory(slug);
});

export const getAllAuthors = cache(async () => {
  if (!isSanityConfigured) {
    return getLocalAuthorsCached();
  }

  const [sanityAuthors, localAuthors] = await Promise.all([
    getSanityAuthors(),
    getLocalAuthorsCached(),
  ]);

  return mergeBySlug(sanityAuthors, localAuthors);
});

export const getAuthorBySlug = cache(async (slug: string) => {
  if (!isSanityConfigured) {
    return getLocalAuthor(slug);
  }

  const sanityAuthor = await getSanityAuthor(slug);
  return sanityAuthor ?? getLocalAuthor(slug);
});

export const getToolsByCategorySlug = cache(async (categorySlug: string) => {
  const [tools, category] = await Promise.all([getAllTools(), getCategoryBySlug(categorySlug)]);
  const filteredTools = tools.filter((tool) => tool.categorySlug === categorySlug);
  const featuredToolSlugs =
    category && "featuredToolSlugs" in category && Array.isArray(category.featuredToolSlugs)
      ? category.featuredToolSlugs
      : [];

  if (featuredToolSlugs.length === 0) {
    return filteredTools;
  }

  return [...filteredTools].sort((left, right) => {
    const leftIndex = featuredToolSlugs.indexOf(left.slug);
    const rightIndex = featuredToolSlugs.indexOf(right.slug);

    if (leftIndex === -1 && rightIndex === -1) {
      return 0;
    }

    if (leftIndex === -1) {
      return 1;
    }

    if (rightIndex === -1) {
      return -1;
    }

    return leftIndex - rightIndex;
  });
});

export const getAllPages = cache(async () => (isSanityConfigured ? getSanityPages() : []));

export const getPageBySlug = cache(async (slug: string) =>
  isSanityConfigured ? getSanityPage(slug) : null,
);
