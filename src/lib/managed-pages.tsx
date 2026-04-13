import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortableTextContent from "@/components/PortableTextContent";
import { toIsoDate } from "@/lib/content";
import { getPageBySlug } from "@/lib/content-source";
import { buildSiteMetadata } from "@/lib/metadata";

export function getManagedPagePath(slug: string) {
  return `/${slug}`;
}

export function getPageTypeLabel(pageType?: string) {
  switch (pageType) {
    case "corporate":
      return "Kurumsal sayfa";
    case "landing":
      return "Açılış sayfası";
    case "editorial":
      return "Editoryal sayfa";
    default:
      return pageType;
  }
}

export async function getManagedPageMetadata(slug: string): Promise<Metadata> {
  const page = await getPageBySlug(slug);

  if (!page) {
    return { title: "Sayfa bulunamadı" };
  }

  return buildSiteMetadata({
    title: page.title,
    description: page.metaDescription || page.description,
    path: getManagedPagePath(slug),
    canonicalUrl: page.canonicalUrl,
    noIndex: page.noIndex,
    modifiedTime: toIsoDate(page.updatedAt),
  });
}

export async function ManagedPageArticle({
  slug,
  contentClassName = "corporate-content",
}: {
  slug: string;
  contentClassName?: string;
}) {
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <article className="corporate-page-container">
      <header className="corporate-header">
        {page.pageType ? (
          <p className="corporate-kicker">{getPageTypeLabel(page.pageType)}</p>
        ) : null}
        <h1>{page.title}</h1>
        <p className="corporate-lead">{page.description}</p>
      </header>

      <div className={contentClassName}>
        <PortableTextContent
          value={page.body.kind === "portableText" ? page.body.value : []}
        />
      </div>
    </article>
  );
}
