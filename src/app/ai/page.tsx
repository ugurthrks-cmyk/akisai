import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllTools } from "@/lib/content-source";
import { buildSiteMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./ai-hub.css";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Yapay Zekâ Araçları Kütüphanesi 2026 | En İyi Yazılım İncelemeleri",
    description:
      "Türkiye’nin yapay zekâ araçları dizini. Video, ses, metin ve otomasyon alanındaki uygulamaları tarafsız incelemelerle keşfedin.",
    path: "/ai",
  });
}

export default async function AIToolsHubPage() {
  const [allTools, settings] = await Promise.all([getAllTools(), getSiteSettings()]);

  const itemListElements = allTools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${settings.url}/ai/${tool.slug}`,
    name: tool.name || tool.title,
  }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${settings.name} Yapay Zekâ Araçları Kütüphanesi`,
    description: "Her alandan seçilmiş yapay zekâ araçlarının ayrıntılı, tarafsız ve uzman incelemeleri.",
    url: `${settings.url}/ai`,
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: itemListElements,
  };

  return (
    <div className="container ai-hub-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <header className="ai-hub-header">
        <h1 className="ai-hub-title">Tüm yapay zekâ araçları</h1>
        <p className="ai-hub-description">
          {settings.name} editörlerinin Türkiye pazarı için test ettiği yapay zekâ araçlarını kompakt
          katalog yapısında keşfedin. Büyük kapak görselleri yerine küçük logo, net açıklama ve
          karar sinyalleriyle ilerliyoruz.
        </p>
      </header>

      <div className="ai-hub-grid">
        {allTools.map((tool) => (
          <Link href={`/ai/${tool.slug}`} key={tool.slug} className="ai-hub-card">
            <div className="ai-hub-card-header">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.9rem",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.06)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {tool.logoUrl ? (
                    <Image
                      src={tool.logoUrl}
                      alt={`${tool.name} logosu`}
                      width={52}
                      height={52}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>{tool.name.slice(0, 1)}</span>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2 className="ai-hub-card-title">{tool.name || tool.title}</h2>
                  <span className="ai-category-badge">{tool.category || "Araç"}</span>
                </div>
              </div>
            </div>

            <p className="ai-hub-card-desc">{tool.description}</p>

            <div className="ai-hub-card-footer">
              <div className="ai-price-tag">
                {tool.pricing || (tool.hasFreeTier ? "Ücretsiz sürüm var" : "Ücretli")}
              </div>
              <div className="read-more-btn">
                İncelemeyi oku <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
