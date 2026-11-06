import { serializeJsonLd } from "@/lib/json-ld";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllComparisons } from "@/lib/content-source";
import { buildSiteMetadata, clampText } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "../ai/ai-hub.css";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Yapay Zeka Araç Karşılaştırmaları | AkışAI",
    description:
      "Hangi yapay zeka aracı hangi senaryoda daha mantıklı? AkışAI karşılaştırmalarında fiyat, erişim, Türkçe destek ve kullanım senaryolarını yan yana inceleyin.",
    path: "/karsilastirma",
  });
}

export default async function ComparisonHubPage() {
  const [comparisons, settings] = await Promise.all([getAllComparisons(), getSiteSettings()]);

  const comparisonItems = comparisons.map((comparison, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${settings.url}/karsilastirma/${comparison.slug}`,
    name: comparison.h1 || comparison.title,
    description: comparison.description,
  }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        inLanguage: "tr-TR",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Ana Sayfa",
            item: settings.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Karşılaştırmalar",
            item: `${settings.url}/karsilastirma`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${settings.name} yapay zeka araç karşılaştırmaları`,
        description:
          "Senaryo bazlı yapay zeka araç karşılaştırmaları, karar notları ve aynı ihtiyaca cevap veren araçların editör yorumu.",
        url: `${settings.url}/karsilastirma`,
        inLanguage: "tr-TR",
        hasPart: comparisonItems.map((item) => ({
          "@type": "Article",
          headline: clampText(item.name, 110),
          url: item.url,
          description: item.description,
        })),
        isPartOf: {
          "@type": "WebSite",
          name: settings.name,
          url: settings.url,
        },
      },
      {
        "@type": "ItemList",
        name: "Karşılaştırma yazıları",
        inLanguage: "tr-TR",
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: comparisonItems.length,
        itemListElement: comparisonItems,
      },
    ],
  };

  return (
    <div className="container ai-hub-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionSchema) }} />

      <header className="ai-hub-header">
        <h1 className="ai-hub-title">Yapay Zeka Araç Karşılaştırmaları</h1>
        <p className="ai-hub-description">
          Bu merkez, birbirine yakın ihtiyaçları çözen araçları ham özellik listesiyle değil; karar eşiği, kullanım
          senaryosu, fiyat mantığı ve Türkiye uyumu gibi pratik sinyallerle karşılaştırır.
        </p>
      </header>

      <div className="ai-hub-grid">
        {comparisons.map((comparison) => (
          <Link href={`/karsilastirma/${comparison.slug}`} key={comparison.slug} className="ai-hub-card">
            <div className="ai-hub-card-header">
              <h2 className="ai-hub-card-title">{comparison.h1 || comparison.title}</h2>
              <span className="ai-category-badge">{comparison.category || "Araç Karşılaştırması"}</span>
            </div>

            <p className="ai-hub-card-desc">{comparison.description}</p>

            <div className="ai-hub-card-footer">
              <div className="ai-price-tag">
                {comparison.comparedToolNames && comparison.comparedToolNames.length > 0
                  ? comparison.comparedToolNames.join(" • ")
                  : "Senaryo bazlı araç karşılaştırması"}
              </div>
              <div className="read-more-btn">
                Karşılaştırmayı Aç <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
