import { siteConfig } from "@/lib/site";

function isSpecialProtocol(protocol: string) {
  return ["mailto:", "tel:", "sms:"].includes(protocol);
}

export function isExternalHref(href: string) {
  const trimmedHref = href.trim();

  if (!trimmedHref || trimmedHref.startsWith("#") || trimmedHref.startsWith("/")) {
    return false;
  }

  try {
    const baseUrl = new URL(siteConfig.url);
    const resolvedUrl = new URL(trimmedHref, siteConfig.url);

    if (isSpecialProtocol(resolvedUrl.protocol)) {
      return false;
    }

    return resolvedUrl.origin !== baseUrl.origin;
  } catch {
    return false;
  }
}

export function getExternalLinkProps(href: string) {
  return isExternalHref(href)
    ? {
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {};
}
