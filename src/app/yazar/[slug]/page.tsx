import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteUrl, formatDisplayDate } from "@/lib/content";
import { getAllAuthors, getAllGuides, getAllTools, getAuthorBySlug } from "@/lib/content-source";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./author.css";

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const [author, settings] = await Promise.all([
    getAuthorBySlug(resolvedParams.slug),
    getSiteSettings(),
  ]);

  if (!author) {
    return { title: "Yazar bulunamadı" };
  }

  return buildMetadata({
    title: `${author.fullName} | ${author.role} | ${settings.name}`,
    description: author.metaDescription || author.bio.substring(0, 155),
    path: `/yazar/${author.slug}`,
    canonicalUrl: author.canonicalUrl,
    type: "profile",
    imagePath: author.avatarUrl,
    twitterImagePath: author.avatarUrl,
    imageAlt: author.avatarAlt || `${author.fullName} profil görseli`,
    noIndex: author.noIndex,
    baseUrl: settings.url,
    siteName: settings.name,
    locale: settings.locale,
    defaultImagePath: settings.defaultSocialImageUrl || "/opengraph-image",
    defaultTwitterImagePath: settings.defaultSocialImageUrl || "/twitter-image",
  });
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const resolvedParams = await params;
  const [author, allTools, allGuides, settings] = await Promise.all([
    getAuthorBySlug(resolvedParams.slug),
    getAllTools(),
    getAllGuides(),
    getSiteSettings(),
  ]);

  if (!author) {
    notFound();
  }

  const authorTools = allTools.filter((item) => item.author?.slug === author.slug);
  const authorGuides = allGuides.filter((item) => item.author?.slug === author.slug);
  const profileUrl = author.canonicalUrl || absoluteUrl(`/yazar/${author.slug}`, settings.url);

  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${author.fullName} profili`,
    url: profileUrl,
    dateCreated: author.profileCreatedAt,
    dateModified: author.profileUpdatedAt,
    mainEntity: {
      "@type": "Person",
      name: author.fullName,
      description: author.bio,
      jobTitle: author.role,
      image: absoluteUrl(author.avatarUrl, settings.url),
      url: profileUrl,
      alumniOf: author.university
        ? {
            "@type": "CollegeOrUniversity",
            name: author.university.split(",")[0].trim(),
          }
        : undefined,
      worksFor: {
        "@type": "Organization",
        name: settings.name,
        url: settings.url,
      },
      knowsAbout: author.expertise,
      sameAs: author.sameAs,
    },
  };

  return (
    <div className="container author-profile-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />

      <Breadcrumbs
        baseUrl={settings.url}
        items={[
          { name: "Ana Sayfa", href: "/" },
          { name: "Yazarlar", href: "/yazar" },
          { name: author.fullName },
        ]}
      />

      <header className="author-hero">
        <div className="author-header-grid">
          <div className="author-avatar-large">
            <img src={author.avatarUrl} alt={author.avatarAlt || `${author.fullName} profil görseli`} loading="eager" />
          </div>
          <div className="author-hero-text">
            <span className="author-role-badge">{author.role}</span>
            <h1 className="author-name-title">{author.fullName}</h1>
            <p className="author-bio-large">{author.bio}</p>
            <div className="author-trust-meta">
              <span className="trust-badge">{author.university}</span>
              <span className="trust-badge">{author.experience}</span>
              <span className="trust-badge">{authorTools.length + authorGuides.length} yayın</span>
              <span className="trust-badge">Profil oluşturma tarihi: {formatDisplayDate(author.profileCreatedAt)}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="author-methodology-section">
        <h2>Uzmanlık alanları ve çalışma yaklaşımı</h2>
        <p>{author.methodologyFocus}</p>
        <ul className="author-expertise-list">
          {author.expertise.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {author.credentials.length > 0 ? (
        <section className="author-methodology-section">
          <h2>Yetkinlikler</h2>
          <ul className="author-expertise-list">
            {author.credentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {author.sameAs.length > 0 ? (
        <section className="author-methodology-section">
          <h2>Dış bağlantılar</h2>
          <div className="author-links">
            {author.sameAs.map((link) => (
              <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="author-link-chip">
                {link}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="author-works-section">
        <h2>{author.name} tarafından yazılan incelemeler</h2>
        {authorTools.length > 0 ? (
          <div className="author-articles-grid">
            {authorTools.map((tool) => (
              <Link href={`/ai/${tool.slug}`} key={tool.slug} className="author-article-card">
                <span className="article-type">Araç incelemesi</span>
                <h3>{tool.title || tool.name}</h3>
                <p>{tool.description.substring(0, 100)}...</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-state">{author.name} henüz bir inceleme yayımlamadı.</p>
        )}
      </section>

      <section className="author-works-section author-guides-section">
        <h2>{author.name} tarafından hazırlanan rehberler</h2>
        {authorGuides.length > 0 ? (
          <div className="author-articles-grid">
            {authorGuides.map((guide) => (
              <Link href={`/rehber/${guide.slug}`} key={guide.slug} className="author-article-card">
                <span className="article-type guide">Uygulamalı rehber</span>
                <h3>{guide.title}</h3>
                <p>{guide.description.substring(0, 100)}...</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-state">{author.name} henüz bir rehber yayımlamadı.</p>
        )}
      </section>
    </div>
  );
}
