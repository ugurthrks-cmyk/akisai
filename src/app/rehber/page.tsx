import Link from "next/link";
import type { Metadata } from "next";
import { getAllGuides } from "@/lib/content-source";
import { buildSiteMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./rehber.css";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Yapay Zeka Nasıl Kullanılır Rehberleri | AkışAI",
    description:
      "Yapay zeka araçları nasıl kullanılır? CapCut, Zapier ve benzeri araçlar için adım adım kullanım rehberlerini inceleyin.",
    path: "/rehber",
  });
}

export default async function RehberHubPage() {
  const [allGuides, settings] = await Promise.all([getAllGuides(), getSiteSettings()]);

  const guideItems = allGuides.map((guide, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${settings.url}/rehber/${guide.slug}`,
    name: guide.h1 || guide.title,
    description: guide.description,
  }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `${settings.name} yapay zeka nasıl kullanılır rehberleri`,
        description: "Adım adım yapay zeka kullanım rehberleri ve uygulanabilir kurulum içerikleri.",
        url: `${settings.url}/rehber`,
        inLanguage: "tr-TR",
        hasPart: guideItems.map((item) => ({
          "@type": "Article",
          headline: item.name,
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
        name: "Nasıl kullanılır rehberleri",
        inLanguage: "tr-TR",
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: guideItems.length,
        itemListElement: guideItems,
      },
    ],
  };

  return (
    <div className="container rehber-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <header className="rehber-header">
        <h1 className="rehber-title">Yapay Zeka Nasıl Kullanılır Rehberleri</h1>
        <p className="rehber-description">
          Bu sayfalar, Türkiye&apos;de sık aranan “nasıl kullanılır?” niyetine göre hazırlanır. Her rehber tek bir
          aracı tanıtmakla kalmaz; kurulum adımlarını, dikkat edilmesi gereken noktaları ve gerçek kullanım sürecini
          birlikte açıklar.
        </p>
      </header>

      <div className="rehber-grid">
        {allGuides.map((guide) => (
          <Link href={`/rehber/${guide.slug}`} key={guide.slug} className="rehber-card">
            <div className="rehber-card-header">
              <h2 className="rehber-card-title">{guide.h1 || guide.title}</h2>

              <div className="rehber-meta-group">
                {guide.difficulty ? (
                  <div className="rehber-meta-item">
                    <span>Zorluk:</span> {guide.difficulty}
                  </div>
                ) : null}
                {guide.time ? (
                  <div className="rehber-meta-item">
                    <span>Süre:</span> {guide.time}
                  </div>
                ) : null}
              </div>
            </div>

            <p className="rehber-card-desc">{guide.description}</p>

            <div className="rehber-card-footer">
              <div className="read-more-btn">
                Rehberi Aç <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
