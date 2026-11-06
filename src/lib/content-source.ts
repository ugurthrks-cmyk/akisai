import { groq } from "next-sanity";
import { hasLegacyMarkdown } from "@/lib/content-body-policy";
import type { PortableTextBlock } from "@portabletext/types";
import { retiredCategorySlugs, sortCategoriesByTaxonomy } from "@/lib/category-taxonomy";
import { computeToolRating, type ToolRatingScores } from "@/lib/ratings";
import { siteConfig } from "@/lib/site";
import { isSanityConfigured } from "@/sanity/env";
import { fetchPublishedSanity } from "@/sanity/lib/fetch";
import { getSanitySlugTag, sanityTags, uniqueSanityTags } from "@/sanity/lib/cache-tags";

export type SourceItem = {
  label: string;
  url: string;
  publisher?: string;
  note?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
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
  seoTitle?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  description: string;
  metaDescription?: string;
  heroIntro?: string;
  category?: string;
  categorySlug?: string;
  author?: DirectoryAuthor | null;
  pricing?: string;
  priceRangeText?: string;
  tags: string[];
  hasFreeTier: boolean;
  freeTierNote?: string;
  isTRSupported: boolean;
  trSupportLevel?: "none" | "partial" | "full";
  trSupportNote?: string;
  paymentMethodsText?: string;
  websiteUrl?: string;
  priceAmount?: string;
  priceCurrency?: string;
  logoUrl?: string;
  logoAlt?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  reviewRating?: number;
  ratingScores?: ToolRatingScores;
  reviewScore?: number;
  sources?: SourceItem[];
  date?: string;
  datePublished?: string;
  dateModified?: string;
  lastVerified?: string;
  verificationNotes?: string;
  updatedAt?: string;
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
  seoTitle?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
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
  relatedToolSlugs?: string[];
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  date?: string;
  datePublished?: string;
  dateModified?: string;
  lastVerified?: string;
  verificationNotes?: string;
  updatedAt?: string;
  sources?: SourceItem[];
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface GuideEntry extends GuideSummary {
  body: RichBody;
  tools: string[];
  supplies: string[];
  faqs: FaqItem[];
}

export interface ComparisonSummary {
  slug: string;
  title: string;
  h1?: string;
  seoTitle?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  description: string;
  metaDescription?: string;
  heroIntro?: string;
  category?: string;
  categorySlug?: string;
  author?: DirectoryAuthor | null;
  comparedToolSlugs?: string[];
  comparedToolNames?: string[];
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  date?: string;
  datePublished?: string;
  dateModified?: string;
  lastVerified?: string;
  verificationNotes?: string;
  updatedAt?: string;
  sources?: SourceItem[];
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface ComparisonEntry extends ComparisonSummary {
  body: RichBody;
  faqs: FaqItem[];
}

export interface CategorySummary {
  slug: string;
  name: string;
  seoTitle?: string;
  h1?: string;
  description: string;
  metaDescription?: string;
  heroIntro?: string;
  iconUrl?: string;
  iconAlt?: string;
  updatedAt?: string;
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
  updatedAt?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

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
  seoTitle?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  description?: string;
  metaDescription?: string;
  heroIntro?: string;
  category?: string;
  categorySlug?: string;
  author?: SanityAuthorValue;
  pricing?: string;
  priceRangeText?: string;
  tags?: unknown;
  hasFreeTier?: boolean;
  freeTierNote?: string;
  isTRSupported?: boolean;
  trSupportLevel?: "none" | "partial" | "full";
  trSupportNote?: string;
  paymentMethodsText?: string;
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
  kullanimKolayligi?: number;
  turkiyeUyumu?: number;
  fiyatDeger?: number;
  ozellikler?: number;
  destek?: number;
  reviewRating?: number;
  sources?: unknown;
  faqs?: unknown;
  datePublished?: string;
  dateModified?: string;
  lastVerified?: string;
  verificationNotes?: string;
  updatedAt?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

type SanityGuideValue = {
  slug?: string;
  title?: string;
  h1?: string;
  seoTitle?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
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
  supplies?: unknown;
  relatedToolSlugs?: unknown;
  faqs?: unknown;
  datePublished?: string;
  dateModified?: string;
  lastVerified?: string;
  verificationNotes?: string;
  updatedAt?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  sources?: unknown;
};

type SanityComparisonValue = {
  slug?: string;
  title?: string;
  h1?: string;
  seoTitle?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  description?: string;
  metaDescription?: string;
  heroIntro?: string;
  category?: string;
  categorySlug?: string;
  author?: SanityAuthorValue;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  bodyMarkdown?: string;
  body?: PortableTextBlock[];
  faqs?: unknown;
  toolNames?: unknown;
  comparedToolSlugs?: unknown;
  comparedToolNames?: unknown;
  datePublished?: string;
  dateModified?: string;
  lastVerified?: string;
  verificationNotes?: string;
  updatedAt?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  sources?: unknown;
};

type SanityCategoryValue = {
  slug?: string;
  name?: string;
  seoTitle?: string;
  h1?: string;
  description?: string;
  metaDescription?: string;
  heroIntro?: string;
  iconUrl?: string;
  iconAlt?: string;
  updatedAt?: string;
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
  updatedAt?: string;
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
  "seoTitle": seo.seoTitle,
  "openGraphTitle": seo.openGraphTitle,
  "openGraphDescription": seo.openGraphDescription,
  description,
  metaDescription,
  heroIntro,
  pricing,
  priceRangeText,
  tags,
  hasFreeTier,
  freeTierNote,
  isTRSupported,
  trSupportLevel,
  trSupportNote,
  paymentMethodsText,
  websiteUrl,
  priceAmount,
  priceCurrency,
  reviewRating,
  kullanimKolayligi,
  turkiyeUyumu,
  fiyatDeger,
  ozellikler,
  destek,
  datePublished,
  dateModified,
  lastVerified,
  verificationNotes,
  "updatedAt": _updatedAt,
  "category": category->name,
  "categorySlug": category->slug.current,
  "logoUrl": logo.asset->url,
  "logoAlt": logo.alt,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  sources[]{
    label,
    publisher,
    url,
    note
  },
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
  "seoTitle": seo.seoTitle,
  "openGraphTitle": seo.openGraphTitle,
  "openGraphDescription": seo.openGraphDescription,
  description,
  metaDescription,
  heroIntro,
  pricing,
  priceRangeText,
  hasFreeTier,
  freeTierNote,
  isTRSupported,
  trSupportLevel,
  trSupportNote,
  paymentMethodsText,
  websiteUrl,
  priceAmount,
  priceCurrency,
  tags,
  kullanimKolayligi,
  turkiyeUyumu,
  fiyatDeger,
  ozellikler,
  destek,
  pros,
  cons,
  reviewRating,
  faqs,
  body,
  screenshots[]{
    "url": asset->url,
    alt,
    caption
  },
  datePublished,
  dateModified,
  lastVerified,
  verificationNotes,
  "updatedAt": _updatedAt,
  "category": category->name,
  "categorySlug": category->slug.current,
  "logoUrl": logo.asset->url,
  "logoAlt": logo.alt,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  sources[]{
    label,
    publisher,
    url,
    note
  },
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex,
  bodyMarkdown,
  "author": author->{${authorProjection}}
}`;

const guideListQuery = groq`*[_type == "guide" && defined(slug.current)] | order(coalesce(dateModified, datePublished, _updatedAt) desc) {
  "slug": slug.current,
  title,
  h1,
  "seoTitle": seo.seoTitle,
  "openGraphTitle": seo.openGraphTitle,
  "openGraphDescription": seo.openGraphDescription,
  description,
  metaDescription,
  heroIntro,
  difficulty,
  estimatedTimeMinutes,
  supplies,
  datePublished,
  dateModified,
  lastVerified,
  verificationNotes,
  "updatedAt": _updatedAt,
  "category": category->name,
  "categorySlug": category->slug.current,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  sources[]{
    label,
    publisher,
    url,
    note
  },
  "relatedToolSlugs": relatedTools[]->slug.current,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex,
  bodyMarkdown,
  "author": author->{${authorProjection}}
}`;

const guideBySlugQuery = groq`*[_type == "guide" && slug.current == $slug][0] {
  "slug": slug.current,
  title,
  h1,
  "seoTitle": seo.seoTitle,
  "openGraphTitle": seo.openGraphTitle,
  "openGraphDescription": seo.openGraphDescription,
  description,
  metaDescription,
  heroIntro,
  difficulty,
  estimatedTimeMinutes,
  faqs,
  supplies,
  body,
  datePublished,
  dateModified,
  lastVerified,
  verificationNotes,
  "updatedAt": _updatedAt,
  "category": category->name,
  "categorySlug": category->slug.current,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex,
  sources[]{
    label,
    publisher,
    url,
    note
  },
  "relatedToolSlugs": relatedTools[]->slug.current,
  "tools": relatedTools[]->name,
  bodyMarkdown,
  "author": author->{${authorProjection}}
}`;

const comparisonListQuery = groq`*[_type == "comparison" && defined(slug.current)] | order(coalesce(dateModified, datePublished, _updatedAt) desc) {
  "slug": slug.current,
  title,
  h1,
  "seoTitle": seo.seoTitle,
  "openGraphTitle": seo.openGraphTitle,
  "openGraphDescription": seo.openGraphDescription,
  description,
  metaDescription,
  heroIntro,
  datePublished,
  dateModified,
  "updatedAt": _updatedAt,
  "category": category->name,
  "categorySlug": category->slug.current,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  sources[]{
    label,
    publisher,
    url,
    note
  },
  toolNames,
  "comparedToolSlugs": comparedTools[]->slug.current,
  "comparedToolNames": coalesce(toolNames, comparedTools[]->name),
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex,
  lastVerified,
  verificationNotes,
  bodyMarkdown,
  "author": author->{${authorProjection}}
}`;

const comparisonBySlugQuery = groq`*[_type == "comparison" && slug.current == $slug][0] {
  "slug": slug.current,
  title,
  h1,
  "seoTitle": seo.seoTitle,
  "openGraphTitle": seo.openGraphTitle,
  "openGraphDescription": seo.openGraphDescription,
  description,
  metaDescription,
  heroIntro,
  faqs,
  body,
  datePublished,
  dateModified,
  "updatedAt": _updatedAt,
  "category": category->name,
  "categorySlug": category->slug.current,
  "featuredImageUrl": featuredImage.asset->url,
  "featuredImageAlt": featuredImage.alt,
  sources[]{
    label,
    publisher,
    url,
    note
  },
  toolNames,
  "comparedToolSlugs": comparedTools[]->slug.current,
  "comparedToolNames": coalesce(toolNames, comparedTools[]->name),
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex,
  lastVerified,
  verificationNotes,
  bodyMarkdown,
  "author": author->{${authorProjection}}
}`;

const categoryListQuery = groq`*[_type == "category" && defined(slug.current)] | order(name asc) {
  "slug": slug.current,
  name,
  seoTitle,
  h1,
  description,
  metaDescription,
  heroIntro,
  bodyMarkdown,
  "iconUrl": icon.asset->url,
  "iconAlt": icon.alt,
  "updatedAt": _updatedAt,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex
}`;

const categoryBySlugQuery = groq`*[_type == "category" && slug.current == $slug][0] {
  "slug": slug.current,
  name,
  seoTitle,
  h1,
  description,
  metaDescription,
  heroIntro,
  bodyMarkdown,
  body,
  "iconUrl": icon.asset->url,
  "iconAlt": icon.alt,
  "updatedAt": _updatedAt,
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
  "updatedAt": _updatedAt,
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
  "updatedAt": _updatedAt,
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex
}`;

const authorListQuery = groq`*[_type == "author" && defined(slug.current)] | order(fullName asc) {
  ${authorProjection}
}`;

const authorBySlugQuery = groq`*[_type == "author" && slug.current == $slug][0] {
  ${authorProjection}
}`;

const CATEGORY_REVALIDATE_SECONDS = 86400;

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function normalizeDisplayAuthorText(value?: string) {
  return value
    ?.replace(/\bYapay Zeka\b/g, "Yapay Zeka")
    .replace(/\byapay zeka\b/g, "yapay zeka")
    .replace(/\bAI tool evaluation\b/gi, "yapay zeka araç değerlendirmesi")
    .replace(/\bLLM market analysis\b/gi, "büyük dil modeli pazar çözümlemesi")
    .replace(/\bTurkey localization\b/gi, "Türkiye yerelleştirmesi")
    .replace(/\bpricing research\b/gi, "fiyatlandırma araştırması")
    .replace(/\bcontent operations\b/gi, "içerik operasyonları")
    .replace(/\bworkflow automation\b/gi, "iş akışı otomasyonu")
    .replace(/\bno-code architecture\b/gi, "kodsuz sistem mimarisi")
    .replace(/\bAI operations\b/gi, "yapay zeka operasyonları")
    .replace(/\bprocess design\b/gi, "süreç tasarımı")
    .replace(/\bAI\b/g, "yapay zeka");
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
        note: asString(record.note),
      });
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

function resolvePriceCurrency(currency?: string, pricing?: string) {
  if (currency) {
    return currency;
  }

  const normalizedPricing = pricing?.toUpperCase();

  if (!normalizedPricing) {
    return undefined;
  }

  if (normalizedPricing.includes("TRY") || normalizedPricing.includes("TL") || normalizedPricing.includes("₺")) {
    return "TRY";
  }

  if (normalizedPricing.includes("USD") || normalizedPricing.includes("$")) {
    return "USD";
  }

  if (normalizedPricing.includes("EUR") || normalizedPricing.includes("€")) {
    return "EUR";
  }

  return undefined;
}

function filterLegacyCategories<T extends { slug: string }>(items: T[]) {
  return items.filter((item) => !retiredCategorySlugs.has(item.slug));
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


function requireSanityContent() {
  if (!isSanityConfigured) {
    throw new Error(
      "Sanity CMS bağlantısı bulunamadı. İçerik runtime'ı artık yalnızca Sanity ile çalışıyor; NEXT_PUBLIC_SANITY_PROJECT_ID ve NEXT_PUBLIC_SANITY_DATASET tanımlı olmalıdır.",
    );
  }
}

function mapSanityToolSummary(item: SanityToolValue): ToolSummary {
  const ratingScores: ToolRatingScores = {
    kullanimKolayligi: asNumber(item.kullanimKolayligi),
    turkiyeUyumu: asNumber(item.turkiyeUyumu),
    fiyatDeger: asNumber(item.fiyatDeger),
    ozellikler: asNumber(item.ozellikler),
    destek: asNumber(item.destek),
  };

  const computedScore = computeToolRating(ratingScores);
  const manualScore = typeof item.reviewRating === "number" ? item.reviewRating : undefined;
  const reviewScore = computedScore ?? manualScore;

  return {
    slug: item.slug || "",
    name: item.name || item.title || item.slug || "",
    title: item.title,
    h1: item.h1,
    seoTitle: asString(item.seoTitle),
    openGraphTitle: asString(item.openGraphTitle),
    openGraphDescription: asString(item.openGraphDescription),
    description: item.description || "",
    metaDescription: item.metaDescription || item.description || "",
    heroIntro: item.heroIntro,
    category: item.category,
    categorySlug: item.categorySlug,
    author: mapSanityAuthor(item.author),
    pricing: item.pricing,
    priceRangeText: asString(item.priceRangeText),
    tags: asStringArray(item.tags),
    hasFreeTier: Boolean(item.hasFreeTier),
    freeTierNote: asString(item.freeTierNote),
    isTRSupported: Boolean(item.isTRSupported),
    trSupportLevel: item.trSupportLevel,
    trSupportNote: asString(item.trSupportNote),
    paymentMethodsText: asString(item.paymentMethodsText),
    websiteUrl: item.websiteUrl,
    priceAmount:
      typeof item.priceAmount === "number" || typeof item.priceAmount === "string"
        ? String(item.priceAmount)
        : undefined,
    priceCurrency: resolvePriceCurrency(item.priceCurrency, item.pricing),
    logoUrl: item.logoUrl,
    featuredImageUrl: item.featuredImageUrl,
    logoAlt: asString(item.logoAlt),
    featuredImageAlt: asString(item.featuredImageAlt),
    reviewRating: typeof item.reviewRating === "number" ? item.reviewRating : undefined,
    ratingScores,
    reviewScore,
    sources: asSourceArray(item.sources),
    datePublished: item.datePublished,
    dateModified: item.dateModified,
    lastVerified: asString(item.lastVerified),
    verificationNotes: asString(item.verificationNotes),
    updatedAt: item.updatedAt,
    canonicalUrl: asString(item.canonicalUrl),
    noIndex: Boolean(item.noIndex),
  };
}

function mapSanityGuideSummary(item: SanityGuideValue): GuideSummary {
  return {
    slug: item.slug || "",
    title: item.title || item.slug || "",
    h1: item.h1,
    seoTitle: asString(item.seoTitle),
    openGraphTitle: asString(item.openGraphTitle),
    openGraphDescription: asString(item.openGraphDescription),
    description: item.description || "",
    metaDescription: item.metaDescription || item.description || "",
    heroIntro: item.heroIntro,
    category: item.category,
    categorySlug: item.categorySlug,
    author: mapSanityAuthor(item.author),
    difficulty: item.difficulty,
    time: toMinuteLabel(item.estimatedTimeMinutes),
    estimatedTimeMinutes: item.estimatedTimeMinutes,
    relatedToolSlugs: asStringArray(item.relatedToolSlugs),
    featuredImageUrl: item.featuredImageUrl,
    featuredImageAlt: asString(item.featuredImageAlt),
    datePublished: item.datePublished,
    dateModified: item.dateModified,
    lastVerified: asString(item.lastVerified),
    verificationNotes: asString(item.verificationNotes),
    updatedAt: item.updatedAt,
    sources: asSourceArray(item.sources),
    canonicalUrl: asString(item.canonicalUrl),
    noIndex: Boolean(item.noIndex),
  };
}

function mapSanityComparisonSummary(item: SanityComparisonValue): ComparisonSummary {
  return {
    slug: item.slug || "",
    title: item.title || item.slug || "",
    h1: item.h1,
    seoTitle: asString(item.seoTitle),
    openGraphTitle: asString(item.openGraphTitle),
    openGraphDescription: asString(item.openGraphDescription),
    description: item.description || "",
    metaDescription: item.metaDescription || item.description || "",
    heroIntro: item.heroIntro,
    category: item.category,
    categorySlug: item.categorySlug,
    author: mapSanityAuthor(item.author),
    comparedToolSlugs: asStringArray(item.comparedToolSlugs),
    comparedToolNames: asStringArray(item.comparedToolNames),
    featuredImageUrl: item.featuredImageUrl,
    featuredImageAlt: asString(item.featuredImageAlt),
    datePublished: item.datePublished,
    dateModified: item.dateModified,
    lastVerified: asString(item.lastVerified),
    verificationNotes: asString(item.verificationNotes),
    updatedAt: item.updatedAt,
    sources: asSourceArray(item.sources),
    canonicalUrl: asString(item.canonicalUrl),
    noIndex: Boolean(item.noIndex),
  };
}

function mapSanityCategorySummary(item: SanityCategoryValue): CategorySummary {
  return {
    slug: item.slug || "",
    name: item.name || item.slug || "",
    seoTitle: asString(item.seoTitle),
    h1: asString(item.h1),
    description: item.description || "",
    metaDescription: item.metaDescription || item.description || "",
    heroIntro: item.heroIntro,
    iconUrl: item.iconUrl,
    iconAlt: asString(item.iconAlt),
    updatedAt: item.updatedAt,
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
    updatedAt: item.updatedAt,
    canonicalUrl: asString(item.canonicalUrl),
    noIndex: Boolean(item.noIndex),
  };
}

async function getSanityTools() {
  const items = await fetchPublishedSanity<SanityToolValue[]>(toolListQuery, {}, {
    tags: [sanityTags.tools],
  });
  return items.map(mapSanityToolSummary);
}

async function getSanityTool(slug: string) {
  const item = await fetchPublishedSanity<SanityToolValue | null>(toolBySlugQuery, { slug }, {
    tags: uniqueSanityTags([sanityTags.tools], [getSanitySlugTag("sanity:tool", slug)]),
  });

  if (!item?.slug) {
    return null;
  }

  const bodyMarkdown = hasLegacyMarkdown(item.bodyMarkdown) ? item.bodyMarkdown : undefined;

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
}

async function getSanityGuides() {
  const items = await fetchPublishedSanity<SanityGuideValue[]>(guideListQuery, {}, {
    tags: [sanityTags.guides],
  });
  return items.map(mapSanityGuideSummary);
}

async function getSanityGuide(slug: string) {
  const item = await fetchPublishedSanity<SanityGuideValue | null>(guideBySlugQuery, { slug }, {
    tags: uniqueSanityTags([sanityTags.guides], [getSanitySlugTag("sanity:guide", slug)]),
  });

  if (!item?.slug) {
    return null;
  }

  const bodyMarkdown = hasLegacyMarkdown(item.bodyMarkdown) ? item.bodyMarkdown : undefined;

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
    supplies: asStringArray(item.supplies),
    faqs: asFaqArray(item.faqs),
  } satisfies GuideEntry;
}

async function getSanityComparisons() {
  const items = await fetchPublishedSanity<SanityComparisonValue[]>(comparisonListQuery, {}, {
    tags: [sanityTags.comparisons],
  });
  return items.map(mapSanityComparisonSummary);
}

async function getSanityComparison(slug: string) {
  const item = await fetchPublishedSanity<SanityComparisonValue | null>(comparisonBySlugQuery, { slug }, {
    tags: uniqueSanityTags([sanityTags.comparisons], [getSanitySlugTag("sanity:comparison", slug)]),
  });

  if (!item?.slug) {
    return null;
  }

  const bodyMarkdown = hasLegacyMarkdown(item.bodyMarkdown) ? item.bodyMarkdown : undefined;

  return {
    ...mapSanityComparisonSummary(item),
    body: bodyMarkdown
      ? ({
          kind: "mdx",
          source: bodyMarkdown,
        } satisfies RichBody)
      : ({
          kind: "portableText",
          value: Array.isArray(item.body) ? item.body : [],
        } satisfies RichBody),
    faqs: asFaqArray(item.faqs),
  } satisfies ComparisonEntry;
}

async function getSanityCategories() {
  const items = await fetchPublishedSanity<SanityCategoryValue[]>(categoryListQuery, {}, {
    tags: [sanityTags.categories],
    revalidate: CATEGORY_REVALIDATE_SECONDS,
  });
  return sortCategoriesByTaxonomy(filterLegacyCategories(items.map(mapSanityCategorySummary)));
}

async function getSanityCategory(slug: string) {
  if (retiredCategorySlugs.has(slug)) {
    return null;
  }

  const item = await fetchPublishedSanity<SanityCategoryValue | null>(categoryBySlugQuery, { slug }, {
    tags: uniqueSanityTags([sanityTags.categories], [getSanitySlugTag("sanity:category", slug)]),
    revalidate: CATEGORY_REVALIDATE_SECONDS,
  });

  if (!item?.slug) {
    return null;
  }

  const bodyMarkdown = hasLegacyMarkdown(item.bodyMarkdown) ? item.bodyMarkdown : undefined;

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
}

async function getSanityPages() {
  const items = await fetchPublishedSanity<SanityPageValue[]>(pageListQuery, {}, {
    tags: [sanityTags.pages],
  });
  return items.map(mapSanityPage);
}

async function getSanityPage(slug: string) {
  const item = await fetchPublishedSanity<SanityPageValue | null>(pageBySlugQuery, { slug }, {
    tags: uniqueSanityTags([sanityTags.pages], [getSanitySlugTag("sanity:page", slug)]),
  });

  if (!item?.slug) {
    return null;
  }

  return mapSanityPage(item);
}

async function getSanityAuthors() {
  const items = await fetchPublishedSanity<SanityAuthorValue[]>(authorListQuery, {}, {
    tags: [sanityTags.authors],
  });
  return items.map(mapSanityAuthor).filter((item): item is DirectoryAuthor => item !== null);
}

async function getSanityAuthor(slug: string) {
  const item = await fetchPublishedSanity<SanityAuthorValue | null>(authorBySlugQuery, { slug }, {
    tags: uniqueSanityTags([sanityTags.authors], [getSanitySlugTag("sanity:author", slug)]),
  });
  return mapSanityAuthor(item ?? undefined);
}

export async function getAllTools() {
  requireSanityContent();
  return getSanityTools();
}

export async function getToolBySlug(slug: string) {
  requireSanityContent();
  return getSanityTool(slug);
}

export async function getAllGuides() {
  requireSanityContent();
  return getSanityGuides();
}

export async function getAllComparisons() {
  requireSanityContent();
  return getSanityComparisons();
}

export async function getGuideBySlug(slug: string) {
  requireSanityContent();
  return getSanityGuide(slug);
}

export async function getComparisonBySlug(slug: string) {
  requireSanityContent();
  return getSanityComparison(slug);
}

export async function getGuideByToolSlug(toolSlug: string) {
  const guides = await getAllGuides();
  const directMatch = guides.find((guide) =>
    guide.relatedToolSlugs?.includes(toolSlug),
  );

  if (directMatch) {
    return directMatch;
  }

  const fallbackSlug = `${toolSlug}-nasil-kullanilir`;
  return guides.find((guide) => guide.slug === fallbackSlug) ?? null;
}

export async function getComparisonsByToolSlug(toolSlug: string) {
  const comparisons = await getAllComparisons();
  return comparisons.filter((comparison) => comparison.comparedToolSlugs?.includes(toolSlug));
}

export async function getAllCategories() {
  requireSanityContent();
  return getSanityCategories();
}

export async function getCategoryBySlug(slug: string) {
  requireSanityContent();
  return getSanityCategory(slug);
}

export async function getAllAuthors() {
  requireSanityContent();
  return getSanityAuthors();
}

export async function getAuthorBySlug(slug: string) {
  requireSanityContent();
  return getSanityAuthor(slug);
}

export async function getToolsByCategorySlug(categorySlug: string) {
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
}

export async function getAllPages() {
  requireSanityContent();
  return getSanityPages();
}

export async function getPageBySlug(slug: string) {
  requireSanityContent();
  return getSanityPage(slug);
}
