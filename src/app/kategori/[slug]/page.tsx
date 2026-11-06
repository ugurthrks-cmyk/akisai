import { serializeJsonLd } from "@/lib/json-ld";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import MdxContent from "@/components/MdxContent";
import PortableTextContent from "@/components/PortableTextContent";
import { absoluteUrl, toIsoDate } from "@/lib/content";
import {
  getAllCategories,
  getAllGuides,
  getCategoryBySlug,
  getToolsByCategorySlug,
} from "@/lib/content-source";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./category.css";

export const revalidate = 86400;

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
  const [category, categoryTools, settings] = await Promise.all([
    getCategoryBySlug(resolvedParams.slug),
    getToolsByCategorySlug(resolvedParams.slug),
    getSiteSettings(),
  ]);

  if (!category) {
    return { title: "Kategori bulunamadı" };
  }

  return buildMetadata({
    title: category.seoTitle || `${category.name} | ${settings.name}`,
    description: category.metaDescription || category.description,
    path: `/kategori/${resolvedParams.slug}`,
    canonicalUrl: category.canonicalUrl,
    imagePath: category.iconUrl,
    twitterImagePath: category.iconUrl,
    imageAlt: category.iconAlt || `${category.name} kategori ikonu`,
    noIndex: category.noIndex || categoryTools.length === 0,
    modifiedTime: toIsoDate(category.updatedAt),
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

  const [category, categoryTools, allGuides, settings] = await Promise.all([
    getCategoryBySlug(resolvedParams.slug),
    getToolsByCategorySlug(resolvedParams.slug),
    getAllGuides(),
    getSiteSettings(),
  ]);

  if (!category) {
    notFound();
  }

  const mdxSource =
    category.body.kind === "mdx" ? category.body.source ?? null : null;
  const pageUrl =
    category.canonicalUrl ||
    absoluteUrl(`/kategori/${resolvedParams.slug}`, settings.url);
  const relatedGuides = allGuides.filter(
    (guide) => guide.categorySlug === resolvedParams.slug,
  );
  const contentParts = [
    ...categoryTools.map((tool) => ({
      "@type": "Article",
      name: tool.h1 || tool.title || tool.name,
      url: absoluteUrl(`/incelemeler/${tool.slug}`, settings.url),
      inLanguage: "tr-TR",
    })),
    ...relatedGuides.map((guide) => ({
      "@type": "Article",
      name: guide.h1 || guide.title,
      url: absoluteUrl(`/rehber/${guide.slug}`, settings.url),
      inLanguage: "tr-TR",
    })),
  ];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.h1 || `${category.name} | ${settings.name}`,
    description: category.metaDescription || category.description,
    url: pageUrl,
    inLanguage: "tr-TR",
    dateModified: toIsoDate(category.updatedAt),
    isPartOf: {
      "@type": "WebSite",
      name: settings.name,
      url: settings.url,
      inLanguage: "tr-TR",
    },
    hasPart:
      contentParts.length > 0
        ? contentParts
        : [
            {
              "@type": "WebPageElement",
              name: `${category.name} kategori özeti`,
            },
            {
              "@type": "WebPageElement",
              name: `${category.name} seçim ölçütleri`,
            },
          ],
  };

  return (
    <div className="container category-container">
      <Breadcrumbs
        baseUrl={settings.url}
        items={[
          { name: "Ana Sayfa", href: "/" },
          { name: "Kategoriler", href: "/kategori" },
          { name: category.name },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionSchema) }}
      />

      <header className="category-header">
        {category.iconUrl ? (
          <div className="category-icon-wrap">
            <Image
              src={category.iconUrl}
              alt={category.iconAlt || `${category.name} kategori ikonu`}
              width={72}
              height={72}
              sizes="72px"
              priority
            />
          </div>
        ) : null}
        <h1 className="category-title">{category.h1 || category.name}</h1>
        {category.heroIntro || category.description ? (
          <p className="category-description">
            {category.heroIntro || category.description}
          </p>
        ) : null}
      </header>

      <section className="category-tools-section">
        <h2 className="sr-only">Bu kategorideki araçlar</h2>
        <div className="category-tools-grid">
          {categoryTools.map((tool) => (
            <Link
              href={`/incelemeler/${tool.slug}`}
              key={tool.slug}
              className="category-tool-card"
            >
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
                        sizes="44px"
                      />
                    ) : null}
                    <h3 className="tool-card-title">{tool.name}</h3>
                  </div>
                  {tool.isTRSupported ? (
                    <span className="tag success small">Türkçe</span>
                  ) : null}
                </div>
                <p className="tool-card-desc">
                  {tool.description.substring(0, 110)}...
                </p>
                <div className="tool-card-footer">
                  <span className="tool-price">
                    {tool.pricing || "Araç incelemesi"}
                  </span>
                  <span className="view-link">İncelemeyi Aç -&gt;</span>
                </div>
              </div>
            </Link>
          ))}
          {categoryTools.length === 0 ? (
            <div className="category-tool-card">
              <div className="tool-card-content">
                <h3 className="tool-card-title">İlk İncelemeler Hazırlanıyor</h3>
                <p className="tool-card-desc">
                  Bu kategori açıldı ve editör çerçevesi kuruldu. İlk araç
                  incelemeleri yayımlandığında burada görünmeye başlayacak.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <article className="category-mdx-content mdx-content">
        <h2 className="sr-only">Kategori içeriği</h2>
        {mdxSource ? (
          <MdxContent source={mdxSource} />
        ) : (
          <PortableTextContent
            value={
              category.body.kind === "portableText" ? category.body.value : []
            }
          />
        )}
      </article>
    </div>
  );
}
