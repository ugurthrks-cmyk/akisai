import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthorBox from "@/components/AuthorBox";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqSection from "@/components/FaqSection";
import MdxContent from "@/components/MdxContent";
import PortableTextContent from "@/components/PortableTextContent";
import TrustBox from "@/components/TrustBox";
import { absoluteUrl, formatDisplayDate, toIsoDate } from "@/lib/content";
import { getAllComparisons, getComparisonBySlug, getToolBySlug } from "@/lib/content-source";
import { buildMetadata, clampText } from "@/lib/metadata";
import { buildOrganizationEntity } from "@/lib/organization-schema";
import { getSiteSettings } from "@/lib/site-settings";
import "./comparison.css";
import "../../rehber/[slug]/workflow.css";

type ComparisonPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const comparisons = await getAllComparisons();
  return comparisons.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({ params }: ComparisonPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const [comparison, settings] = await Promise.all([
    getComparisonBySlug(resolvedParams.slug),
    getSiteSettings(),
  ]);
  const socialImagePath = `/karsilastirma/${resolvedParams.slug}/opengraph-image`;
  const socialTwitterImagePath = `/karsilastirma/${resolvedParams.slug}/twitter-image`;

  if (!comparison) {
    return { title: "Karşılaştırma bulunamadı" };
  }

  const publishedTime = toIsoDate(comparison.datePublished ?? comparison.date);
  const modifiedTime = toIsoDate(
    comparison.dateModified ?? comparison.updatedAt ?? comparison.datePublished ?? comparison.date,
  );

  const metadata = buildMetadata({
    title: comparison.seoTitle || comparison.title,
    description: comparison.metaDescription || comparison.description,
    path: `/karsilastirma/${resolvedParams.slug}`,
    canonicalUrl: comparison.canonicalUrl,
    openGraphTitle: comparison.openGraphTitle,
    openGraphDescription: comparison.openGraphDescription,
    type: "article",
    imagePath: comparison.featuredImageUrl || socialImagePath,
    twitterImagePath: comparison.featuredImageUrl || socialTwitterImagePath,
    imageAlt: comparison.featuredImageAlt ?? comparison.title,
    noIndex: comparison.noIndex,
    publishedTime,
    modifiedTime,
    authors: comparison.author ? [absoluteUrl(`/yazar/${comparison.author.slug}`, settings.url)] : undefined,
    metadataAuthors: comparison.author
      ? [{ name: comparison.author.fullName, url: absoluteUrl(`/yazar/${comparison.author.slug}`, settings.url) }]
      : [{ name: settings.name, url: settings.url }],
    creator: comparison.author?.fullName || settings.name,
    publisher: settings.name,
    section: comparison.category || "Araç karşılaştırması",
    baseUrl: settings.url,
    siteName: settings.name,
    locale: settings.locale,
    defaultImagePath: settings.defaultSocialImageUrl || "/opengraph-image",
    defaultTwitterImagePath: settings.defaultSocialImageUrl || "/twitter-image",
    extraOther: {
      "last-verified": comparison.lastVerified,
    },
  });
  return metadata;
}

