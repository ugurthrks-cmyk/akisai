import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthorBox from "@/components/AuthorBox";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentSignalGrid from "@/components/ContentSignalGrid";
import FaqSection from "@/components/FaqSection";
import MdxContent from "@/components/MdxContent";
import PortableTextContent from "@/components/PortableTextContent";
import { absoluteUrl, formatDisplayDate, toIsoDate } from "@/lib/content";
import { getAllGuides, getGuideBySlug, getToolBySlug } from "@/lib/content-source";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./workflow.css";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

type HowToStepItem = {
  name: string;
  text?: string;
};

const nonStepHeadingMatchers = [
  /\bnedir\b/i,
  /\bbaşlamadan önce\b/i,
  /\bsık yapılan hatalar\b/i,
  /\beditör notu\b/i,
  /\bipuçları\b/i,
  /\bözet\b/i,
  /\bsss\b/i,
  /\bfaq\b/i,
  /\bkarşılaştırma\b/i,
  /\bgüçlü yönler\b/i,
  /\bsınırlı kaldığı noktalar\b/i,
  /\bkimler için uygun\b/i,
  /\bkimler için uygun değil\b/i,
  /\btrigger ve action\b/i,
  /\börnek zap\b/i,
];

function stripInlineMarkdown(input: string) {
  return input
    .replace(/\[(.+?)\]\((.+?)\)/g, "$1")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/[`*_>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMarkdownSteps(source: string): HowToStepItem[] {
  const lines = source.split(/\r?\n/);
  const steps: HowToStepItem[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    const match = line.match(/^##\s+(.+)/);
    if (!match) {
      continue;
    }

    const name = stripInlineMarkdown(match[1]);
    if (!name || nonStepHeadingMatchers.some((pattern) => pattern.test(name))) {
      continue;
    }

    let text: string | undefined;

    for (let j = i + 1; j < lines.length; j += 1) {
      const nextLine = lines[j].trim();
      if (!nextLine) {
        continue;
      }
      if (nextLine.startsWith("#")) {
        break;
      }

      text = stripInlineMarkdown(nextLine.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, ""));
      break;
    }

    steps.push({ name, text });
  }

  if (steps.length > 0) {
    return steps;
  }

  const listSteps: HowToStepItem[] = [];
  for (const line of lines) {
    const match = line.match(/^\s*\d+\.\s+(.+)/);
    if (match) {
      const name = stripInlineMarkdown(match[1]);
      if (name) {
        listSteps.push({ name });
      }
    }
  }

  return listSteps;
}

function getPortableTextBlockText(block: PortableTextBlock) {
  const text =
    block.children
      ?.map((child) => ("text" in child && typeof child.text === "string" ? child.text : ""))
      .join("") ?? "";
  return stripInlineMarkdown(text);
}

function extractPortableTextSteps(value: PortableTextBlock[]): HowToStepItem[] {
  const steps: HowToStepItem[] = [];

  for (let i = 0; i < value.length; i += 1) {
    const block = value[i] as PortableTextBlock & { style?: string; listItem?: string };
    if (block?._type !== "block" || (block.style !== "h2" && block.style !== "h3")) {
      continue;
    }

    const name = getPortableTextBlockText(block);
    if (!name || nonStepHeadingMatchers.some((pattern) => pattern.test(name))) {
      continue;
    }

    let text: string | undefined;
    for (let j = i + 1; j < value.length; j += 1) {
      const nextBlock = value[j] as PortableTextBlock & { style?: string; listItem?: string };
      if (nextBlock?._type === "block" && (nextBlock.style === "h2" || nextBlock.style === "h3")) {
        break;
      }

      if (nextBlock?._type === "block" && (!nextBlock.style || nextBlock.style === "normal")) {
        const candidate = getPortableTextBlockText(nextBlock);
        if (candidate) {
          text = candidate;
          break;
        }
      }
    }

    steps.push({ name, text });
  }

  if (steps.length > 0) {
    return steps;
  }

  const listSteps: HowToStepItem[] = [];
  for (const item of value) {
    const block = item as PortableTextBlock & { style?: string; listItem?: string };
    if (block?._type === "block" && block.listItem === "number") {
      const name = getPortableTextBlockText(block);
      if (name) {
        listSteps.push({ name });
      }
    }
  }

  return listSteps;
}

function getHowToSteps(body: { kind: "mdx" | "portableText"; source?: string; value?: PortableTextBlock[] }) {
  if (body.kind === "mdx" && body.source) {
    return extractMarkdownSteps(body.source);
  }

  if (body.kind === "portableText" && Array.isArray(body.value)) {
    return extractPortableTextSteps(body.value);
  }

  return [];
}

export async function generateStaticParams() {
  const guides = await getAllGuides();
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const [guide, settings] = await Promise.all([getGuideBySlug(resolvedParams.slug), getSiteSettings()]);

  if (!guide) {
    return { title: "Rehber bulunamadı" };
  }

  const publishedTime = toIsoDate(guide.datePublished ?? guide.date);
  const modifiedTime = toIsoDate(guide.dateModified ?? guide.updatedAt ?? guide.datePublished ?? guide.date);

  const metadata = buildMetadata({
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
    metadataAuthors: guide.author
      ? [{ name: guide.author.fullName, url: absoluteUrl(`/yazar/${guide.author.slug}`, settings.url) }]
      : [{ name: settings.name, url: settings.url }],
    creator: guide.author?.fullName || settings.name,
    publisher: settings.name,
    section: guide.category || "Nasıl kullanılır rehberi",
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

export default async function GuidePage({ params }: GuidePageProps) {
  const resolvedParams = await params;
  const [guide, settings] = await Promise.all([getGuideBySlug(resolvedParams.slug), getSiteSettings()]);

  if (!guide) {
    notFound();
  }

  const relatedToolSlug = guide.relatedToolSlugs?.[0];
  const fallbackToolSlug = guide.slug.endsWith("-nasil-kullanilir")
    ? guide.slug.replace("-nasil-kullanilir", "")
    : null;
  const resolvedToolSlug = relatedToolSlug || fallbackToolSlug;
  const relatedTool = resolvedToolSlug ? await getToolBySlug(resolvedToolSlug) : null;

  const pageUrl = guide.canonicalUrl || absoluteUrl(`/rehber/${resolvedParams.slug}`, settings.url);
  const pageTitle = guide.h1 || guide.title;
  const publishedAt = guide.datePublished ?? guide.date;
  const updatedAt = guide.dateModified ?? guide.updatedAt ?? guide.datePublished ?? guide.date;
  const mdxSource = guide.body.kind === "mdx" ? guide.body.source ?? null : null;
  const relatedToolUrl = relatedTool
    ? relatedTool.canonicalUrl || absoluteUrl(`/incelemeler/${relatedTool.slug}`, settings.url)
    : null;

  const publisherEntity = {
    "@type": "Organization",
    name: settings.name,
    url: settings.url,
    sameAs: settings.socialProfiles,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(settings.logoPath, settings.url),
    },
  };

  const authorCredentialsList = guide.author?.credentials ?? [];
  const authorCredentials =
    authorCredentialsList.length > 0
      ? authorCredentialsList.map((credential) => ({
          "@type": "EducationalOccupationalCredential",
          name: credential,
        }))
      : undefined;

  const authorEntity = guide.author
    ? {
        "@type": "Person",
        name: guide.author.fullName,
        url: absoluteUrl(`/yazar/${guide.author.slug}`, settings.url),
        image: guide.author.avatarUrl ? absoluteUrl(guide.author.avatarUrl, settings.url) : undefined,
        jobTitle: guide.author.role,
        description: guide.author.bio,
        sameAs:
          guide.author.sameAs.length > 0
            ? guide.author.sameAs
            : [absoluteUrl(`/yazar/${guide.author.slug}`, settings.url)],
        alumniOf: guide.author.university
          ? {
              "@type": "CollegeOrUniversity",
              name: guide.author.university.split(",")[0].trim(),
          }
        : undefined,
        knowsAbout: guide.author.expertise,
        ...(authorCredentials ? { hasCredential: authorCredentials } : {}),
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
    articleSection: guide.category || "Nasıl kullanılır rehberi",
    about: guide.tools.length > 0 ? guide.tools.map((tool) => ({ "@type": "SoftwareApplication", name: tool })) : undefined,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".workflow-header h1", ".workflow-description"],
    },
    image:
      guide.featuredImageUrl ||
      settings.defaultSocialImageUrl ||
      absoluteUrl("/opengraph-image", settings.url),
    ...(relatedToolUrl ? { relatedLink: relatedToolUrl } : {}),
    ...(guide.sources && guide.sources.length > 0
      ? {
          citation: guide.sources.map((source) => ({
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

  const howToSteps = getHowToSteps(guide.body);
  const howToSchema =
    howToSteps.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: pageTitle,
          description: guide.description,
          inLanguage: "tr-TR",
          datePublished: toIsoDate(publishedAt),
          dateModified: toIsoDate(updatedAt),
          ...(guide.estimatedTimeMinutes ? { totalTime: `PT${guide.estimatedTimeMinutes}M` } : {}),
          step: howToSteps.map((step, index) => ({
            "@type": "HowToStep",
            name: step.name,
            ...(step.text ? { text: step.text } : {}),
            position: index + 1,
          })),
          image:
            guide.featuredImageUrl ||
            settings.defaultSocialImageUrl ||
            absoluteUrl("/opengraph-image", settings.url),
          ...(relatedToolUrl ? { relatedLink: relatedToolUrl } : {}),
          ...(guide.sources && guide.sources.length > 0
            ? {
                citation: guide.sources.map((source) => ({
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
        }
      : null;

  return (
    <div className="container workflow-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {howToSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      ) : null}

      <Breadcrumbs
        baseUrl={settings.url}
        items={[
          { name: "Ana Sayfa", href: "/" },
          { name: "Nasıl Kullanılır", href: "/rehber" },
          { name: guide.name || guide.title },
        ]}
      />

      <header className="workflow-header">
        <h1>{pageTitle}</h1>
        {guide.heroIntro ? <p className="workflow-description">{guide.heroIntro}</p> : null}

        <ContentSignalGrid
          items={[
            { label: "Kategori", value: guide.category || "Belirtilmedi" },
            { label: "Zorluk", value: guide.difficulty || "Belirtilmedi" },
            { label: "Süre", value: guide.time || "Belirtilmedi" },
            {
              label: "Yazar",
              value: guide.author?.fullName || "Editör ekibi",
              href: guide.author ? `/yazar/${guide.author.slug}` : undefined,
            },
            {
              label: "Son güncelleme",
              value: formatDisplayDate(updatedAt) || "Belirtilmedi",
            },
          ]}
        />
      </header>

      <article className="mdx-content reading-surface" style={{ marginTop: "1.35rem" }}>
        {mdxSource ? (
          <MdxContent source={mdxSource} />
        ) : (
          <PortableTextContent value={guide.body.kind === "portableText" ? guide.body.value : []} />
        )}
      </article>

      <AuthorBox author={guide.author} />

      {relatedTool ? (
        <section className="related-link-panel">
          <div className="related-link-copy">
            <span className="related-link-kicker">Bu Aracı İncele</span>
            <h2>{relatedTool.h1 || relatedTool.title || relatedTool.name}</h2>
            <p>{relatedTool.description}</p>
          </div>
          <Link href={`/incelemeler/${relatedTool.slug}`} className="related-link-cta">
            İncelemeye git
          </Link>
        </section>
      ) : null}

      <FaqSection faqs={guide.faqs} />
    </div>
  );
}
