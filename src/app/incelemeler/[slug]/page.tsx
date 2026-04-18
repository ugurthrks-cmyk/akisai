import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthorBox from "@/components/AuthorBox";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentSignalGrid from "@/components/ContentSignalGrid";
import FaqSection from "@/components/FaqSection";
import MdxContent from "@/components/MdxContent";
import PortableTextContent from "@/components/PortableTextContent";
import {
  absoluteUrl,
  formatDisplayDate,
  normalizeSoftwareApplicationCategory,
  toIsoDate,
} from "@/lib/content";
import { getAllTools, getComparisonsByToolSlug, getGuideByToolSlug, getToolBySlug } from "@/lib/content-source";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "../../ai/[slug]/tool.css";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

const ratingLabels = [
  { key: "kullanimKolayligi", label: "Kullanım kolaylığı" },
  { key: "turkiyeUyumu", label: "Türkiye uyumu" },
  { key: "fiyatDeger", label: "Fiyat / değer" },
  { key: "ozellikler", label: "Özellikler" },
  { key: "destek", label: "Destek" },
] as const;

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const [tool, settings] = await Promise.all([getToolBySlug(resolvedParams.slug), getSiteSettings()]);
  const socialImagePath = `/incelemeler/${resolvedParams.slug}/opengraph-image`;
  const socialTwitterImagePath = `/incelemeler/${resolvedParams.slug}/twitter-image`;

  if (!tool) {
    return { title: "Araç bulunamadı" };
  }

  const title = tool.seoTitle || tool.title || `${tool.name} incelemesi ve kullanım alanları`;
  const description = tool.metaDescription || tool.description;
  const publishedTime = toIsoDate(tool.datePublished ?? tool.date);
  const modifiedTime = toIsoDate(tool.dateModified ?? tool.updatedAt ?? tool.datePublished ?? tool.date);

  const metadata = buildMetadata({
    title,
    description,
    path: `/incelemeler/${resolvedParams.slug}`,
    canonicalUrl: tool.canonicalUrl,
    openGraphTitle: tool.openGraphTitle,
    openGraphDescription: tool.openGraphDescription,
    type: "article",
    imagePath: tool.featuredImageUrl || socialImagePath,
    twitterImagePath: tool.featuredImageUrl || socialTwitterImagePath,
    imageAlt: tool.featuredImageAlt ?? tool.logoAlt ?? title,
    noIndex: tool.noIndex,
    publishedTime,
    modifiedTime,
    authors: tool.author ? [absoluteUrl(`/yazar/${tool.author.slug}`, settings.url)] : undefined,
    metadataAuthors: tool.author
      ? [{ name: tool.author.fullName, url: absoluteUrl(`/yazar/${tool.author.slug}`, settings.url) }]
      : [{ name: settings.name, url: settings.url }],
    creator: tool.author?.fullName || settings.name,
    publisher: settings.name,
    section: tool.category || "Yapay zeka araç incelemesi",
    baseUrl: settings.url,
    siteName: settings.name,
    locale: settings.locale,
    defaultImagePath: settings.defaultSocialImageUrl || "/opengraph-image",
    defaultTwitterImagePath: settings.defaultSocialImageUrl || "/twitter-image",
  });

  const metadataOtherEntries = Object.entries(metadata.other ?? {}).filter(
    ([, value]) => value !== undefined,
  ) as Array<[string, string | number | (string | number)[]]>;

  if (modifiedTime) {
    metadataOtherEntries.push(["last-modified", modifiedTime]);
  }

  return metadataOtherEntries.length > 0
    ? { ...metadata, other: Object.fromEntries(metadataOtherEntries) }
    : metadata;
}

