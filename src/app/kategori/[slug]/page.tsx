import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import ContentSignalGrid from "@/components/ContentSignalGrid";
import PortableTextContent from "@/components/PortableTextContent";
import { getAllCategories, getCategoryBySlug, getToolsByCategorySlug } from "@/lib/content-source";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./category.css";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const [category, settings] = await Promise.all([
    getCategoryBySlug(resolvedParams.slug),
    getSiteSettings(),
  ]);

  if (!category) {
    return { title: "Kategori bulunamadı" };
  }

  return buildMetadata({
    title: `En iyi ${category.name} araçları`,
    description: (category.metaDescription || category.description).substring(0, 155),
    path: `/kategori/${resolvedParams.slug}`,
    canonicalUrl: category.canonicalUrl,
    imagePath: category.iconUrl,
    twitterImagePath: category.iconUrl,
    imageAlt: category.iconAlt || `${category.name} kategori ikonu`,
    noIndex: category.noIndex,
    baseUrl: settings.url,
    siteName: settings.name,
    locale: settings.locale,
    defaultImagePath: settings.defaultSocialImageUrl || "/opengraph-image",
    defaultTwitterImagePath: settings.defaultSocialImageUrl || "/twitter-image",
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const [category, categoryTools, settings] = await Promise.all([
    getCategoryBySlug(resolvedParams.slug),
    getToolsByCategorySlug(resolvedParams.slug),
    getSiteSettings(),
  ]);

  if (!category) {
    notFound();
  }

  const mdxSource = category.body.kind === "mdx" ? category.body.source ?? null : null;
  const pageUrl = category.canonicalUrl || `${settings.url}/kategori/${resolvedParams.slug}`;
  const freeTierCount = categoryTools.filter((tool) => tool.hasFreeTier).length;
  const trSupportCount = categoryTools.filter((tool) => tool.isTRSupported).length;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `En iyi ${category.name} araçları`,
    description: category.description,
    url: pageUrl,
  };

  return (
    <div className="container category-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <header className="category-header">
        {category.iconUrl ? (
          <div className="category-icon-wrap">
            <Image src={category.iconUrl} alt={category.iconAlt || `${category.name} ikonu`} width={72} height={72} />
          </div>
        ) : null}
        <h1 className="category-title">{category.name} uygulamaları</h1>
        {category.heroIntro || category.description ? (
          <p className="category-description">{category.heroIntro || category.description}</p>
        ) : null}

        <ContentSignalGrid
          items={[
            { label: "Kategori", value: category.name },
            { label: "İnceleme sayısı", value: String(categoryTools.length) },
            { label: "Türkçe destekli araç", value: String(trSupportCount) },
            { label: "Ücretsiz planlı araç", value: String(freeTierCount) },
          ]}
        />
      </header>

      <section className="category-tools-section">
        <div className="category-tools-grid">
          {categoryTools.map((tool) => (
            <Link href={`/ai/${tool.slug}`} key={tool.slug} className="category-tool-card">
              <div className="tool-card-content">
                <div className="tool-card-header">
                  <div className="tool-card-title-wrap">
                    {tool.logoUrl ? (
                      <Image
                        src={tool.logoUrl}
                        alt={tool.logoAlt || `${tool.name} logosu`}
                        width={44}
                        height={44}
                        className="tool-card-logo"
                      />
                    ) : null}
                    <h3 className="tool-card-title">{tool.name}</h3>
                  </div>
                  {tool.isTRSupported ? <span className="tag success small">Türkçe</span> : null}
                </div>
                <p className="tool-card-desc">{tool.description.substring(0, 100)}...</p>
                <div className="tool-card-footer">
                  <span className="tool-price">{tool.pricing || "Detaylı inceleme"}</span>
                  <span className="view-link">İncele →</span>
                </div>
              </div>
            </Link>
          ))}
          {categoryTools.length === 0 ? (
            <p className="empty-state">Bu kategoride henüz araç incelemesi bulunmuyor.</p>
          ) : null}
        </div>
      </section>

      <article className="category-mdx-content mdx-content">
        {mdxSource ? (
          <MDXRemote source={mdxSource} />
        ) : (
          <PortableTextContent value={category.body.kind === "portableText" ? category.body.value : []} />
        )}
      </article>
    </div>
  );
}