export default async function ComparisonDetailPage({ params }: ComparisonPageProps) {
  const resolvedParams = await params;
  const [comparison, settings] = await Promise.all([
    getComparisonBySlug(resolvedParams.slug),
    getSiteSettings(),
  ]);

  if (!comparison) {
    notFound();
  }

  const comparedTools = (
    await Promise.all((comparison.comparedToolSlugs ?? []).map((toolSlug) => getToolBySlug(toolSlug)))
  ).filter((tool): tool is NonNullable<typeof tool> => tool !== null);

  const displayToolNames = comparison.comparedToolNames ?? [];
  const pageUrl = comparison.canonicalUrl || absoluteUrl(`/karsilastirma/${resolvedParams.slug}`, settings.url);
  const pageTitle = comparison.h1 || comparison.title;
  const publishedAt = comparison.datePublished ?? comparison.date;
  const updatedAt = comparison.dateModified ?? comparison.updatedAt ?? comparison.datePublished ?? comparison.date;
  const publishedTimestamp = publishedAt ? new Date(publishedAt).getTime() : Number.NaN;
  const updatedTimestamp = updatedAt ? new Date(updatedAt).getTime() : Number.NaN;
  const showUpdatedDate =
    Number.isFinite(publishedTimestamp) && Number.isFinite(updatedTimestamp)
      ? updatedTimestamp > publishedTimestamp
      : Boolean(updatedAt && publishedAt && updatedAt !== publishedAt);
  const socialImageUrl = absoluteUrl(`/karsilastirma/${resolvedParams.slug}/opengraph-image`, settings.url);
  const mdxSource = comparison.body.kind === "mdx" ? comparison.body.source ?? null : null;
  const findMatchedTool = (name: string) =>
    comparedTools.find((tool) => tool.name.trim().toLocaleLowerCase("tr-TR") === name.trim().toLocaleLowerCase("tr-TR"));

  const publisherEntity = buildOrganizationEntity(settings);

  const authorCredentialsList = comparison.author?.credentials ?? [];
  const authorCredentials =
    authorCredentialsList.length > 0
      ? authorCredentialsList.map((credential) => ({
          "@type": "EducationalOccupationalCredential",
          name: credential,
        }))
      : undefined;

  const authorEntity = comparison.author
    ? {
        "@type": "Person",
        name: comparison.author.fullName,
        url: absoluteUrl(`/yazar/${comparison.author.slug}`, settings.url),
        image: comparison.author.avatarUrl ? absoluteUrl(comparison.author.avatarUrl, settings.url) : undefined,
        jobTitle: comparison.author.role,
        description: comparison.author.bio,
        sameAs:
          comparison.author.sameAs.length > 0
            ? comparison.author.sameAs
            : [absoluteUrl(`/yazar/${comparison.author.slug}`, settings.url)],
        alumniOf: comparison.author.university
          ? {
              "@type": "CollegeOrUniversity",
              name: comparison.author.university.split(",")[0].trim(),
            }
          : undefined,
        knowsAbout: comparison.author.expertise,
        ...(authorCredentials ? { hasCredential: authorCredentials } : {}),
      }
    : publisherEntity;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: clampText(pageTitle, 110),
    description: comparison.description,
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    inLanguage: "tr-TR",
    datePublished: toIsoDate(publishedAt),
    dateModified: toIsoDate(updatedAt),
    author: authorEntity,
    publisher: publisherEntity,
    articleSection: comparison.category || "Araç karşılaştırması",
    about: displayToolNames.map((name) => {
      const matchedTool = findMatchedTool(name);

      return {
        "@type": "SoftwareApplication",
        name,
        ...(matchedTool
          ? { url: matchedTool.canonicalUrl || absoluteUrl(`/incelemeler/${matchedTool.slug}`, settings.url) }
          : {}),
      };
    }),
    image: comparison.featuredImageUrl || socialImageUrl,
    ...(comparedTools.length > 0
      ? {
          relatedLink: comparedTools.map(
            (tool) => tool.canonicalUrl || absoluteUrl(`/incelemeler/${tool.slug}`, settings.url),
          ),
        }
      : {}),
    ...(comparison.sources && comparison.sources.length > 0
      ? {
          citation: comparison.sources.map((source) => ({
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

  const itemListSchema =
    displayToolNames.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${pageTitle} karşılaştırılan araçlar`,
          inLanguage: "tr-TR",
          itemListOrder: "https://schema.org/ItemListUnordered",
          numberOfItems: displayToolNames.length,
          itemListElement: displayToolNames.map((name, index) => {
            const matchedTool = findMatchedTool(name);

            return {
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "SoftwareApplication",
                name,
                ...(matchedTool
                  ? {
                      url: matchedTool.canonicalUrl || absoluteUrl(`/incelemeler/${matchedTool.slug}`, settings.url),
                      applicationCategory: matchedTool.category,
                    }
                  : {}),
              },
            };
          }),
        }
      : null;

  return (
    <div className="container comparison-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {itemListSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      ) : null}

      <Breadcrumbs
        baseUrl={settings.url}
        items={[
          { name: "Ana Sayfa", href: "/" },
          { name: "Karşılaştırmalar", href: "/karsilastirma" },
          { name: pageTitle },
        ]}
      />

      <header className="comparison-header">
        <h1>{pageTitle}</h1>
        {comparison.heroIntro ? <p className="comparison-hero-intro">{comparison.heroIntro}</p> : null}

        <div className="comparison-tag-row">
          {comparison.category ? <span className="comparison-tag">{comparison.category}</span> : null}
          {displayToolNames.length > 0 ? <span className="comparison-tag tools">{displayToolNames.join(" vs ")}</span> : null}
        </div>

        <TrustBox
          items={[
            {
              label: "Yazar",
              value: comparison.author?.fullName || "Editör ekibi",
              href: comparison.author ? `/yazar/${comparison.author.slug}` : undefined,
            },
            {
              label: "Yayınlanma tarihi",
              value: formatDisplayDate(publishedAt) || "Belirtilmedi",
            },
            {
              label: "Son güncelleme",
              value: showUpdatedDate ? (formatDisplayDate(updatedAt) ?? "") : "",
            },
          ]}
        />
      </header>

      <article className="mdx-content reading-surface" style={{ marginTop: "1.35rem" }}>
        {mdxSource ? (
          <MdxContent source={mdxSource} />
        ) : (
          <PortableTextContent value={comparison.body.kind === "portableText" ? comparison.body.value : []} />
        )}
      </article>

      <TrustBox
        sources={comparison.sources}
        lastVerified={comparison.lastVerified}
        verificationNotes={comparison.verificationNotes}
      />

      <AuthorBox author={comparison.author} />

      {comparedTools.length > 0 ? (
        <section className="comparison-tools-section">
          <h2>Karşılaştırılan Araçların İncelemeleri</h2>
          <p>Bu karar metnini daha derin okumak isterseniz ilgili inceleme sayfalarına geçerek detaylara bakabilirsiniz.</p>
          <div className="comparison-tools-grid guide-grid">
            {comparedTools.map((tool) => (
              <Link href={`/incelemeler/${tool.slug}`} key={tool.slug} className="glass-card guide-card">
                <div className="tool-header">
                  <div>
                    <div className="card-eyebrow">Araç İncelemesi</div>
                    <h3>{tool.h1 || tool.title || tool.name}</h3>
                  </div>
                </div>
                <p className="tool-desc">{tool.description}</p>
                <div className="tool-pills">
                  {tool.category ? <span className="tool-pill">{tool.category}</span> : null}
                  {tool.hasFreeTier ? <span className="tool-pill">Ücretsiz Başlangıç</span> : null}
                </div>
                <span className="guide-card-cta">İncelemeye Git</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <FaqSection faqs={comparison.faqs} />
    </div>
  );
}
