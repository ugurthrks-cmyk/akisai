import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllCategories } from "@/lib/content-source";
import { buildSiteMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./[slug]/category.css";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Yapay Zeka Kategorileri | AkışAI",
    description:
      "Yapay zeka araçlarını kullanım alanına göre keşfet. Türkiye'de test edilmiş incelemeler ve adım adım rehberlerle doğru aracı bul.",
    path: "/kategori",
  });
}

export default async function GlobalCategoriesHub() {
  const [categories, settings] = await Promise.all([getAllCategories(), getSiteSettings()]);

  const categoryHubSchema = {
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
            name: "Kategoriler",
            item: `${settings.url}/kategori`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "Yapay Zeka Kategorileri",
        description: "Kullanım alanına göre gruplanmış yapay zeka araç incelemeleri.",
        url: `${settings.url}/kategori`,
        inLanguage: "tr-TR",
        hasPart: [
          {
            "@type": "CollectionPage",
            name: "Yapay Zeka Asistanları",
            url: "https://akisai.com.tr/kategori/yapay-zeka-asistanlari",
          },
          {
            "@type": "CollectionPage",
            name: "Video Düzenleme",
            url: "https://akisai.com.tr/kategori/video-duzenleme",
          },
          {
            "@type": "CollectionPage",
            name: "Video Oluşturma",
            url: "https://akisai.com.tr/kategori/video-olusturma",
          },
          {
            "@type": "CollectionPage",
            name: "İş Akışı Otomasyonu",
            url: "https://akisai.com.tr/kategori/is-akisi-otomasyonu",
          },
          {
            "@type": "CollectionPage",
            name: "Görsel Oluşturma",
            url: "https://akisai.com.tr/kategori/gorsel-olusturma",
          },
          {
            "@type": "CollectionPage",
            name: "Ses Oluşturma",
            url: "https://akisai.com.tr/kategori/ses-olusturma",
          },
          {
            "@type": "CollectionPage",
            name: "Logo Tasarımı",
            url: "https://akisai.com.tr/kategori/logo-tasarimi",
          },
        ],
        isPartOf: {
          "@type": "WebSite",
          name: settings.name,
          url: settings.url,
        },
      },
    ],
  };

  return (
    <div className="container category-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryHubSchema) }} />
      <header className="category-header">
        <h1 className="category-title">Yapay Zeka Kategorileri</h1>
        <p className="category-description">
          Kategori sayfaları, araç adlarından önce ihtiyacı netleştirmek için var. Önce çözmek istediğiniz işi seçip
          sonra ilgili incelemelere geçerseniz daha doğru araçları daha hızlı ayırabilirsiniz.
        </p>
      </header>

      <section className="category-tools-grid">
        {categories.map((cat) => (
          <Link href={`/kategori/${cat.slug}`} key={cat.slug} style={{ textDecoration: "none" }}>
            <div className="category-tool-card tool-card-content">
              {cat.iconUrl ? (
                <div className="category-list-icon">
                  <Image
                    src={cat.iconUrl}
                    alt={cat.iconAlt || `${cat.name} ikonu`}
                    width={48}
                    height={48}
                    sizes="48px"
                  />
                </div>
              ) : null}
              <h2 className="tool-card-title" style={{ marginBottom: "1rem" }}>
                {cat.name}
              </h2>
              <p className="tool-card-desc" style={{ marginBottom: "0" }}>
                {cat.description}
              </p>
              <div
                style={{
                  marginTop: "1.2rem",
                  color: "var(--accent-primary)",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                }}
              >
                Kategoriyi Aç <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="category-mdx-content category-hub-content">
        <div className="category-hub-section">
          <h2 className="category-hub-heading">Kategori Sayfaları Nasıl Kullanılmalı?</h2>
          <p>
            Bu sayfa, tek tek araç adlarından önce ihtiyacı netleştirmek için var. Hangi aracın öne çıktığını anlamadan
            önce çözmek istediğiniz işin türünü doğru tanımlamak daha sağlıklı bir başlangıç sağlar.
          </p>
          <p>
            Doğru kategoriye girdikten sonra iki şey kolaylaşır: aynı problemi çözen araç kümelerini görürsünüz ve
            gereksiz karşılaştırmalarla vakit kaybetmezsiniz. Böylece karar süreci daha net ve daha hızlı ilerler.
          </p>
        </div>

        <div className="category-hub-section">
          <h2 className="category-hub-heading">İhtiyaca Göre Hangi Kategoriye Gitmelisiniz?</h2>
          <p>
            ChatGPT, Claude, Gemini ve benzeri genel amaçlı araçları karşılaştırmak istiyorsanız{" "}
            <Link href="/kategori/yapay-zeka-asistanlari">Yapay Zeka Asistanları</Link> doğru başlangıç noktasıdır.
          </p>
          <p>
            Hazır çekilmiş videoları kesmek, altyazı eklemek ve sosyal medya formatına uyarlamak istiyorsanız{" "}
            <Link href="/kategori/video-duzenleme">Video Düzenleme</Link> doğru başlangıçtır. Metinden sahne üretmek,
            avatar video hazırlamak veya reklam taslağı çıkarmak istiyorsanız{" "}
            <Link href="/kategori/video-olusturma">Video Oluşturma</Link> daha uygun merkezdir.
          </p>
          <p>
            Formlar, CRM kayıtları ve ekip bildirimleri arasında tekrar eden işleri devretmek için{" "}
            <Link href="/kategori/is-akisi-otomasyonu">İş Akışı Otomasyonu</Link> kategorisine geçin. Kampanya
            kreatifi, ürün görseli ve sosyal medya taslakları için{" "}
            <Link href="/kategori/gorsel-olusturma">Görsel Oluşturma</Link>, anlatım sesi ve klonlama için{" "}
            <Link href="/kategori/ses-olusturma">Ses Oluşturma</Link>, hızlı marka yönü görmek için de{" "}
            <Link href="/kategori/logo-tasarimi">Logo Tasarımı</Link> daha doğru giriş noktalarıdır.
          </p>
        </div>

        <div className="category-hub-section">
          <h2 className="category-hub-heading">Kategori, Araç İncelemesi ve Rehber Arasındaki Fark Nedir?</h2>
          <p>
            Kategori sayfaları hangi alana gireceğinizi gösterir. Araç incelemeleri, tek bir çözümün size uygun olup
            olmadığını anlamanızı sağlar. Rehber sayfaları ise seçtiğiniz aracı nasıl kullanacağınızı adım adım
            öğretir.
          </p>
          <p>
            Bu yapıyı bilinçli kuruyoruz; çünkü aynı sayfada hem kategori tanımı, hem araç incelemesi, hem de kullanım
            eğitimi vermek çoğu zaman odağı dağıtır. Ayrı ama bağlantılı sayfalar hem kullanıcı hem de Google için daha
            nettir.
          </p>
        </div>
      </section>
    </div>
  );
}
