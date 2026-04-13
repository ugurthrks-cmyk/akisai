"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    if (!gaId) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      ((...args: unknown[]) => {
        window.dataLayer?.push(args);
      });
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true });
  }, [gaId]);

  useEffect(() => {
    if (!gtmId) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtm.start": Date.now(),
      event: "gtm.js",
    });
  }, [gtmId]);

  if (!gaId && !gtmId) {
    return null;
  }

  return (
    <>
      {gaId ? (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="lazyOnload"
        />
      ) : null}
      {gtmId ? (
        <Script
          src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          strategy="lazyOnload"
        />
      ) : null}
    </>
  );
}
