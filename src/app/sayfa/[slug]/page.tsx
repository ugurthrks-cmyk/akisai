import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PortableTextContent from "@/components/PortableTextContent";
import { absoluteUrl } from "@/lib/content";
import { getAllPages, getPageBySlug } from "@/lib/content-source";
import { buildSiteMetadata } from "@/lib/metadata";
import { getManagedPagePath, isManagedRootPageSlug } from "@/lib/managed-pages";
import { getSiteSettings } from "@/lib/site-settings";

type CmsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages
    .filter((page) => !isManagedRootPageSlug(page.slug))
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const page = await getPageBySlug(resolvedParams.slug);

  if (!page) {
    return { title: "Sayfa bulunamadı" };
  }

  return buildSiteMetadata({
    title: page.title,
    description: page.metaDescription || page.description,
    path: getManagedPagePath(resolvedParams.slug),
    canonicalUrl: page.canonicalUrl,
    noIndex: page.noIndex,
  });
}

export default async function CmsPage({ params }: CmsPageProps) {
  const resolvedParams = await params;

  if (isManagedRootPageSlug(resolvedParams.slug)) {
    redirect(getManagedPagePath(resolvedParams.slug));
  }

  const [page, settings] = await Promise.all([getPageBySlug(resolvedParams.slug), getSiteSettings()]);

  if (!page) {
    notFound();
  }

  const pageUrl = page.canonicalUrl || absoluteUrl(getManagedPagePath(resolvedParams.slug), settings.url);
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: pageUrl,
  };

  return (
    <div className="container" style={{ maxWidth: 880, margin: "0 auto", paddingTop: "2rem", paddingBottom: "4rem" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumbs
        baseUrl={settings.url}
        items={[
          { name: "Ana Sayfa", href: "/" },
          { name: "Sayfalar", href: "/sayfa" },
          { name: page.title },
        ]}
      />

      <header style={{ marginBottom: "2rem" }}>
        {page.pageType ? (
          <div style={{ marginBottom: "0.75rem", color: "#93c5fd", fontSize: "0.82rem", textTransform: "uppercase" }}>
            {page.pageType}
          </div>
        ) : null}
        <h1 style={{ marginBottom: "0.75rem" }}>{page.title}</h1>
        <p style={{ margin: 0, color: "var(--text-muted)", lineHeight: 1.7 }}>{page.description}</p>
      </header>

      <article className="mdx-content">
        <PortableTextContent value={page.body.kind === "portableText" ? page.body.value : []} />
      </article>
    </div>
  );
}
