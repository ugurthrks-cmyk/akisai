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

export function normalizeBaseUrl(value: string) {
  const url = new URL(value);
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url.origin;
}

export function normalizeAbsoluteUrl(value: string) {
  const url = new URL(value);

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  url.hash = "";

  if (url.pathname === "/" && !url.search) {
    return url.origin;
  }

  return url.toString();
}

export function absoluteUrl(pathname: string, baseUrl: string = siteConfig.url) {
  return normalizeAbsoluteUrl(new URL(pathname, normalizeBaseUrl(baseUrl)).toString());
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

export function normalizeSoftwareApplicationCategory(category?: string | null) {
  if (!category) {
    return "BusinessApplication";
  }

  const normalized = category.toLocaleLowerCase("tr-TR");

  if (normalized.includes("video") || normalized.includes("kurgu")) {
    return "VideoApplication";
  }

  if (normalized.includes("ses") || normalized.includes("voice") || normalized.includes("audio")) {
    return "MultimediaApplication";
  }

  if (
    normalized.includes("otomasyon") ||
    normalized.includes("entegrasyon") ||
    normalized.includes("workflow") ||
    normalized.includes("iş akışı")
  ) {
    return "BusinessApplication";
  }

  if (
    normalized.includes("tasarım") ||
    normalized.includes("görsel") ||
    normalized.includes("logo") ||
    normalized.includes("resim")
  ) {
    return "DesignApplication";
  }

  if (normalized.includes("verimlilik") || normalized.includes("üretkenlik")) {
    return "ProductivityApplication";
  }

  return "BusinessApplication";
}
