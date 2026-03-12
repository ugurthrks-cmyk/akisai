import { authors, type AuthorKey } from "@/data/authors";
import { siteConfig } from "@/lib/site";

function parseDateInput(input?: string | null) {
  if (!input) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return new Date(`${input}T00:00:00Z`);
  }

  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getAuthorById(authorId?: string | null) {
  if (!authorId) {
    return null;
  }

  return authors[authorId as AuthorKey] ?? null;
}

export function getAuthorEntryBySlug(slug: string) {
  const entry = Object.entries(authors).find(([, author]) => author.slug === slug);
  return entry
    ? {
        id: entry[0] as AuthorKey,
        author: entry[1],
      }
    : null;
}

export function absoluteUrl(pathname: string, baseUrl: string = siteConfig.url) {
  return new URL(pathname, baseUrl).toString();
}

export function toIsoDate(input?: string | null) {
  const parsed = parseDateInput(input);
  return parsed ? parsed.toISOString() : undefined;
}

export function formatDisplayDate(input?: string | null) {
  const parsed = parseDateInput(input);

  if (!parsed) {
    return null;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
