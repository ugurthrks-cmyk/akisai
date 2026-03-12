import type { Metadata } from "next";
import Link from "next/link";
import { getAllAuthors } from "@/lib/content-source";
import { absoluteUrl } from "@/lib/content";
import { buildSiteMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/site-settings";
import "./authors.css";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata({
    title: "Yazar profilleri ve editör kadrosu",
    description:
      "İnceleme ve rehber içeriklerini hazırlayan editörleri, araştırmacıları ve otomasyon uzmanlarını yakından tanıyın.",
    path: "/yazar",
  });
}

export default async function AuthorsPage() {
  const [authorList, settings] = await Promise.all([getAllAuthors(), getSiteSettings()]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${settings.name} yazar profilleri`,
    url: absoluteUrl("/yazar", settings.url),
    description: `${settings.name} içeriklerini hazırlayan editörlerin, araştırmacıların ve otomasyon uzmanlarının profil merkezi.`,
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: authorList.map((author, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/yazar/${author.slug}`, settings.url),
      name: author.fullName,
    })),
  };

  return (
    <div className="authors-hub">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <header className="authors-hub-header">
        <h1>Yazar profilleri</h1>
        <p>
          {settings.name}&apos;deki inceleme ve rehber içerikleri, belirli uzmanlık alanlarına göre
          çalışan editörler tarafından hazırlanır. Her profil sayfasında yazarın çalışma odağını,
          uzmanlık sahalarını ve yayımladığı içerikleri ayrıntılı biçimde inceleyebilirsiniz.
        </p>
      </header>

      <section className="authors-grid" aria-label={`${settings.name} yazar listesi`}>
        {authorList.map((author) => (
          <Link href={`/yazar/${author.slug}`} key={author.slug} className="author-directory-card">
            <div className="author-directory-head">
              <img src={author.avatarUrl} alt={`${author.fullName} profil görseli`} loading="lazy" />
              <div>
                <span className="author-directory-role">{author.role}</span>
                <h2>{author.fullName}</h2>
              </div>
            </div>
            <p className="author-directory-bio">{author.bio}</p>
            <div className="author-directory-meta">
              <span>{author.university}</span>
              <span>{author.experience}</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
