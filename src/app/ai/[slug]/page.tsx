import Image from "next/image";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentSignalGrid from "@/components/ContentSignalGrid";
import PortableTextContent from "@/components/PortableTextContent";
import { absoluteUrl, formatDisplayDate, toIsoDate } from "@/lib/content";
import { getAllTools, getToolBySlug, type FaqItem } from "@/lib/content-source";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./tool.css";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const [tool, settings] = await Promise.all([getToolBySlug(resolvedParams.slug), getSiteSettings()]);

  if (!tool) {
    return { title: "Araç bulunamadı" };
  }

  const title = tool.title || `${tool.name} incelemesi`;
  const description = tool.metaDescription || tool.description;
  const publishedTime = toIsoDate(tool.datePublished ?? tool.date);
  const modifiedTime = toIsoDate(tool.dateModified ?? tool.datePublished ?? tool.date);

  return buildMetadata({
    title,
    description,
    path: `/ai/${resolvedParams.slug}`,
    canonicalUrl: tool.canonicalUrl,
    type: "article",
    imagePath: tool.featuredImageUrl ?? tool.logoUrl,
    twitterImagePath: tool.featuredImageUrl ?? tool.logoUrl,
    imageAlt: tool.featuredImageAlt ?? tool.logoAlt ?? title,
    noIndex: tool.noIndex,
    publishedTime,
    modifiedTime,
    authors: tool.author ? [absoluteUrl(`/yazar/${tool.author.slug}`, settings.url)] : undefined,
    section: tool.category,
    baseUrl: settings.url,
    siteName: settings.name,
    locale: settings.locale,
    defaultImagePath: settings.defaultSocialImageUrl || "/opengraph-image",
    defaultTwitterImagePath: settings.defaultSocialImageUrl || "/twitter-image",
  });
}

export default async function ToolReviewPage({ params }: ToolPageProps) {
  const resolvedParams = await params;
  const [tool, settings] = await Promise.all([getToolBySlug(resolvedParams.slug), getSiteSettings()]);

  if (!tool) {
    notFound();
  }

  const pageUrl = tool.canonicalUrl || absoluteUrl(`/ai/${resolvedParams.slug}`, settings.url);
  const pageTitle = tool.h1 || tool.title || `${tool.name} incelemesi`;
  const publishedAt = tool.datePublished ?? tool.date;
  const updatedAt = tool.dateModified ?? tool.datePublished ?? tool.date;
  const mdxSource = tool.body.kind === "mdx" ? tool.body.source ?? null : null;

  const publisherEntity = {
    "@type": "Organization",
    name: settings.name,
    url: settings.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(settings.logoPath, settings.url),
    },
  };

  const authorEntity = tool.author
    ? {
        "@type": "Person",
        name: tool.author.fullName,
        url: absoluteUrl(`/yazar/${tool.author.slug}`, settings.url),
        image: tool.author.avatarUrl ? absoluteUrl(tool.author.avatarUrl, settings.url) : undefined,
        jobTitle: tool.author.role,
        alumniOf: tool.author.university
          ? {
              "@type": "CollegeOrUniversity",
              name: tool.author.university.split(",")[0].trim(),
            }
          : undefined,
        knowsAbout: tool.author.expertise,
      }
    : publisherEntity;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: pageUrl,
    applicationCategory: tool.category || "BusinessApplication",
    operatingSystem: "Web, Windows, macOS, iOS, Android",
    inLanguage: "tr-TR",
    isAccessibleForFree: Boolean(tool.hasFreeTier),
    image:
      tool.featuredImageUrl ||
      tool.logoUrl ||
      settings.defaultSocialImageUrl ||
      absoluteUrl("/opengraph-image", settings.url),
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
    articleSection: tool.category,
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
    image:
      tool.featuredImageUrl ||
      tool.logoUrl ||
      settings.defaultSocialImageUrl ||
      absoluteUrl("/opengraph-image", settings.url),
  };

  const faqSchema =
    tool.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faqs.map((faq: FaqItem) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <div className="container tool-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}

      <Breadcrumbs
        baseUrl={settings.url}
        items={[
          { name: "Ana Sayfa", href: "/" },
          { name: "Yapay zekâ araçları", href: "/ai" },
          { name: tool.name },
        ]}
      />

      <header className="tool-header">
        <div className="tool-header-content">
          <div className="tool-title-row">
            {tool.logoUrl ? (
              <div className="tool-logo-wrap">
                <Image src={tool.logoUrl} alt={tool.logoAlt || `${tool.name} logosu`} width={72} height={72} />
              </div>
            ) : null}
            <div>
              <h1>{pageTitle}</h1>
              {tool.heroIntro ? <p className="tool-vision-description">{tool.heroIntro}</p> : null}
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
                label: "Türkçe Desteği",
                value: tool.isTRSupported ? "Var" : "Yok",
              },
              {
                label: "Yazar",
                value: tool.author?.fullName || "Editör ekibi",
                href: tool.author ? `/yazar/${tool.author.slug}` : undefined,
              },
              {
                label: "Yayımlanma tarihi",
                value: formatDisplayDate(publishedAt) || "Belirtilmedi",
              },
            ]}
          />
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
          />
        </figure>
      ) : null}

      {tool.screenshots.length > 0 ? (
        <section className="tool-screenshot-section">
          <h2>Arayüz görüntüleri</h2>
          <div className="tool-screenshot-grid">
            {tool.screenshots.map((screenshot) => (
              <figure key={screenshot.url} className="tool-screenshot-card">
                <Image
                  src={screenshot.url}
                  alt={screenshot.alt || `${tool.name} ekran görüntüsü`}
                  width={1200}
                  height={675}
                  className="tool-screenshot-image"
                />
                {screenshot.caption ? <figcaption>{screenshot.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="pros-cons-grid">
        <div className="pros-card">
          <h2>Neden öne çıkıyor?</h2>
          <ul>
            {tool.pros.map((pro, idx) => (
              <li key={`pro-${idx}`}>{pro}</li>
            ))}
          </ul>
        </div>
        <div className="cons-card">
          <h2>Nerede sınırlı kalıyor?</h2>
          <ul>
            {tool.cons.map((con, idx) => (
              <li key={`con-${idx}`}>{con}</li>
            ))}
          </ul>
        </div>
      </section>

      <article className="mdx-content">
        {mdxSource ? (
          <MDXRemote source={mdxSource} />
        ) : (
          <PortableTextContent value={tool.body.kind === "portableText" ? tool.body.value : []} />
        )}
      </article>

      {tool.websiteUrl ? (
        <div className="tool-cta-bottom">
          <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="cta-button large">
            {tool.name} resmî sitesine git
          </a>
        </div>
      ) : null}

      {tool.faqs.length > 0 ? (
        <section className="faq-section">
          <h2>Sıkça sorulan sorular</h2>
          <div className="faq-list">
            {tool.faqs.map((faq, idx) => (
              <details key={`faq-${idx}`} className="faq-item">
                <summary>{faq.question}</summary>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
