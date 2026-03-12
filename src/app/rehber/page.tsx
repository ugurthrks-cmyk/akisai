import Link from "next/link";
import type { Metadata } from "next";
import { getAllGuides } from "@/lib/content-source";
import { buildSiteMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./rehber.css";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Yapay Zekâ Eğitim Rehberleri ve Otomasyon Kurulumları (2026)",
    description:
      "İş süreçlerinizi saniyelere indirecek adım adım yapay zekâ rehberleri. Kodlama bilmeden dijital otomasyon kurguları kurmanın yollarını keşfedin.",
    path: "/rehber",
  });
}

export default async function RehberHubPage() {
  const [allGuides, settings] = await Promise.all([getAllGuides(), getSiteSettings()]);

  const itemListElements = allGuides.map((guide, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "HowTo",
      url: `${settings.url}/rehber/${guide.slug}`,
      name: guide.title,
      description: guide.description,
    },
  }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${settings.name} otomasyon ve araç rehberleri`,
    description: "Adım adım yapay zekâ araçları kullanım kılavuzları ve otomasyon kurulum rehberleri.",
    url: `${settings.url}/rehber`,
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: itemListElements,
  };

  return (
    <div className="container rehber-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <header className="rehber-header">
        <h1 className="rehber-title">Otomasyon ve eğitim rehberleri</h1>
        <p className="rehber-description">
          Karmaşık kurulumları, kopyala-yapıştır entegrasyonları ve pahalı eğitim setlerini unutun.
          {` ${settings.name} `}rehberleri adım adım uygulanabilir otomasyon senaryolarına odaklanır.
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
                Rehberi incele <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
