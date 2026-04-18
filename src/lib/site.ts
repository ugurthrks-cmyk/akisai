export const siteConfig = {
  name: "AkışAI",
  shortName: "AkışAI",
  defaultTitle: "AkışAI | Yapay Zeka Araçları, İncelemeleri, Karşılaştırmaları ve Rehberleri",
  description:
    "AkışAI, yapay zeka araçlarını detaylıca inceleyen, karşılaştıran, kullanım rehberleri sunan ve doğru aracı seçmenizi kolaylaştıran bağımsız bir platformdur.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://akisai.com.tr",
  locale: "tr_TR",
  category: "technology",
  logoPath: "/logo.svg",
} as const;
