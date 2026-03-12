import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentSignalGrid from "@/components/ContentSignalGrid";
import PortableTextContent from "@/components/PortableTextContent";
import { absoluteUrl, formatDisplayDate, toIsoDate } from "@/lib/content";
import { getAllGuides, getGuideBySlug, type FaqItem } from "@/lib/content-source";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./workflow.css";

type WorkflowPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const guides = await getAllGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: WorkflowPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const [guide, settings] = await Promise.all([getGuideBySlug(resolvedParams.slug), getSiteSettings()]);

  if (!guide) {
    return { title: "Rehber bulunamadı" };
  }

  const publishedTime = toIsoDate(guide.datePublished ?? guide.date);
  const modifiedTime = toIsoDate(guide.dateModified ?? guide.datePublished ?? guide.date);

  return buildMetadata({
    title: guide.title,
    description: guide.metaDescription || guide.description,
    path: `/rehber/${resolvedParams.slug}`,
    canonicalUrl: guide.canonicalUrl,
    type: "article",
    imagePath: guide.featuredImageUrl,
    twitterImagePath: guide.featuredImageUrl,
    imageAlt: guide.featuredImageAlt ?? guide.title,
    noIndex: guide.noIndex,
    publishedTime,
    modifiedTime,
    authors: guide.author ? [absoluteUrl(`/yazar/${guide.author.slug}`, settings.url)] : undefined,
    section: "Rehber",
    baseUrl: settings.url,
    siteName: settings.name,
    locale: settings.locale,
    defaultImagePath: settings.defaultSocialImageUrl || "/opengraph-image",
    defaultTwitterImagePath: settings.defaultSocialImageUrl || "/twitter-image",
  });
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const resolvedParams = await params;
  const [guide, settings] = await Promise.all([getGuideBySlug(resolvedParams.slug), getSiteSettings()]);

  if (!guide) {
    notFound();
  }

  const pageUrl = guide.canonicalUrl || absoluteUrl(`/rehber/${resolvedParams.slug}`, settings.url);
  const pageTitle = guide.h1 || guide.title;
  const publishedAt = guide.datePublished ?? guide.date;
  const updatedAt = guide.dateModified ?? guide.datePublished ?? guide.date;
  const mdxSource = guide.body.kind === "mdx" ? guide.body.source ?? null : null;

  const publisherEntity = {
    "@type": "Organization",
    name: settings.name,
    url: settings.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(settings.logoPath, settings.url),
    },
  };

  const authorEntity = guide.author
    ? {
        "@type": "Person",
        name: guide.author.fullName,
        url: absoluteUrl(`/yazar/${guide.author.slug}`, settings.url),
        image: guide.author.avatarUrl ? absoluteUrl(guide.author.avatarUrl, settings.url) : undefined,
        jobTitle: guide.author.role,
        alumniOf: guide.author.university
          ? {
              "@type": "CollegeOrUniversity",
              name: guide.author.university.split(",")[0].trim(),
            }
          : undefined,
        knowsAbout: guide.author.expertise,
      }
    : publisherEntity;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: guide.description,
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    inLanguage: "tr-TR",
    datePublished: toIsoDate(publishedAt),
    dateModified: toIsoDate(updatedAt),
    author: authorEntity,
    publisher: publisherEntity,
    articleSection: "Rehber",
    image:
      guide.featuredImageUrl ||
      settings.defaultSocialImageUrl ||
      absoluteUrl("/opengraph-image", settings.url),
  };

  const faqSchema =
    guide.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((faq: FaqItem) => ({
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
    <div className="container workflow-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}

      <Breadcrumbs
        baseUrl={settings.url}
        items={[
          { name: "Ana Sayfa", href: "/" },
          { name: "Rehberler", href: "/rehber" },
          { name: guide.name || guide.title },
        ]}
      />

      <header className="workflow-header">
        <h1>{pageTitle}</h1>
        {guide.heroIntro ? <p className="workflow-description">{guide.heroIntro}</p> : null}

        <ContentSignalGrid
          items={[
            { label: "Zorluk", value: guide.difficulty || "Belirtilmedi" },
            { label: "Süre", value: guide.time || "Belirtilmedi" },
            {
              label: "Yazar",
              value: guide.author?.fullName || "Editör ekibi",
              href: guide.author ? `/yazar/${guide.author.slug}` : undefined,
            },
            {
              label: "Yayımlanma tarihi",
              value: formatDisplayDate(publishedAt) || "Belirtilmedi",
            },
          ]}
        />
      </header>

      <article className="mdx-content" style={{ marginTop: "3rem" }}>
        {mdxSource ? (
          <MDXRemote source={mdxSource} />
        ) : (
          <PortableTextContent value={guide.body.kind === "portableText" ? guide.body.value : []} />
        )}
      </article>

      {guide.faqs.length > 0 ? (
        <section className="faq-section">
          <h2>Sıkça sorulan sorular</h2>
          <div className="faq-list">
            {guide.faqs.map((faq, idx) => (
              <details key={`workflow-faq-${idx}`} className="faq-item">
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
