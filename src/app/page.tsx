import type { Metadata } from "next";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getAllCategories, getAllGuides, getAllTools } from "@/lib/content-source";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";

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

export default async function HomePage() {
  const [settings, categories, tools, guides] = await Promise.all([
    getSiteSettings(),
    getAllCategories(),
    getAllTools(),
    getAllGuides(),
  ]);

  const heroVisionText = `${settings.name}, Türkiye’nin en kapsamlı yapay zekâ araçları ve iş akışı optimizasyonu kütüphanesidir. Video üretimi, otomasyon, e-ticaret ve operasyonel verimlilik alanlarında dünyanın en güçlü çözümlerini bağımsız biçimde inceliyor ve doğrudan uygulanabilir rehberlerle birlikte sunuyoruz.`;

  const featureReadyGuides = guides.filter(
    (guide) =>
      (guide.h1 || guide.title).trim().length >= 25 &&
      guide.category &&
      guide.author &&
      guide.description.trim().length >= 80 &&
      (guide.estimatedTimeMinutes || guide.difficulty),
  );

  const featuredCategories = categories.slice(0, 3);
  const featuredTools = tools.slice(0, 3);
  const featuredGuides = (featureReadyGuides.length > 0 ? featureReadyGuides : guides).slice(0, 2);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.name,
    url: settings.url,
    logo: `${settings.url}${settings.logoPath}`,
    description: settings.organizationDescription,
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.name,
    url: settings.url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />

      <section className="hero-wrapper">
        <div className="hero-content">
          <h1>Türkiye’nin Yapay Zekâ Uygulama Rehberi</h1>
          <p className="vision-paragraph">{heroVisionText}</p>
          <SearchBar />
        </div>
      </section>

      <div className="trust-banner-wrapper">
        <aside className="trust-banner">
          <div className="trust-content">
            <div className="trust-item">
              <i>✓</i> 8 aşamalı bağımsız test
            </div>
            <div className="trust-item">
              <i>✓</i> Uzman editoryal kadro
            </div>
            <div className="trust-item">
              <i>✓</i> Sponsorluktan bağımsız değerlendirme
            </div>
            <div className="trust-item">
              <i>✓</i> Düzenli güncelleme ve doğrulama
            </div>
          </div>
        </aside>
      </div>

      <div className="page-sections">
        <section>
          <h2>Kategoriler ve çözüm merkezleri</h2>
          <div className="grid-3">
            {featuredCategories.map((category) => (
              <Link
                href={`/kategori/${category.slug}`}
                key={category.slug}
                className="glass-card hub-card"
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2>Öne çıkan araçlar</h2>
          <div className="grid-3">
            {featuredTools.map((tool) => (
              <div className="glass-card tool-card" key={tool.slug}>
                <div className="tool-header">
                  <h3>{tool.name}</h3>
                </div>
                <p className="tool-desc">{tool.description}</p>
                <ul className="tool-features">
                  {tool.category ? <li>{tool.category} kategorisinde konumlanır</li> : null}
                  {tool.hasFreeTier ? <li>Ücretsiz sürüm veya başlangıç planı bulunur</li> : null}
                  {tool.isTRSupported ? <li>Türkçe kullanım desteği bulunur</li> : null}
                </ul>
                <Link href={`/ai/${tool.slug}`} className="primary-btn">
                  İncelemeyi oku
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Popüler iş akışları</h2>
          <p style={{ maxWidth: "600px", marginTop: "-1rem", marginBottom: "2rem" }}>
            Araçları birbirine bağlayarak saatler süren manuel işleri saniyelere indirin. Nasıl
            yapılacağını adım adım öğrenin.
          </p>
          <div className="workflow-list">
            {featuredGuides.map((guide) => (
              <Link href={`/rehber/${guide.slug}`} key={guide.slug} className="workflow-item">
                <div className="workflow-info">
                  <h4>{guide.h1 || guide.title}</h4>
                  <p className="text-muted">
                    {guide.category ? `Kategori: ${guide.category}` : "Uygulamalı rehber"}
                    {guide.time ? ` · Süre: ${guide.time}` : ""}
                  </p>
                </div>
                <span className="workflow-arrow">→</span>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link href="/rehber" className="secondary-btn">
              Tüm iş akışlarını keşfet
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
