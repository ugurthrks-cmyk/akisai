import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { siteConfig } from "@/lib/site";
import lastModifiedManifest from "./src/generated/last-modified-manifest.json";

type ManifestShape = Record<string, string>;

const manifest = lastModifiedManifest as ManifestShape;
const canonicalSiteUrl = new URL(siteConfig.url);
const canonicalHostname = canonicalSiteUrl.hostname.toLowerCase();
const canonicalProtocol = canonicalSiteUrl.protocol.replace(":", "");
const canonicalPort = canonicalSiteUrl.port;
const wwwHostname = canonicalHostname.startsWith("www.") ? canonicalHostname : `www.${canonicalHostname}`;

function normalizePathname(pathname: string) {
  return pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function getRedirectResponse(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = url.hostname.toLowerCase();
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  const shouldNormalizeTrailingSlash = !url.pathname.startsWith("/api/");
  const normalizedPathname = shouldNormalizeTrailingSlash ? normalizePathname(url.pathname) : url.pathname;
  const lowercasePathname = normalizedPathname.toLowerCase();
  const isCanonicalDomainRequest = hostname === canonicalHostname || hostname === wwwHostname;
  const needsHostRedirect = hostname === wwwHostname;
  const needsProtocolRedirect = isCanonicalDomainRequest && forwardedProto !== canonicalProtocol;
  const needsPathRedirect =
    normalizedPathname !== url.pathname || lowercasePathname !== normalizedPathname;

  if (!needsHostRedirect && !needsProtocolRedirect && !needsPathRedirect) {
    return null;
  }

  if (needsHostRedirect) {
    url.hostname = canonicalHostname;
  }

  if (needsProtocolRedirect) {
    url.protocol = `${canonicalProtocol}:`;
    url.port = canonicalPort;
  }

  url.pathname = lowercasePathname;

  return NextResponse.redirect(url, 308);
}

export function middleware(request: NextRequest) {
  const redirectResponse = getRedirectResponse(request);

  if (redirectResponse) {
    return redirectResponse;
  }

  const pathname = normalizePathname(request.nextUrl.pathname);
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const lastModified = manifest[pathname];
  const response = NextResponse.next();

  if (isAdminPath) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  if (lastModified) {
    response.headers.set("Last-Modified", lastModified);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.[^/]+$).*)",
    "/robots.txt",
    "/sitemap.xml",
  ],
};
