import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllTools } from "@/lib/content-source";
import { buildSiteMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "../ai/ai-hub.css";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Yapay Zeka Araç İncelemeleri | AkışAI",
    description:
      "Karar vermeyi hızlandıran yapay zeka araç incelemeleri, fiyat başlangıçları, Türkçe destek sinyalleri ve kategori ilişkileriyle AkışAI inceleme merkezini keşfedin.",
    path: "/incelemeler",
  });
}

export default async function ReviewsHubPage() {
  const [allTools, settings] = await Promise.all([getAllTools(), getSiteSettings()]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${settings.name} yapay zeka araç incelemeleri`,
    description:
      "Karar vermeyi hızlandıran, kullanım senaryosu odaklı yapay zeka araç incelemeleri ve değerlendirme sayfaları.",
    url: `${settings.url}/incelemeler`,
    inLanguage: "tr-TR",
  };

  return (
    <div className="container ai-hub-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <header className="ai-hub-header">
        <h1 className="ai-hub-title">Yapay Zeka Araç İncelemeleri</h1>
        <p className="ai-hub-description">
          Bu alan ham bir araç listesi gibi davranmaz. Araçları; kategori bağlamı, fiyat başlangıcı, Türkçe destek,
          erişim eşiği ve karar vermeyi hızlandıran editoryal özetlerle birlikte sunar.
        </p>
      </header>

      <div className="ai-hub-grid">
        {allTools.map((tool) => (
          <Link href={`/incelemeler/${tool.slug}`} key={tool.slug} className="ai-hub-card">
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
                      sizes="52px"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>{tool.name.slice(0, 1)}</span>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2 className="ai-hub-card-title">{tool.name || tool.title}</h2>
                  <span className="ai-category-badge">{tool.category || "Yapay Zeka Aracı"}</span>
                </div>
              </div>
            </div>

            <p className="ai-hub-card-desc">{tool.description}</p>

            <div className="ai-hub-card-footer">
              <div className="ai-price-tag">
                {tool.pricing || (tool.hasFreeTier ? "Ücretsiz Başlangıç Var" : "Detaylı Değerlendirme")}
              </div>
              <div className="read-more-btn">
                İncelemeyi Aç <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
