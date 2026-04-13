import type { Metadata } from "next";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { coreCategoryTaxonomy } from "@/lib/category-taxonomy";
import { getAllGuides, getAllTools } from "@/lib/content-source";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return buildMetadata({
    title: settings.defaultTitle,
    description: settings.description,
    path: "/",
    baseUrl: settings.url,
    siteName: settings.name,
    locale: settings.locale,
    defaultImagePath: settings.defaultSocialImageUrl || "/opengraph-image",
    defaultTwitterImagePath: settings.defaultSocialImageUrl || "/twitter-image",
    imageAlt: settings.defaultSocialImageAlt || settings.name,
  });
}

function getFreshnessValue(dateModified?: string, datePublished?: string, date?: string) {
  const value = dateModified || datePublished || date;
  return value ? new Date(value).getTime() : 0;
}

export default async function HomePage() {
  const [settings, tools, guides] = await Promise.all([
    getSiteSettings(),
    getAllTools(),
    getAllGuides(),
  ]);

  const featureReadyGuides = guides.filter(
    (guide) =>
      (guide.h1 || guide.title).trim().length >= 25 &&
      guide.category &&
      guide.author &&
      guide.description.trim().length >= 80 &&
      (guide.estimatedTimeMinutes || guide.difficulty),
  );

  const latestTools = [...tools]
    .sort(
      (left, right) =>
        getFreshnessValue(right.dateModified, right.datePublished, right.date) -
        getFreshnessValue(left.dateModified, left.datePublished, left.date),
    )
    .slice(0, 6);
  const featuredGuides = (featureReadyGuides.length > 0 ? featureReadyGuides : guides).slice(0, 6);

  const trustSignals = [
    {
      title: "Test Edilmiş İncelemeler",
      description: "Araç sayfaları kullanım senaryosu, karar sinyalleri ve gerçek sınırlamaları birlikte açıklar.",
    },
    {
      title: "Adım Adım Rehberler",
      description: "Rehberler, kullanıcıların en sık aradığı nasıl kullanılır niyetine doğrudan yanıt verir.",
    },
    {
      title: "Şeffaf Editoryal Yapı",
      description: "Yazarlar, yayın ilkeleri ve kategori mantığı açık şekilde görünür.",
    },
  ];

  const heroTopics = coreCategoryTaxonomy.map((topic) => ({
    href: `/kategori/${topic.slug}`,
    label: topic.name,
  }));

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.name,
    url: settings.url,
    logo: `${settings.url}${settings.logoPath}`,
    description: settings.organizationDescription,
    inLanguage: "tr-TR",
    sameAs: settings.socialProfiles,
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.name,
    url: settings.url,
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${settings.url}/arama?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />

      <section className="hero-wrapper">
        <div className="container hero-stack">
          <div className="hero-content hero-content-compact">
            <span className="hero-kicker">Türkiye İçin Yapay Zeka Araçları ve Rehberleri</span>
            <h1>Yapay Zeka Araçları, İncelemeleri ve Nasıl Kullanılır Rehberleri</h1>
            <p className="vision-paragraph">
              AkışAI; Türkiye için yapay zeka araç incelemelerini, kullanım alanı merkezlerini ve adım adım kullanım
              rehberlerini tek bir editoryal karar katmanında birleştirir.
            </p>
            <SearchBar />
            <div className="hero-topic-strip" aria-label="Öne çıkan kullanım alanları">
              {heroTopics.map((topic) => (
                <Link key={topic.href} href={topic.href} className="hero-topic-chip">
                  {topic.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="trust-banner-wrapper">
        <aside className="trust-banner container">
          <div className="trust-content trust-content-compact">
            {trustSignals.map((signal) => (
              <div className="trust-item" key={signal.title}>
                <strong>{signal.title}</strong>
                <span>{signal.description}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="page-sections">
        <section className="section-shell section-shell-tools container">
          <div className="section-header">
            <div>
              <span className="section-kicker">Araç İncelemeleri</span>
              <h2>Yapay Zeka İncelemeleri</h2>
              <p className="section-description">
                Her araç sayfası yalnızca ne yaptığını değil, kim için mantıklı olduğunu, nerede sınırlı kaldığını ve
                ücret tarafında ne beklemeniz gerektiğini anlatır.
              </p>
            </div>
          </div>

          <div className="grid-3 home-grid">
            {latestTools.length > 0 ? (
              latestTools.map((tool) => (
                <Link href={`/incelemeler/${tool.slug}`} className="glass-card tool-card tool-card-link" key={tool.slug}>
                  <div className="tool-header">
                    <div>
                      <div className="card-eyebrow">Araç İncelemesi</div>
                      <h3>{tool.name}</h3>
                    </div>
                  </div>
                  <p className="tool-desc">{tool.description}</p>
                  <div className="tool-pills">
                    {tool.category ? <span className="tool-pill">{tool.category}</span> : null}
                    {tool.hasFreeTier ? <span className="tool-pill">Ücretsiz Başlangıç</span> : null}
                    {tool.isTRSupported ? <span className="tool-pill">Türkçe Destekli</span> : null}
                  </div>
                  <span className="tool-card-cta">İncelemeyi Aç</span>
                </Link>
              ))
            ) : (
              <div className="glass-card empty-state-card">
                <h3>İnceleme Arşivi Güncelleniyor</h3>
                <p>
                  Yeni araç incelemeleri yayına girdikçe bu alan dolacak. Şimdilik kullanım rehberlerinden
                  başlayabilirsiniz.
                </p>
                <Link href="/incelemeler" className="secondary-btn">
                  Tüm İncelemelere Git
                </Link>
              </div>
            )}
          </div>

          <div className="section-actions">
            <Link href="/incelemeler" className="secondary-btn">
              Tüm İncelemeleri Gör
            </Link>
          </div>
        </section>

        <section className="section-shell section-shell-guides container">
          <div className="section-header">
            <div>
              <span className="section-kicker">Nasıl Kullanılır Rehberleri</span>
              <h2>Adım Adım Kullanım ve Kurulum İçerikleri</h2>
              <p className="section-description">
                Rehberler, tek bir ürün sayfası gibi davranmaz. Aracı nasıl kurmanız gerektiğini ve ilk sonuçları nasıl
                alacağınızı gerçek kullanım akışına en yakın biçimde gösterir.
              </p>
            </div>
          </div>

          <div className="guide-grid">
            {featuredGuides.length > 0 ? (
              featuredGuides.map((guide) => (
                <Link href={`/rehber/${guide.slug}`} key={guide.slug} className="glass-card guide-card">
                  <div className="tool-header">
                    <div>
                      <div className="card-eyebrow">Nasıl Kullanılır</div>
                      <h3>{guide.h1 || guide.title}</h3>
                    </div>
                  </div>
                  <p className="tool-desc">{guide.description}</p>
                  <div className="tool-pills">
                    {guide.time ? <span className="tool-pill">{guide.time}</span> : null}
                    {guide.difficulty ? <span className="tool-pill">{guide.difficulty}</span> : null}
                  </div>
                  <span className="guide-card-cta">Rehberi Aç</span>
                </Link>
              ))
            ) : (
              <div className="glass-card empty-state-card">
                <h3>Rehberler Hazırlanıyor</h3>
                <p>
                  Yeni kullanım rehberleri yayına girdikçe bu alan dolacak. Şimdilik araç incelemelerinden
                  ilerleyebilirsiniz.
                </p>
                <Link href="/rehber" className="secondary-btn">
                  Tüm Rehberlere Git
                </Link>
              </div>
            )}
          </div>

          <div className="section-actions">
            <Link href="/rehber" className="secondary-btn">
              Tüm Rehberleri Gör
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