export default async function ReviewDetailPage({ params }: ToolPageProps) {
  const resolvedParams = await params;
  const [tool, relatedGuide, relatedComparisons, settings] = await Promise.all([
    getToolBySlug(resolvedParams.slug),
    getGuideByToolSlug(resolvedParams.slug),
    getComparisonsByToolSlug(resolvedParams.slug),
    getSiteSettings(),
  ]);

  if (!tool) {
    notFound();
  }

  const pageUrl = tool.canonicalUrl || absoluteUrl(`/incelemeler/${resolvedParams.slug}`, settings.url);
  const pageTitle = tool.h1 || tool.title || `${tool.name} incelemesi`;
  const publishedAt = tool.datePublished ?? tool.date;
  const updatedAt = tool.dateModified ?? tool.updatedAt ?? tool.datePublished ?? tool.date;
  const socialImageUrl = absoluteUrl(`/incelemeler/${resolvedParams.slug}/opengraph-image`, settings.url);
  const mdxSource = tool.body.kind === "mdx" ? tool.body.source ?? null : null;
  const relatedGuideUrl = relatedGuide
    ? relatedGuide.canonicalUrl || absoluteUrl(`/rehber/${relatedGuide.slug}`, settings.url)
    : null;
  const relatedComparison = relatedComparisons[0] ?? null;
  const ratingRows = ratingLabels
    .map((item) => ({
      label: item.label,
      value: tool.ratingScores?.[item.key],
    }))
    .filter((item) => typeof item.value === "number");
  const reviewScore = tool.reviewScore ?? tool.reviewRating;
  const heroIntroParagraphs = tool.heroIntro
    ? tool.heroIntro.split(/\r?\n\s*\r?\n/).map((item) => item.trim()).filter(Boolean)
    : [];

  const publisherEntity = {
    "@type": "Organization",
    name: settings.name,
    url: settings.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(settings.logoPath, settings.url),
    },
  };

  const authorCredentialsList = tool.author?.credentials ?? [];
  const authorCredentials =
    authorCredentialsList.length > 0
      ? authorCredentialsList.map((credential) => ({
          "@type": "EducationalOccupationalCredential",
          name: credential,
        }))
      : undefined;

  const authorEntity = tool.author
    ? {
        "@type": "Person",
        name: tool.author.fullName,
        url: absoluteUrl(`/yazar/${tool.author.slug}`, settings.url),
        image: tool.author.avatarUrl ? absoluteUrl(tool.author.avatarUrl, settings.url) : undefined,
        jobTitle: tool.author.role,
        sameAs:
          tool.author.sameAs.length > 0
            ? tool.author.sameAs
            : [absoluteUrl(`/yazar/${tool.author.slug}`, settings.url)],
        alumniOf: tool.author.university
          ? {
              "@type": "CollegeOrUniversity",
              name: tool.author.university.split(",")[0].trim(),
            }
          : undefined,
        knowsAbout: tool.author.expertise,
        ...(authorCredentials ? { hasCredential: authorCredentials } : {}),
      }
    : publisherEntity;

  const offerSchema = tool.hasFreeTier
    ? {
        "@type": "Offer",
        price: "0",
        ...(tool.priceCurrency ? { priceCurrency: tool.priceCurrency } : {}),
        url: tool.websiteUrl || pageUrl,
      }
    : tool.priceAmount
      ? {
          "@type": "Offer",
          price: tool.priceAmount,
          ...(tool.priceCurrency ? { priceCurrency: tool.priceCurrency } : {}),
          url: tool.websiteUrl || pageUrl,
        }
      : undefined;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: pageUrl,
    applicationCategory: normalizeSoftwareApplicationCategory(tool.category),
    operatingSystem: "Web",
    inLanguage: "tr-TR",
    isAccessibleForFree: Boolean(tool.hasFreeTier),
    image:
      tool.featuredImageUrl ||
      tool.logoUrl ||
      socialImageUrl,
    ...(relatedGuideUrl ? { relatedLink: relatedGuideUrl } : {}),
    ...(offerSchema ? { offers: offerSchema } : {}),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: tool.description,
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    inLanguage: "tr-TR",
    datePublished: toIsoDate(publishedAt),
    dateModified: toIsoDate(updatedAt),
    author: authorEntity,
    publisher: publisherEntity,
    articleSection: tool.category || "Yapay zeka araç incelemesi",
    about: [
      {
        "@type": "Thing",
        name: tool.name,
      },
      tool.category
        ? {
            "@type": "Thing",
            name: tool.category,
          }
        : null,
    ].filter(Boolean),
    isAccessibleForFree: Boolean(tool.hasFreeTier),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".tool-header h1", ".tool-vision-description"],
    },
    image:
      tool.featuredImageUrl ||
      tool.logoUrl ||
      socialImageUrl,
    ...(relatedGuideUrl ? { relatedLink: relatedGuideUrl } : {}),
    ...(tool.sources && tool.sources.length > 0
      ? {
          citation: tool.sources.map((source) => ({
            "@type": "CreativeWork",
            name: source.label,
            url: source.url,
            ...(source.publisher
              ? {
                  publisher: {
                    "@type": "Organization",
                    name: source.publisher,
                  },
                }
              : {}),
            ...(source.note ? { description: source.note } : {}),
          })),
        }
      : {}),
  };

  const reviewSchema =
    typeof reviewScore === "number"
      ? {
          "@context": "https://schema.org",
          "@type": "Review",
          name: `${tool.name} inceleme`,
          inLanguage: "tr-TR",
          itemReviewed: {
            "@type": "SoftwareApplication",
            name: tool.name,
            url: pageUrl,
          },
          author: authorEntity,
          reviewRating: {
            "@type": "Rating",
            ratingValue: reviewScore,
            bestRating: "10",
            worstRating: "1",
          },
          datePublished: toIsoDate(publishedAt),
          reviewBody: tool.heroIntro || tool.description,
          ...(relatedGuideUrl ? { relatedLink: relatedGuideUrl } : {}),
        }
      : null;

  return (
    <div className="container tool-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {reviewSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      ) : null}

      <Breadcrumbs
        baseUrl={settings.url}
        items={[
          { name: "Ana Sayfa", href: "/" },
          { name: "İncelemeler", href: "/incelemeler" },
          { name: tool.name },
        ]}
      />

      <header className="tool-header">
        <div className="tool-header-content">
          <div className="tool-title-row">
            {tool.logoUrl ? (
              <div className="tool-logo-wrap">
                <Image src={tool.logoUrl} alt={tool.logoAlt || `${tool.name} logosu`} width={72} height={72}
                  sizes="72px"
                  priority />
              </div>
            ) : null}
            <div>
              <h1>{pageTitle}</h1>
              {heroIntroParagraphs.length > 0
                ? heroIntroParagraphs.map((paragraph, index) => (
                    <p
                      key={`hero-intro-${index}`}
                      className="tool-vision-description"
                    >
                      {paragraph}
                    </p>
                  ))
                : null}
            </div>
          </div>

          <div className="tool-meta-tags">
            {tool.category ? <span className="tag category">{tool.category}</span> : null}
            {tool.hasFreeTier ? <span className="tag free">Ücretsiz sürüm var</span> : null}
            {tool.tags.map((tag) => (
              <span key={tag} className="tag neutral">
                {tag}
              </span>
            ))}
          </div>

          <ContentSignalGrid
            items={[
              { label: "Kategori", value: tool.category || "Belirtilmedi" },
              {
                label: "Ücret modeli",
                value: tool.pricing || (tool.hasFreeTier ? "Ücretsiz başlangıç" : "Belirtilmedi"),
              },
              {
                label: "Türkçe desteği",
                value:
                  tool.trSupportLevel === "partial"
                    ? "Kısmen"
                    : tool.trSupportLevel === "full"
                      ? "Var"
                      : tool.trSupportLevel === "none"
                        ? "Yok"
                        : tool.isTRSupported
                          ? "Var"
                          : "Yok",
              },
              {
                label: "Yazar",
                value: tool.author?.fullName || "Editör ekibi",
                href: tool.author ? `/yazar/${tool.author.slug}` : undefined,
              },
              {
                label: "Son güncelleme",
                value: formatDisplayDate(updatedAt) || "Belirtilmedi",
              },
            ]}
          />

          {ratingRows.length > 0 ? (
            <section className="rating-panel">
              <div className="rating-panel-header">
                <div>
                  <h2>Genel Skor</h2>
                  <p>Beş kriterin ağırlıklı ortalamasıdır.</p>
                </div>
                {typeof reviewScore === "number" ? (
                  <div className="rating-score">
                    {reviewScore.toFixed(1)}
                    <span>/10</span>
                  </div>
                ) : null}
              </div>
              <div className="rating-grid">
                {ratingRows.map((item) => (
                  <div key={item.label} className="rating-row">
                    <span className="rating-label">{item.label}</span>
                    <div className="rating-bar">
                      <span style={{ width: `${((item.value ?? 0) / 10) * 100}%` }} />
                    </div>
                    <span className="rating-value">{item.value?.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </header>

      {tool.featuredImageUrl ? (
        <figure className="tool-featured-figure">
          <Image
            src={tool.featuredImageUrl}
            alt={tool.featuredImageAlt || `${tool.name} öne çıkan görseli`}
            width={1400}
            height={788}
            className="tool-featured-image"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
        </figure>
      ) : null}

      {tool.screenshots.length > 0 ? (
        <section className="tool-screenshot-section">
          <h2>Arayüz Görüntüleri</h2>
          <div className="tool-screenshot-grid">
            {tool.screenshots.map((screenshot) => (
              <figure key={screenshot.url} className="tool-screenshot-card">
                <Image
                  src={screenshot.url}
                  alt={screenshot.alt || `${tool.name} ekran görüntüsü`}
                  width={1200}
                  height={675}
                  className="tool-screenshot-image"
                  sizes="(max-width: 768px) 100vw, 560px"
                />
                {screenshot.caption ? <figcaption>{screenshot.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="pros-cons-grid">
        <div className="pros-card">
          <h2>Neden Öne Çıkıyor?</h2>
          <ul>
            {tool.pros.map((pro, idx) => (
              <li key={`pro-${idx}`}>{pro}</li>
            ))}
          </ul>
        </div>
        <div className="cons-card">
          <h2>Nerede Sınırlı Kalıyor?</h2>
          <ul>
            {tool.cons.map((con, idx) => (
              <li key={`con-${idx}`}>{con}</li>
            ))}
          </ul>
        </div>
      </section>

      <article className="mdx-content reading-surface">
        {mdxSource ? (
          <MdxContent source={mdxSource} />
        ) : (
          <PortableTextContent value={tool.body.kind === "portableText" ? tool.body.value : []} />
        )}
      </article>

      <AuthorBox author={tool.author} />

      <div className="tool-trust-footer">
        <p>
          Bu inceleme, karar vermeyi hızlandıran kullanım senaryosu, sınırlamalar ve erişim sinyalleriyle birlikte
          hazırlanır. Metodolojiyi <Link href="/yayin-ilkeleri">Yayın ve test ilkeleri</Link> sayfasında
          görebilirsiniz.
        </p>
      </div>

      {tool.websiteUrl ? (
        <div className="tool-cta-bottom">
          <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="cta-button large">
            {tool.name} resmî sitesine git
          </a>
        </div>
      ) : null}

      {relatedGuide ? (
        <section className="related-link-panel">
          <div className="related-link-copy">
            <span className="related-link-kicker">Bu Aracın Rehberi</span>
            <h2>{relatedGuide.h1 || relatedGuide.title}</h2>
            <p>{relatedGuide.description}</p>
          </div>
          <Link href={`/rehber/${relatedGuide.slug}`} className="related-link-cta">
            Rehbere git
          </Link>
        </section>
      ) : null}

      {relatedComparison ? (
        <section className="related-link-panel">
          <div className="related-link-copy">
            <span className="related-link-kicker">Bu Aracin Karsilastirmasi</span>
            <h2>{relatedComparison.h1 || relatedComparison.title}</h2>
            <p>{relatedComparison.description}</p>
          </div>
          <Link href={`/karsilastirma/${relatedComparison.slug}`} className="related-link-cta">
            Karsilastirmaya git
          </Link>
        </section>
      ) : null}

      <FaqSection faqs={tool.faqs} />
    </div>
  );
}
