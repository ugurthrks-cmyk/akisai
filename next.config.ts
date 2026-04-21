import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  isDev ? "'unsafe-eval'" : null,
  "https:",
  "blob:",
]
  .filter(Boolean)
  .join(" ");

const connectSrc = [
  "'self'",
  "https://*.sanity.io",
  "wss://*.sanity.io",
  "https://*.google-analytics.com",
  "https://*.googletagmanager.com",
  isDev ? "ws:" : null,
  isDev ? "wss:" : null,
]
  .filter(Boolean)
  .join(" ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https:",
      `script-src ${scriptSrc}`,
      `connect-src ${connectSrc}`,
      "worker-src 'self' blob:",
      "frame-src 'self' https:",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/ai",
        destination: "/incelemeler",
        permanent: true,
      },
      {
        source: "/ai/:slug",
        destination: "/incelemeler/:slug",
        permanent: true,
      },
      {
        source: "/karsilastirmalar",
        destination: "/karsilastirma",
        permanent: true,
      },
      {
        source: "/karsilastirmalar/:slug",
        destination: "/karsilastirma/:slug",
        permanent: true,
      },
      {
        source: "/search",
        destination: "/arama",
        permanent: true,
      },
      {
        source: "/sayfa",
        destination: "/",
        permanent: true,
      },
      {
        source: "/sayfa/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
