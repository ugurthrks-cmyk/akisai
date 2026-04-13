export const siteConfig = {
  name: "AkışAI",
  shortName: "AkışAI",
  defaultTitle: "AkışAI | Yapay zeka araçları ve nasıl kullanılır rehberleri",
  description:
    "AkışAI, Türkiye için yapay zeka araç incelemeleri, kullanım rehberleri ve karar vermeyi kolaylaştıran kategori merkezleri sunar.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://akisai.com.tr",
  locale: "tr_TR",
  category: "technology",
  logoPath: "/logo.svg",
} as const;
